"use client";

import { GitHubCard } from "@/components/stats/GitHubCard";
import { LeetCodeCard } from "@/components/stats/LeetCodeCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";

export function Stats() {
  return (
    <Section id="stats">
      <SectionHeader
        index="05"
        label="Stats"
        title="Receipts"
        description="Pulled live from GitHub and LeetCode. Cached server-side, so a flaky upstream degrades the card and not the page."
      />

      <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr] lg:gap-5">
        <RevealItem className="h-full">
          <GitHubCard />
        </RevealItem>
        <RevealItem className="h-full">
          <LeetCodeCard />
        </RevealItem>
      </Reveal>
    </Section>
  );
}
