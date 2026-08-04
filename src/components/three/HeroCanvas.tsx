"use client";

import { Canvas } from "@react-three/fiber";
import { NebulaObject } from "./NebulaObject";

/**
 * Default-exported for `next/dynamic`. Only ever mounted on desktop-sized
 * viewports — see HeroVisual.
 */
export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      // Cap DPR: retina at 3x would triple the fragment cost for no visible gain.
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // Nothing here needs pointer events; let clicks fall through to the CTAs.
      style={{ pointerEvents: "none" }}
    >
      <NebulaObject interactive particleCount={550} />
    </Canvas>
  );
}
