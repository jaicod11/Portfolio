"use client";

import { motion, useMotionTemplate } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Tilt magnitude in degrees. 0 disables tilt but keeps the glow. */
  tilt?: number;
  /** Accent used for the hover glow. */
  glow?: "cyan" | "violet" | "none";
  /** Adds a cursor-following spotlight on the card surface. */
  spotlight?: boolean;
  /**
   * Classes for the inner content wrapper. Children live inside that wrapper,
   * so layout modes like `flex flex-col` (needed for `mt-auto` to work) belong
   * here rather than on `className`, which styles the card shell.
   */
  contentClassName?: string;
  as?: "div" | "article" | "li";
};

const glowRing: Record<string, string> = {
  cyan: "hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_18px_60px_-18px_rgba(34,211,238,0.45)]",
  violet:
    "hover:border-accent-2/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.18),0_18px_60px_-18px_rgba(168,85,247,0.45)]",
  none: "",
};

/**
 * Glass bento tile. On fine-pointer devices it tilts toward the cursor in 3D;
 * on touch it degrades to a tap-scale + glow pulse.
 */
export function GlassCard({
  children,
  className,
  tilt = 7,
  glow = "cyan",
  spotlight = false,
  contentClassName,
  as = "div",
}: Props) {
  const { ref, rotateX, rotateY, glareX, glareY, onMouseMove, onMouseLeave, enabled } =
    useTilt(tilt);

  // Motion template keeps the spotlight tracking the cursor every frame.
  const spotlightBg = useMotionTemplate`radial-gradient(22rem 22rem at ${glareX} ${glareY}, rgba(255,255,255,0.07), transparent 60%)`;

  // Indexing `motion[as]` yields an intersection of every element's props,
  // which breaks the ref type — resolve it to one concrete component instead.
  const MotionTag = (
    as === "article" ? motion.article : as === "li" ? motion.li : motion.div
  ) as typeof motion.div;

  const tiltActive = enabled && tilt > 0;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={tiltActive ? onMouseMove : undefined}
      onMouseLeave={tiltActive ? onMouseLeave : undefined}
      style={
        tiltActive
          ? { rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }
          : undefined
      }
      whileTap={enabled ? undefined : { scale: 0.985 }}
      className={cn(
        "glass group relative overflow-hidden rounded-bento",
        "transition-[border-color,box-shadow] duration-500 ease-out",
        glowRing[glow],
        className,
      )}
    >
      {/* Top hairline highlight — reads as a light source above the card. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      {spotlight && tiltActive && (
        <motion.span
          aria-hidden
          style={{ background: spotlightBg }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      <div
        className={cn(
          "relative h-full",
          tiltActive && "[transform:translateZ(28px)]",
          contentClassName,
        )}
      >
        {children}
      </div>
    </MotionTag>
  );
}
