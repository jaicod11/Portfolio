"use client";

import { useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import {
  AlertCircle,
  ExternalLink,
  FolderGit2,
  GitCommitHorizontal,
  Star,
  Users,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CountUp } from "@/components/ui/CountUp";
import { site } from "@/data/site";
import type { GitHubResponse } from "@/types/stats";

/**
 * Sequential single-hue ramp — magnitude, so lightness climbs monotonically
 * from just-above-surface to full accent cyan. Never a multi-hue scale.
 */
const CALENDAR_THEME = {
  dark: ["#15161f", "#0e4f5e", "#12809b", "#1cb2d2", "#22d3ee"],
};

function StatTile({
  icon: Icon,
  value,
  label,
  compact,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number | null;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-white/[0.03] p-3.5">
      <Icon className="h-4 w-4 text-accent" />
      <p className="mt-2.5 font-display text-xl font-semibold tracking-tight">
        {value === null ? (
          <span className="text-faint" title="Unavailable — GitHub rate limit reached">
            —
          </span>
        ) : (
          <CountUp value={value} compact={compact} />
        )}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-wider text-faint">{label}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[92px] rounded-xl" />
        ))}
      </div>
      <div className="skeleton mt-6 h-[120px] w-full rounded-xl" />
    </>
  );
}

export function GitHubCard() {
  const [state, setState] = useState<GitHubResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((r) => r.json())
      .then((d: GitHubResponse) => !cancelled && setState(d))
      .catch(() => !cancelled && setState({ ok: false, error: "Network error." }));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GlassCard className="h-full p-6 sm:p-7" glow="cyan" tilt={4}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">GitHub</p>
          <h3 className="mt-1.5 font-display text-lg font-semibold">
            Contribution activity
          </h3>
        </div>
        <a
          href={`https://github.com/${site.github}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-accent"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div aria-hidden className="rule-glow my-6" />

      {state === null && <Skeleton />}

      {state?.ok === false && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="h-6 w-6 text-faint" />
          <p className="text-sm text-muted">{state.error}</p>
          <a
            href={`https://github.com/${site.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-accent underline underline-offset-4"
          >
            View profile directly
          </a>
        </div>
      )}

      {state?.ok && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              icon={GitCommitHorizontal}
              value={state.totalContributions}
              label="Contributions"
              compact
            />
            <StatTile icon={FolderGit2} value={state.publicRepos} label="Repos" />
            <StatTile icon={Star} value={state.totalStars} label="Stars" />
            <StatTile icon={Users} value={state.followers} label="Followers" />
          </div>

          {/* Horizontal scroll container — a 53-week grid never fits a phone. */}
          <div className="mt-6 -mx-1 overflow-x-auto px-1 pb-1">
            <ActivityCalendar
              data={state.contributions}
              theme={CALENDAR_THEME}
              colorScheme="dark"
              blockSize={11}
              blockMargin={3}
              blockRadius={2}
              fontSize={11}
              showColorLegend
              showMonthLabels
              showTotalCount={false}
              weekStart={0}
              labels={{
                legend: { less: "Less", more: "More" },
                totalCount: "{{count}} contributions in the last year",
              }}
              style={{ color: "#6b7089" }}
            />
          </div>

          <p className="mt-4 font-mono text-[11px] text-faint">
            Last 12 months · {state.totalContributions.toLocaleString("en-US")}{" "}
            contributions
          </p>
        </>
      )}
    </GlassCard>
  );
}
