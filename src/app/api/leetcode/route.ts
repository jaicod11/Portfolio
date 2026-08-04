import { NextResponse } from "next/server";
import { site } from "@/data/site";
import type { LeetCodeResponse } from "@/types/stats";

export const revalidate = 3600;

const USERNAME = site.leetcode;

/* ── Primary: LeetCode's own GraphQL endpoint ──────────────────────────── */

const QUERY = /* GraphQL */ `
  query userStats($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

type DiffCount = { difficulty: string; count: number };

const pick = (rows: DiffCount[], difficulty: string) =>
  rows.find((r) => r.difficulty === difficulty)?.count ?? 0;

async function fetchViaGraphQL(): Promise<LeetCodeResponse> {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // LeetCode rejects requests without a browser-ish Referer.
      Referer: "https://leetcode.com",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
    },
    body: JSON.stringify({ query: QUERY, variables: { username: USERNAME } }),
    next: { revalidate },
  });

  if (!res.ok) throw new Error(`LeetCode responded ${res.status}`);

  const json = await res.json();
  const user = json.data?.matchedUser;
  if (!user) throw new Error("LeetCode user not found");

  const solved: DiffCount[] = user.submitStatsGlobal.acSubmissionNum;
  const all: DiffCount[] = json.data.allQuestionsCount ?? [];

  return {
    ok: true,
    username: user.username,
    total: pick(solved, "All"),
    easy: pick(solved, "Easy"),
    medium: pick(solved, "Medium"),
    hard: pick(solved, "Hard"),
    ranking: user.profile?.ranking ?? null,
    totals: all.length
      ? {
          all: pick(all, "All"),
          easy: pick(all, "Easy"),
          medium: pick(all, "Medium"),
          hard: pick(all, "Hard"),
        }
      : null,
  };
}

/* ── Fallback: community wrapper ───────────────────────────────────────── */

async function fetchViaWrapper(): Promise<LeetCodeResponse> {
  const res = await fetch(
    `https://alfa-leetcode-api.onrender.com/${USERNAME}/solved`,
    { next: { revalidate } },
  );
  if (!res.ok) throw new Error(`Wrapper responded ${res.status}`);

  const d = await res.json();
  if (typeof d?.solvedProblem !== "number") throw new Error("Unexpected wrapper payload");

  return {
    ok: true,
    username: USERNAME,
    total: d.solvedProblem,
    easy: d.easySolved ?? 0,
    medium: d.mediumSolved ?? 0,
    hard: d.hardSolved ?? 0,
    ranking: null,
    totals: null,
  };
}

export async function GET() {
  try {
    return NextResponse.json(await fetchViaGraphQL());
  } catch (err) {
    console.error("[api/leetcode] GraphQL failed, trying wrapper:", err);
  }

  try {
    return NextResponse.json(await fetchViaWrapper());
  } catch (err) {
    console.error("[api/leetcode] wrapper failed:", err);
    return NextResponse.json<LeetCodeResponse>(
      { ok: false, error: "LeetCode stats are unavailable right now." },
      { status: 200 },
    );
  }
}
