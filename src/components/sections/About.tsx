"use client";

import { Briefcase, GraduationCap, MapPin, Sparkles, Terminal } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/data/site";

/* A note under each item is the difference between "I listed a buzzword"
   and "I'm actually working through this" — and it gives the two-column
   card enough content to fill the width it already spans. */
const currentlyLearning = [
  { name: "Distributed systems", note: "Raft, quorums, partition tolerance" },
  { name: "Rust", note: "ownership, zero-cost abstractions" },
  { name: "Kubernetes", note: "operators and self-healing deploys" },
  { name: "System design", note: "trade-offs under real constraints" },
];

/* The bio card is stretched to match the two cards beside it, which left a
   dead band in its middle. Filling that with more prose would undo what's
   good about the card — it reads in six seconds. Structure instead. */
const rightNow = [
  ["Building", "ApexMatch — C++ limit-order-book matcher"],
  ["Reading", "And Then There Were None — Agatha Christie"],
  ["Also", "chess, on and off since school"],
  ["Lately", "losing to my own Tic-Tac-Toe engine"],
];

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        index="02"
        label="About"
        title={
          <>
            Backend depth,
            <br className="hidden sm:block" /> shipped end to end.
          </>
        }
        description="I build systems where correctness is measurable — pipelines that don't drop rows, editors that don't lose keystrokes, models built on data you can audit. Most of what I make starts as a question I want answered myself."
      />

      <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(0,1fr)]">
        {/* ── Bio (wide) ───────────────────────────────────── */}
        <RevealItem className="md:col-span-2 md:row-span-2">
          <GlassCard
            className="h-full p-6 sm:p-8"
            contentClassName="flex flex-col"
            spotlight
            glow="cyan"
          >
            <div className="flex items-start gap-5">
              {/* Monogram stands in for a photo — drop an <Image> here to swap. */}
              <div className="relative hidden shrink-0 sm:block">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 font-display text-xl font-bold text-void">
                  JK
                </div>
                <div className="absolute -inset-2 -z-10 rounded-2xl bg-accent/25 blur-xl" />
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold sm:text-2xl">
                  {site.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-accent">{site.role}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-[15px]">
              <p>CS undergrad at VIT-AP, 2023–2027.</p>
              <p>
                How does OT actually resolve two edits landing at once? How does a matching
                engine stay fast under load? I tend to build the thing rather than read about it.
              </p>
              <p>
                At <span className="text-fg">Bluestock Fintech</span> I built the ETL and
                ratio engine behind a Nifty 100 platform, and the test suite that kept it
                honest.
              </p>
            </div>

            {/* Occupies the gap the row-span leaves, and says the one thing
                the rest of this section doesn't: what's happening now. */}
            <dl className="mt-8 space-y-3 border-t border-hairline pt-6">
              {rightNow.map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-[4.5rem] shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">
                    {k}
                  </dt>
                  <dd className="text-sm text-muted">{v}</dd>
                </div>
              ))}
            </dl>

            {/* mt-auto pins the chips to the card base regardless of how the
                row-span resolves, so the stack above stays top-aligned. */}
            <div className="mt-auto flex flex-wrap gap-2 pt-8">
              {["Python", "SQL", "Node.js", "React", "Docker"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-hairline bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </GlassCard>
        </RevealItem>

        {/* ── Experience ───────────────────────────────────── */}
        <RevealItem>
          <GlassCard className="h-full p-6" glow="violet">
            <Briefcase className="h-5 w-5 text-accent-2" />
            <p className="eyebrow mt-4">Experience</p>
            <h4 className="mt-2 font-display text-lg font-semibold">Bluestock Fintech</h4>
            <p className="mt-1 text-sm text-muted">SDE Intern · Remote</p>
            <p className="mt-3 font-mono text-[11px] text-faint">May 2026 — July 2026</p>

            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-hairline pt-4">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  Rows
                </dt>
                <dd className="font-display text-lg font-semibold text-accent">12,109+</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  Tests passing
                </dt>
                <dd className="font-display text-lg font-semibold text-accent">157</dd>
              </div>
            </dl>
          </GlassCard>
        </RevealItem>

        {/* ── Education ────────────────────────────────────── */}
        <RevealItem>
          <GlassCard className="h-full p-6" glow="cyan">
            <GraduationCap className="h-5 w-5 text-accent" />
            <p className="eyebrow mt-4">Education</p>
            <h4 className="mt-2 font-display text-lg font-semibold leading-snug">
              Vellore Institute of Technology
            </h4>
            <p className="mt-1 text-sm text-muted">B.Tech, Computer Science &amp; Engg.</p>

            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
              <span className="font-mono text-[11px] text-faint">2023 — 2027</span>
              <span className="font-mono text-[11px] text-accent">CGPA 8.6/10</span>
            </div>
          </GlassCard>
        </RevealItem>

        {/* ── Currently learning ───────────────────────────── */}
        <RevealItem className="md:col-span-2">
          <GlassCard className="h-full p-6" glow="violet">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-accent-2" />
              <p className="eyebrow">Currently learning</p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              Going deeper on how systems behave when they scale horizontally — consensus,
              partitioning, and the failure modes that only show up under real load.
            </p>

            {/* Two columns rather than a chip row: this card already spans the
                grid's full width, it just wasn't using it. */}
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentlyLearning.map(({ name, note }) => (
                <li
                  key={name}
                  className="rounded-lg border border-accent-2/25 bg-accent-2/[0.07] px-4 py-3"
                >
                  <p className="font-mono text-xs text-accent-2/90">{name}</p>
                  <p className="mt-1 text-[13px] leading-snug text-muted">{note}</p>
                </li>
              ))}
            </ul>
          </GlassCard>
        </RevealItem>

        {/* ── Fun fact ─────────────────────────────────────── */}
        <RevealItem>
          <GlassCard className="h-full p-6" glow="cyan">
            <Sparkles className="h-5 w-5 text-accent" />
            <p className="eyebrow mt-4">Fun fact</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              I once wrote a Tic-Tac-Toe engine that is mathematically{" "}
              <span className="text-fg">unbeatable</span> — NegaMax with alpha-beta pruning,
              solved to a Nash equilibrium. It has never lost.
            </p>

            <div className="mt-5 flex items-center gap-1.5 border-t border-hairline pt-4 text-faint">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px]">{site.location}</span>
            </div>
          </GlassCard>
        </RevealItem>
      </Reveal>
    </Section>
  );
}