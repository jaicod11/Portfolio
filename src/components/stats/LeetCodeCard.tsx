"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AlertCircle, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CountUp } from "@/components/ui/CountUp";
import { site } from "@/data/site";
import type { LeetCodeResponse, LeetCodeStats } from "@/types/stats";
import { cn } from "@/lib/utils";

/**
 * Difficulty is ordinal, so the ramp runs cool → warm in the site's own hues.
 * Validated for CVD separation against the #0A0A0F surface
 * (worst adjacent pair ΔE 21.5 deutan / 25.2 normal).
 */
const DIFFICULTY = [
  { key: "easy", label: "Easy", color: "#22D3EE" },
  { key: "medium", label: "Medium", color: "#A855F7" },
  { key: "hard", label: "Hard", color: "#FB7185" },
] as const;

const R = 54;
const CIRC = 2 * Math.PI * R;
/** Surface gap between adjacent arcs, in path units. */
const GAP = 6;

function Donut({ data }: { data: LeetCodeStats }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [hovered, setHovered] = useState<string | null>(null);

  const values = DIFFICULTY.map((d) => ({ ...d, value: data[d.key] }));
  const sum = values.reduce((a, b) => a + b.value, 0) || 1;

  // Prefix sums computed per item rather than by mutating an outer accumulator,
  // which keeps this pure for the compiler (n = 3, so the cost is irrelevant).
  const arcs = values.map((v, i) => {
    const fraction = v.value / sum;
    const start = values.slice(0, i).reduce((acc, prev) => acc + prev.value, 0) / sum;
    return {
      ...v,
      fraction,
      // -90 puts the first segment at 12 o'clock.
      rotation: start * 360 - 90,
      dash: Math.max(fraction * CIRC - GAP, 0),
    };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative shrink-0">
        <svg
          ref={ref}
          viewBox="0 0 140 140"
          className="h-[152px] w-[152px]"
          role="img"
          aria-label={`${data.total} LeetCode problems solved: ${values
            .map((v) => `${v.value} ${v.label}`)
            .join(", ")}`}
        >
          {/* Track */}
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="13"
          />

          {arcs.map((arc) => (
            <motion.circle
              key={arc.key}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={arc.color}
              strokeWidth={hovered === arc.key ? 16 : 13}
              strokeLinecap="round"
              transform={`rotate(${arc.rotation} 70 70)`}
              initial={{ strokeDasharray: `0 ${CIRC}` }}
              animate={
                inView
                  ? { strokeDasharray: `${arc.dash} ${CIRC - arc.dash}` }
                  : { strokeDasharray: `0 ${CIRC}` }
              }
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              onMouseEnter={() => setHovered(arc.key)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-default transition-[stroke-width] duration-200"
              style={{ opacity: hovered && hovered !== arc.key ? 0.35 : 1 }}
            >
              <title>{`${arc.label}: ${arc.value} solved (${Math.round(
                arc.fraction * 100,
              )}%)`}</title>
            </motion.circle>
          ))}
        </svg>

        {/* Hero number */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <CountUp
            value={data.total}
            className="font-display text-3xl font-bold tracking-tight"
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
            solved
          </span>
        </div>
      </div>

      {/* Direct labels — identity never rests on colour alone. */}
      <ul className="w-full space-y-3">
        {arcs.map((arc) => {
          const denominator = data.totals?.[arc.key] ?? null;
          return (
            <li
              key={arc.key}
              onMouseEnter={() => setHovered(arc.key)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "rounded-lg px-2 py-1.5 transition-colors",
                hovered === arc.key && "bg-white/[0.05]",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="flex items-center gap-2 text-[13px] text-fg/85">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: arc.color }}
                  />
                  {arc.label}
                </span>
                {/* nowrap keeps "71 / 958" on one line in the narrow column. */}
                <span className="whitespace-nowrap font-mono text-xs text-fg">
                  {arc.value}
                  {denominator && <span className="text-faint">/{denominator}</span>}
                </span>
              </div>

              {/* Progress against the platform total, when we know it. */}
              {denominator && (
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${(arc.value / denominator) * 100}%` } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: arc.color }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="skeleton h-[152px] w-[152px] shrink-0 rounded-full" />
      <div className="w-full space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-8 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function LeetCodeCard() {
  const [state, setState] = useState<LeetCodeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leetcode")
      .then((r) => r.json())
      .then((d: LeetCodeResponse) => !cancelled && setState(d))
      .catch(() => !cancelled && setState({ ok: false, error: "Network error." }));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GlassCard className="h-full p-6 sm:p-7" glow="violet" tilt={4}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">LeetCode</p>
          <h3 className="mt-1.5 font-display text-lg font-semibold">
            Problem solving
          </h3>
        </div>
        <a
          href={`https://leetcode.com/u/${site.leetcode}/`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LeetCode profile"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-accent-2"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div aria-hidden className="rule-glow my-6" />

      {state === null && <Skeleton />}

      {state?.ok === false && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertCircle className="h-6 w-6 text-faint" />
          <p className="text-sm text-muted">{state.error}</p>
          <a
            href={`https://leetcode.com/u/${site.leetcode}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-accent-2 underline underline-offset-4"
          >
            View profile directly
          </a>
        </div>
      )}

      {state?.ok && <Donut data={state} />}

      {state?.ok && state.ranking && (
        <p className="mt-6 border-t border-hairline pt-4 font-mono text-[11px] text-faint">
          Global ranking{" "}
          <span className="text-accent-2">#{state.ranking.toLocaleString("en-US")}</span>
        </p>
      )}
    </GlassCard>
  );
}
