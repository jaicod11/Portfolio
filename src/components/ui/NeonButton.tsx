"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

type BaseProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: React.ReactNode;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 " +
  "text-sm font-medium tracking-tight min-h-[44px] select-none " +
  "transition-colors duration-300";

const variants: Record<Variant, string> = {
  primary:
    "text-void bg-gradient-to-r from-accent to-accent-2 " +
    "shadow-[0_8px_30px_-8px_rgba(34,211,238,0.6)] " +
    "hover:shadow-[0_10px_44px_-6px_rgba(168,85,247,0.75)]",
  ghost:
    "glass text-fg hover:text-white hover:border-accent/45 " +
    "hover:shadow-[0_0_28px_-6px_rgba(34,211,238,0.5)]",
};

const motionProps = {
  whileHover: { scale: 1.035 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring" as const, stiffness: 420, damping: 26 },
};

// Framer redefines the drag/animation handlers, so take its prop types rather
// than React's to avoid the incompatible-signature clash.
export function NeonButton({
  children,
  variant = "primary",
  className,
  icon,
  href,
  ...rest
}: BaseProps & HTMLMotionProps<"a"> & { href: string }) {
  return (
    <motion.a
      href={href}
      className={cn(base, variants[variant], className)}
      {...motionProps}
      {...rest}
    >
      {icon}
      {children}
    </motion.a>
  );
}

export function NeonButtonAction({
  children,
  variant = "primary",
  className,
  icon,
  ...rest
}: BaseProps & HTMLMotionProps<"button">) {
  return (
    <motion.button
      className={cn(base, variants[variant], className)}
      {...motionProps}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  );
}
