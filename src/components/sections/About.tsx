"use client";

import { Briefcase, GraduationCap, MapPin, Sparkles, Terminal } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/data/site";

const currentlyLearning = [
  "Distributed systems",
  "Rust",
  "Kubernetes",
  "System design",
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
        description="I like problems where correctness is measurable — pipelines that must not drop rows, editors that must not lose keystrokes, models that must not guess."
      />

      <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(0,1fr)]">
        {/* ── Bio (wide) ───────────────────────────────────── */}
        <RevealItem className="md:col-span-2 md:row-span-2">
          <GlassCard className="h-full p-6 sm:p-8" spotlight glow="cyan">
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
              <p>
                I&apos;m a final-year CS undergraduate at VIT-AP, currently an{" "}
                <span className="text-fg">SDE Intern at Bluestock Fintech</span>, where I
                build production ETL pipelines and data infrastructure for a financial
                intelligence platform covering Indian equity markets.
              </p>
              <p>
                My work sits mostly on the backend — I&apos;ve shipped a Financial Ratio
                Engine computing 30+ KPIs across 1,073 company-year records, an agentic RAG
                pipeline over a multi-format corpus, and a real-time collaborative editor
                with an Operational Transformation engine written from scratch.
              </p>
              <p>
                I care about the unglamorous parts: schema integrity, regression suites, and
                latency budgets that hold up under concurrency.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
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
            <p className="eyebrow mt-4">Currently</p>
            <h4 className="mt-2 font-display text-lg font-semibold">Bluestock Fintech</h4>
            <p className="mt-1 text-sm text-muted">SDE Intern · Remote</p>
            <p className="mt-3 font-mono text-[11px] text-faint">May 2026 — Present</p>

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
              <span className="font-mono text-[11px] text-accent">CGPA 7.6/10</span>
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

            <ul className="mt-5 flex flex-wrap gap-2">
              {currentlyLearning.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-accent-2/25 bg-accent-2/10 px-3 py-1.5 font-mono text-xs text-accent-2/90"
                >
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-muted">
              Right now I&apos;m going deeper on how systems behave when they scale
              horizontally — consensus, partitioning, and the failure modes that only show
              up under real load.
            </p>
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
              solved to a Nash equilibrium. It will never lose. You can try.
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
