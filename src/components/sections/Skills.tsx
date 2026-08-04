"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { skillGroups, type Skill } from "@/data/skills";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

function SkillChip({ skill, index }: { skill: Skill; index: number }) {
  const Icon = skill.icon;
  const reduced = usePrefersReducedMotion();

  return (
    // Hover/tap live on the outer element and the idle float on the inner one,
    // so the two never fight over the same `y` transition.
    <motion.li
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className="group/chip"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -2.5, 0] }}
        transition={
          reduced
            ? undefined
            : {
                // De-phased per chip so the grid breathes instead of pulsing in unison.
                duration: 3.6 + (index % 4) * 0.45,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (index % 6) * 0.28,
              }
        }
        className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-hairline bg-white/[0.035] px-3 py-2.5 transition-[background-color,border-color] duration-300 hover:border-white/25 hover:bg-white/[0.07]"
        style={{ ["--chip" as string]: skill.color }}
      >
        <Icon
          className="h-4 w-4 shrink-0 text-muted transition-colors duration-300 group-hover/chip:text-[var(--chip)]"
          aria-hidden
        />
        <span className="text-[13px] font-medium text-fg/85 transition-colors group-hover/chip:text-white">
          {skill.name}
        </span>
      </motion.div>
    </motion.li>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        index="04"
        label="Skills"
        title="The stack I reach for"
        description="Grouped by where it sits in the system rather than by how well I know it — everything here has shipped in something real."
      />

      <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <RevealItem key={group.id}>
            <GlassCard
              className="h-full p-6"
              tilt={5}
              glow={group.id === "ai" || group.id === "backend" ? "violet" : "cyan"}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{group.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  {group.caption}
                </span>
              </div>

              <div aria-hidden className="rule-glow mt-4" />

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill, i) => (
                  <SkillChip key={skill.name} skill={skill} index={i} />
                ))}
              </ul>
            </GlassCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
