"use client";

import { useCallback, useRef } from "react";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useHasFinePointer, usePrefersReducedMotion } from "./useMediaQuery";

type TiltResult = {
  ref: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** Normalised cursor position, for driving a glare/spotlight layer. */
  glareX: MotionValue<string>;
  glareY: MotionValue<string>;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
  /** False on touch devices / reduced motion — callers skip preserve-3d then. */
  enabled: boolean;
};

/**
 * Mouse-position-based 3D tilt. Disabled on coarse pointers and when the user
 * has asked for reduced motion, so touch devices fall back to tap feedback.
 */
export function useTilt(maxDeg = 8): TiltResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const finePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const rotateX = useTransform(sy, [0, 1], [maxDeg, -maxDeg]);
  const rotateY = useTransform(sx, [0, 1], [-maxDeg, maxDeg]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
    },
    [enabled, x, y],
  );

  const onMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return { ref, rotateX, rotateY, glareX, glareY, onMouseMove, onMouseLeave, enabled };
}
