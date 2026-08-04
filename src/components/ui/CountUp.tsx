"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { compactNumber } from "@/lib/utils";

type Props = {
  value: number;
  duration?: number;
  suffix?: string;
  /** Abbreviate large values (12345 -> "12.3k"). */
  compact?: boolean;
  className?: string;
};

/** Animated count-up that fires once when scrolled into view. */
export function CountUp({
  value,
  duration = 1400,
  suffix = "",
  compact = false,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Under reduced motion the value is derived during render instead, so
    // there's no synchronous setState here.
    if (!inView || reduced) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast start, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  // Reduced motion snaps straight to the final value once it's in view.
  const shown = reduced ? (inView ? value : 0) : display;

  return (
    <span ref={ref} className={className}>
      {compact ? compactNumber(shown) : shown.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
