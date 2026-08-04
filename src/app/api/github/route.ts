import { NextResponse } from "next/server";
import { site } from "@/data/site";
import type { ContributionDay, GitHubResponse } from "@/types/stats";

// Cache for an hour — contribution data doesn't need to be fresher than that,
// and it keeps us well inside GitHub's unauthenticated rate limit.
export const revalidate = 3600;

const USERNAME = site.github;
const UA = "nebula-bento-portfolio";

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

/* ── Primary path: GitHub GraphQL (needs GITHUB_TOKEN) ─────────────────── */

const QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      followers {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        totalCount
        nodes {
          stargazerCount
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

type GqlDay = {
  date: string;
  contributionCount: number;
  contributionLevel: keyof typeof LEVELS;
};

async function fetchViaGraphQL(token: string): Promise<GitHubResponse> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": UA,
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
    next: { revalidate },
  });

  if (!res.ok) throw new Error(`GraphQL responded ${res.status}`);

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "GraphQL error");

  const user = json.data?.user;
  if (!user) throw new Error("User not found");

  const calendar = user.contributionsCollection.contributionCalendar;
  const contributions: ContributionDay[] = calendar.weeks.flatMap(
    (w: { contributionDays: GqlDay[] }) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel] ?? 0,
      })),
  );

  const totalStars = (user.repositories.nodes as { stargazerCount: number }[]).reduce(
    (sum, r) => sum + r.stargazerCount,
    0,
  );

  return {
    ok: true,
    source: "graphql",
    username: USERNAME,
    totalContributions: calendar.totalContributions,
    publicRepos: user.repositories.totalCount,
    totalStars,
    followers: user.followers.totalCount,
    contributions,
  };
}

/* ── Fallback: public endpoints, no token required ─────────────────────── */

/**
 * Parses the contribution grid GitHub serves at /users/<login>/contributions.
 *
 * Each day is a <td data-date data-level id="contribution-day-component-R-C">,
 * and the count only appears in a sibling <tool-tip for="<that id>"> — so the
 * two have to be joined by id.
 */
function parseContributionHtml(html: string): ContributionDay[] {
  const counts = new Map<string, number>();
  const tooltipRe = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;

  for (const m of html.matchAll(tooltipRe)) {
    const [, forId, text] = m;
    const numMatch = text.match(/^([\d,]+)\s+contribution/i);
    counts.set(forId, numMatch ? Number(numMatch[1].replace(/,/g, "")) : 0);
  }

  const days: ContributionDay[] = [];
  const cellRe = /<td[^>]*class="ContributionCalendar-day"[^>]*>/g;

  for (const m of html.matchAll(cellRe)) {
    const tag = m[0];
    const date = tag.match(/data-date="([^"]+)"/)?.[1];
    // Cells past today are rendered without a date; skip them.
    if (!date) continue;

    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    const id = tag.match(/id="([^"]+)"/)?.[1] ?? "";

    days.push({
      date,
      count: counts.get(id) ?? 0,
      level: (Math.min(4, Math.max(0, level)) as ContributionDay["level"]) ?? 0,
    });
  }

  // The grid is emitted column-major (week by week); the calendar wants ascending dates.
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchViaPublic(): Promise<GitHubResponse> {
  const [contribRes, userRes, reposRes] = await Promise.all([
    fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      next: { revalidate },
    }),
    fetch(`https://api.github.com/users/${USERNAME}`, {
      headers: { "User-Agent": UA, Accept: "application/vnd.github+json" },
      next: { revalidate },
    }),
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner`, {
      headers: { "User-Agent": UA, Accept: "application/vnd.github+json" },
      next: { revalidate },
    }),
  ]);

  // Only the calendar is load-bearing. The contributions page is plain HTML and
  // isn't subject to the REST quota, whereas api.github.com allows just 60
  // unauthenticated requests/hour — so treat the profile and repo counts as
  // best-effort and still return the heatmap when that quota is spent.
  if (!contribRes.ok) throw new Error(`Contributions page responded ${contribRes.status}`);

  const contributions = parseContributionHtml(await contribRes.text());
  if (contributions.length === 0) throw new Error("Could not parse contribution grid");

  let publicRepos: number | null = null;
  let followers: number | null = null;
  if (userRes.ok) {
    const user = await userRes.json();
    publicRepos = user.public_repos ?? null;
    followers = user.followers ?? null;
  } else {
    console.warn(`[api/github] user API responded ${userRes.status}; omitting profile counts`);
  }

  let totalStars: number | null = null;
  if (reposRes.ok) {
    const repos: { stargazers_count: number; fork: boolean }[] = await reposRes.json();
    totalStars = repos
      .filter((r) => !r.fork)
      .reduce((sum, r) => sum + r.stargazers_count, 0);
  }

  return {
    ok: true,
    source: "public",
    username: USERNAME,
    totalContributions: contributions.reduce((sum, d) => sum + d.count, 0),
    publicRepos,
    totalStars,
    followers,
    contributions,
  };
}

/* ── Handler ───────────────────────────────────────────────────────────── */

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  // Try the token path first for exact totals, then fall back to public
  // scraping so the card still works on a fresh clone with no env set.
  if (token) {
    try {
      return NextResponse.json(await fetchViaGraphQL(token));
    } catch (err) {
      console.error("[api/github] GraphQL failed, falling back to public:", err);
    }
  }

  try {
    return NextResponse.json(await fetchViaPublic());
  } catch (err) {
    console.error("[api/github] public fallback failed:", err);
    return NextResponse.json<GitHubResponse>(
      { ok: false, error: "GitHub stats are unavailable right now." },
      { status: 200 }, // 200 so the client renders the fallback, not an error boundary.
    );
  }
}
