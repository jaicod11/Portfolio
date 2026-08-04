"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { site, socials } from "@/data/site";
import { HeroVisual } from "@/components/three/HeroVisual";
import { NeonButton, NeonButtonAction } from "@/components/ui/NeonButton";
import { scrollToSection } from "@/lib/scroll";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 19, mass: 0.8 },
  },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center overflow-hidden px-5 pb-16 pt-28 sm:px-6 md:pt-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-6">
        {/* ── Copy ─────────────────────────────────────────── */}
        <motion.div variants={container} initial="hidden" animate="show" className="relative">
          <motion.p
            variants={line}
            className="eyebrow flex items-center gap-2.5 text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for SDE roles · 2027
          </motion.p>

          <motion.h1
            variants={line}
            className="mt-5 font-display text-[clamp(2.6rem,8vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]"
          >
            Jaideep
            <br />
            <span className="text-gradient">Kundu</span>
          </motion.h1>

          <motion.p
            variants={line}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            {site.blurb}
          </motion.p>

          <motion.p
            variants={line}
            className="mt-3 font-mono text-xs text-faint sm:text-[13px]"
          >
            {site.tagline}
          </motion.p>

          <motion.div variants={line} className="mt-9 flex flex-wrap items-center gap-3">
            <NeonButtonAction
              onClick={() => scrollToSection("projects")}
              icon={<ArrowUpRight className="h-4 w-4" />}
            >
              View Projects
            </NeonButtonAction>

            <NeonButton
              href={site.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              icon={<FileText className="h-4 w-4" />}
            >
              Resume
            </NeonButton>
          </motion.div>

          {/* Socials */}
          <motion.ul variants={line} className="mt-9 flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon, hoverClass }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass group grid h-11 w-11 place-items-center rounded-xl text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_0_22px_-6px_rgba(34,211,238,0.65)]"
                >
                  <Icon className={`h-[18px] w-[18px] transition-colors ${hoverClass}`} />
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ── 3D centrepiece ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="pointer-events-none relative order-first h-[38vh] md:order-none md:h-auto"
        >
          <HeroVisual />
        </motion.div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        onClick={() => scrollToSection("about")}
        aria-label="Scroll to About"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint transition-colors hover:text-accent sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}
