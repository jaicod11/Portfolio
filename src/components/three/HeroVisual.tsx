"use client";

import dynamic from "next/dynamic";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Three.js never reaches the mobile bundle path until this resolves, and it
// never runs on the server.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <StaticOrb />,
});

/**
 * CSS-only stand-in used on mobile, during canvas load, and under
 * prefers-reduced-motion. No WebGL context, no rAF loop, no battery cost.
 */
function StaticOrb() {
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden>
      <div className="relative h-56 w-56 sm:h-72 sm:w-72">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#67e8f9,#22d3ee_28%,#7c3aed_68%,#2e1065_100%)] opacity-80 blur-[2px]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_75%,rgba(168,85,247,0.55),transparent_60%)] mix-blend-screen" />
        <div className="absolute -inset-8 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute -inset-5 rounded-full border border-accent-2/20" />
      </div>
    </div>
  );
}

export function HeroVisual() {
  // Both hooks return false on the server and on the first client render, so
  // the canvas only mounts after hydration — no separate `mounted` guard needed.
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  const useCanvas = isDesktop && !reducedMotion;

  return (
    <div className="absolute inset-0 -z-10 md:relative md:z-0 md:h-[min(72vh,620px)] md:w-full">
      {useCanvas ? <HeroCanvas /> : <StaticOrb />}
    </div>
  );
}
