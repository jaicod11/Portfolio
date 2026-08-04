"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  /** Zero-padded section number, e.g. "03". */
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
};

export function SectionHeader({ index, label, title, description, className }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 130, damping: 20 }}
      className={cn("mb-10 md:mb-14", className)}
    >
      <div className="flex items-center gap-3">
        <span className="eyebrow text-accent">{index}</span>
        <span aria-hidden className="h-px w-8 bg-hairline" />
        <span className="eyebrow">{label}</span>
      </div>

      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
      )}
    </motion.header>
  );
}

/** Full-width section wrapper with consistent rhythm and scroll offset. */
export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-6 md:py-28",
        className,
      )}
    >
      {children}
    </section>
  );
}
