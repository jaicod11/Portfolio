/** Shape consumed by react-activity-calendar. */
export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubStats = {
  ok: true;
  /** "graphql" when a GITHUB_TOKEN was available, "public" for the fallback. */
  source: "graphql" | "public";
  username: string;
  totalContributions: number;
  publicRepos: number;
  totalStars: number;
  followers: number;
  contributions: ContributionDay[];
};

export type LeetCodeStats = {
  ok: true;
  username: string;
  total: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number | null;
  /** Totals available on the platform, for the "x of y" denominators. */
  totals: { easy: number; medium: number; hard: number; all: number } | null;
};

export type StatsError = { ok: false; error: string };

export type GitHubResponse = GitHubStats | StatsError;
export type LeetCodeResponse = LeetCodeStats | StatsError;
