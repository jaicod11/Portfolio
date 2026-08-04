"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
// lucide dropped brand marks; simple-icons still ships the GitHub logo.
import { SiGithub as Github } from "react-icons/si";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectPoster } from "@/components/ui/ProjectPoster";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import {
  featuredProjects,
  otherProjects,
  otherProjectTags,
  type Project,
} from "@/data/projects";
import { cn } from "@/lib/utils";

/* ── Featured card ──────────────────────────────────────── */

function FeaturedCard({ project }: { project: Project }) {
  return (
    <GlassCard as="article" className="h-full" glow="cyan" tilt={6}>
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-bento">
        <ProjectPoster
          title={project.title}
          image={project.image}
          accent={project.accent}
        />

        {/* Hover overlay with the two actions */}
        <div className="absolute inset-0 flex items-end justify-center gap-3 bg-gradient-to-t from-ink via-ink/60 to-transparent p-5 opacity-0 transition-opacity duration-400 group-hover:opacity-100 focus-within:opacity-100">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 text-sm font-medium text-void transition-transform duration-200 hover:scale-105"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="glass inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-medium text-fg transition-all duration-200 hover:scale-105 hover:border-accent/50"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {project.title}
          </h3>
          {/* Always-available links for keyboard and touch users. */}
          <div className="flex shrink-0 gap-1.5">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-accent"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-accent"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>

        {/* Metrics */}
        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-y border-hairline py-4">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-lg font-semibold text-accent">{m.value}</dd>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* Stack */}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-hairline bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}

/* ── Filterable list ────────────────────────────────────── */

function OtherProjectRow({
  title,
  blurb,
  stack,
  repo,
  live,
}: (typeof otherProjects)[number]) {
  const [open, setOpen] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="glass overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_12px_36px_-18px_rgba(34,211,238,0.5)]"
    >
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-h-[44px] flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-faint transition-transform duration-300",
              open && "rotate-180 text-accent",
            )}
          />
          <span className="font-display text-[15px] font-medium">{title}</span>
          <span className="hidden gap-1.5 sm:flex">
            {stack.slice(0, 3).map((t) => (
              <span key={t} className="font-mono text-[10px] text-faint">
                {t}
              </span>
            ))}
          </span>
        </button>

        <div className="flex shrink-0 gap-1">
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} live site`}
              className="grid h-10 w-10 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-accent"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} on GitHub`}
            className="grid h-10 w-10 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-accent"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-hairline px-4 pb-4 pt-3">
              <p className="text-sm leading-relaxed text-muted">{blurb}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-hairline bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function Projects() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      activeTag ? otherProjects.filter((p) => p.stack.includes(activeTag)) : otherProjects,
    [activeTag],
  );

  return (
    <Section id="projects">
      <SectionHeader
        index="03"
        label="Projects"
        title="Things I've built"
        description="Four I'd defend in an interview, and the rest of the shelf below."
      />

      {/* Featured 2×2 */}
      <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {featuredProjects.map((p) => (
          <RevealItem key={p.slug} className="h-full">
            <FeaturedCard project={p} />
          </RevealItem>
        ))}
      </Reveal>

      {/* Other projects */}
      <div className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display text-xl font-semibold tracking-tight">
            Other projects
          </h3>
          <span className="font-mono text-[11px] text-faint">
            {visible.length} of {otherProjects.length}
          </span>
        </div>

        {/* Tag filter */}
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">
          <FilterChip
            label="All"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {otherProjectTags.map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>

        <motion.ul layout className="mt-6 flex flex-col gap-2.5">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <OtherProjectRow key={p.title} {...p} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </Section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative rounded-full border px-3.5 py-2 font-mono text-[11px] transition-all duration-300",
        active
          ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_18px_-6px_rgba(34,211,238,0.7)]"
          : "border-hairline bg-white/[0.03] text-muted hover:border-white/25 hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
