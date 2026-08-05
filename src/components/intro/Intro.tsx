"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getLenis } from "@/lib/scroll";
import { createParticleField, type FieldController } from "./particleField";

const EYEBROW = "SOFTWARE ENGINEER · VIT-AP · 2027";
const NAME = "Jaideep Kundu";
const SUBLINE = "Backends that survive contact with real load.";

/* ── Timeline, in ms from mount ─────────────────────────────── */
const TYPE_DURATION = 1100; // beat 1 — eyebrow types on
const ASSEMBLE_AT = TYPE_DURATION; // beat 2 — particles coalesce
const ASSEMBLE_DURATION = 2600;
const HOLD_AFTER_ASSEMBLE = 1100;
const SUBLINE_AT = ASSEMBLE_AT + ASSEMBLE_DURATION + HOLD_AFTER_ASSEMBLE; // 4800
const SUBLINE_FADE = 600;
const HOLD_AFTER_SUBLINE = 2000;
const DISSOLVE_AT = SUBLINE_AT + SUBLINE_FADE + HOLD_AFTER_SUBLINE; // 7400
const DISSOLVE_DURATION = 800;

/** The splash must never be able to permanently block the site. */
const HARD_TIMEOUT = 12_000;

/** useLayoutEffect warns during SSR, where there is nothing to measure. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Intro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<FieldController | null>(null);

  // Refs rather than state for the guards: these are read inside effects that
  // must not re-run, and a stale render value would let the intro finish twice.
  const finishedRef = useRef(false);
  const dissolvingRef = useRef(false);

  const [reduced, setReduced] = useState(false);
  const [typed, setTyped] = useState(0);
  const [showSubline, setShowSubline] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [skipped, setSkipped] = useState(false);

  /* ── Finishing ────────────────────────────────────────────── */

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    // Handing control back is the one step that must never be skipped, so the
    // cleanup around it can't be allowed to throw past this point — otherwise a
    // failure here would strand the overlay permanently.
    try {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
      // Next can restore a previous scroll offset on reload; without this the
      // curtain would lift onto the middle of the page.
      window.scrollTo(0, 0);
    } catch {
      /* best-effort cleanup */
    }

    onDone();
  }, [onDone]);

  const beginDissolve = useCallback(() => {
    if (finishedRef.current || dissolvingRef.current) return;
    dissolvingRef.current = true;
    setDissolving(true);
    // Armed before anything that could throw, so the curtain always lifts.
    window.setTimeout(finish, DISSOLVE_DURATION);
    try {
      window.scrollTo(0, 0);
    } catch {
      /* best-effort */
    }
  }, [finish]);

  const skip = useCallback(() => {
    setSkipped(true);
    beginDissolve();
  }, [beginDissolve]);

  /* ── Reduced motion: skip straight to the hero ────────────── */

  useIsomorphicLayoutEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setReduced(true);
    // Layout effects run before paint and before the passive effects below, so
    // the overlay never shows and no WebGL context is ever created.
    finish();
  }, [finish]);

  /* ── Scroll lock + hard timeout ───────────────────────────── */

  useEffect(() => {
    if (finishedRef.current) return;

    window.scrollTo(0, 0);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // SmoothScroll mounts in the root layout; if its effect hasn't run yet the
    // Lenis instance is still null, so retry on the next frame.
    const stopLenis = () => getLenis()?.stop();
    stopLenis();
    const lenisRaf = requestAnimationFrame(stopLenis);

    const bail = window.setTimeout(finish, HARD_TIMEOUT);

    return () => {
      cancelAnimationFrame(lenisRaf);
      window.clearTimeout(bail);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [finish]);

  /* ── Escape skips ─────────────────────────────────────────── */

  useEffect(() => {
    if (finishedRef.current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  /* ── Beat 1: type the eyebrow ─────────────────────────────── */

  useEffect(() => {
    if (finishedRef.current) return;
    const id = window.setInterval(() => {
      setTyped((n) => (n >= EYEBROW.length ? n : n + 1));
    }, TYPE_DURATION / EYEBROW.length);
    return () => window.clearInterval(id);
  }, []);

  /* ── Beats 2 & 3: particles, sub-line, dissolve ───────────── */

  useEffect(() => {
    if (finishedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      finish();
      return;
    }

    const t0 = performance.now();
    const timers: number[] = [];
    let cancelled = false;

    /** Schedules against mount time, so a slow font load can't shift beat 3. */
    const at = (target: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, Math.max(target - (performance.now() - t0), 0)));

    createParticleField(canvas, NAME)
      .then((field) => {
        if (cancelled) {
          field?.dispose();
          return;
        }
        // Zero sampled points or a failed WebGL init: go straight to the site
        // rather than holding an empty black overlay.
        if (!field) {
          finish();
          return;
        }

        fieldRef.current = field;
        at(ASSEMBLE_AT, () => field.startAssembly(ASSEMBLE_DURATION));
        at(SUBLINE_AT, () => setShowSubline(true));
        at(DISSOLVE_AT, beginDissolve);
      })
      .catch(() => {
        if (!cancelled) finish();
      });

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      fieldRef.current?.dispose();
      fieldRef.current = null;
    };
  }, [finish, beginDissolve]);

  if (reduced) return null;

  const typing = typed < EYEBROW.length;

  return (
    <motion.div
      aria-label="Intro animation"
      initial={{ opacity: 1 }}
      animate={{ opacity: dissolving ? 0 : 1 }}
      transition={{ duration: DISSOLVE_DURATION / 1000, ease: [0.16, 1, 0.3, 1] }}
      // z-100 clears the navbar (z-50) and its scrim (z-40), so nothing from
      // the page shows through or stays clickable underneath.
      className="fixed inset-0 z-[100] overflow-hidden bg-void"
      style={{ pointerEvents: dissolving ? "none" : "auto" }}
      data-intro-overlay=""
    >
      {/*
        The overlay is server-rendered so there's no flash of the hero before
        hydration — but that means without JS nothing would ever take it down,
        and every escape hatch here (skip, Escape, the 12s timeout) is a client
        effect. This is the one dismissal that needs no JavaScript at all.
      */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>[data-intro-overlay]{display:none!important}</style>",
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Vignette over the field, darkening toward the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10,10,15,0.55) 65%, var(--color-void) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* Beat 1 */}
        <p
          className="font-mono text-[11px] uppercase text-accent sm:text-xs"
          style={{ letterSpacing: "0.3em" }}
        >
          {/* Announce the finished line once, not one character at a time. */}
          <span className="sr-only">{EYEBROW}</span>
          <span aria-hidden>{EYEBROW.slice(0, typed)}</span>
          {typing && (
            <motion.span
              aria-hidden
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
              className="ml-0.5 inline-block"
            >
              ▌
            </motion.span>
          )}
        </p>

        {/* Beat 2 lives here — the name is drawn by the particle canvas. */}
        <div className="h-[26vh] max-h-56 sm:h-[30vh]" />

        {/* Beat 3 */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={showSubline ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: SUBLINE_FADE / 1000, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md text-center text-sm text-muted sm:text-base"
        >
          {SUBLINE}
        </motion.p>
      </div>

      <motion.button
        type="button"
        onClick={skip}
        initial={{ opacity: 0 }}
        animate={{ opacity: skipped ? 0 : 1 }}
        // Focusable from the first frame — a keyboard user must never have to
        // wait out a fade-in to escape the animation.
        whileFocus={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: skipped ? 0 : 0.5 }}
        className="absolute bottom-6 right-6 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 font-mono text-[11px] text-muted backdrop-blur-md transition-colors hover:border-accent/40 hover:text-fg"
      >
        Skip <span className="text-faint">esc</span>
      </motion.button>
    </motion.div>
  );
}
