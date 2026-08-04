"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const CYAN = "#22d3ee";
const VIOLET = "#a855f7";

/**
 * Seeded PRNG (mulberry32). Deterministic, so generating the star field stays
 * a pure computation — Math.random() during render is neither pure nor stable
 * across re-renders.
 */
function makeRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Star field around the core. Points are cheap, but the count is still kept
 * modest so mid-range laptops stay at 60fps.
 */
function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const rand = makeRandom(0x9e3779b9);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell so nothing sits inside the core.
      const r = 3.1 + rand() * 3.4;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.028;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        color={CYAN}
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Wireframe shell that counter-rotates against the solid core. */
function Shell() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.09;
    ref.current.rotation.x += delta * 0.035;
  });

  return (
    <Icosahedron ref={ref} args={[2.02, 1]}>
      <meshBasicMaterial
        color={VIOLET}
        wireframe
        transparent
        opacity={0.16}
        depthWrite={false}
      />
    </Icosahedron>
  );
}

function Core({ interactive }: { interactive: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;

    // Constant slow spin.
    mesh.rotation.y += delta * 0.16;

    if (interactive) {
      // Warp toward the cursor: pointer is normalised -1..1.
      target.current.set(
        (state.pointer.x * viewport.width) / 26,
        (state.pointer.y * viewport.height) / 26,
      );
      // Damped follow so it never snaps.
      mesh.rotation.x = THREE.MathUtils.lerp(
        mesh.rotation.x,
        -target.current.y * 0.55,
        0.045,
      );
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, target.current.x * 0.4, 0.045);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, target.current.y * 0.4, 0.045);
    }

    // Gentle idle bob.
    mesh.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
  });

  return (
    <Icosahedron ref={ref} args={[1.5, 24]}>
      <MeshDistortMaterial
        // Near-white base: the cyan and violet lights supply the gradient,
        // which reads richer than a baked two-stop texture.
        color="#e6ecfa"
        distort={0.42}
        speed={1.35}
        // Low metalness on purpose — there's no environment map to reflect, and
        // a high-metal surface would just render near-black between highlights.
        roughness={0.28}
        metalness={0.22}
        clearcoat={0.6}
        clearcoatRoughness={0.3}
      />
    </Icosahedron>
  );
}

export function NebulaObject({
  interactive = true,
  particleCount = 550,
}: {
  interactive?: boolean;
  particleCount?: number;
}) {
  return (
    <>
      <ambientLight intensity={0.32} />
      {/* Opposed key lights are what paint the cyan → violet gradient. */}
      <pointLight position={[-4.5, 2.5, 3]} intensity={95} color={CYAN} distance={22} />
      <pointLight position={[4.5, -2, 2.5]} intensity={90} color={VIOLET} distance={22} />
      <pointLight position={[0, 3.5, -4]} intensity={40} color="#ffffff" distance={20} />

      <Core interactive={interactive} />
      <Shell />
      {particleCount > 0 && <Particles count={particleCount} />}
    </>
  );
}
