"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 140, damping: 20, mass: 0.7 },
  },
};

/**
 * Scroll-triggered reveal. Wrap a group in <Reveal> and each child in
 * <RevealItem> to get a staggered entrance; `once` keeps it from replaying.
 */
export function Reveal({
  children,
  className,
  amount = 0.2,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  delay?: number;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delayChildren: delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span" | "p" | "h2" | "h3";
}) {
  const Tag = motion[as];
  return (
    <Tag variants={item} className={cn(className)}>
      {children}
    </Tag>
  );
}

export { item as revealItemVariants, container as revealContainerVariants };
