import * as THREE from "three";

/**
 * Particle field that coalesces into a word set in the site's real display face.
 *
 * The text is never a mesh or a texture: it's rasterised into an offscreen 2D
 * canvas with the actual Space Grotesk face, then every pixel above the alpha
 * threshold becomes one particle target. That's what makes the letterforms the
 * genuine typeface rather than an approximation.
 */

export type FieldController = {
  /** Kicks off the coalesce. `durationMs` covers the full assembly. */
  startAssembly: (durationMs: number) => void;
  dispose: () => void;
  particleCount: number;
};

/** Camera sits this far back; world units are kept ≈ CSS pixels (see below). */
const CAMERA_Z = 400;

/** Fraction of the viewport width the assembled word should span. */
const FIT_DESKTOP = 0.72;
const FIT_MOBILE = 0.84;

/** Guard-rail so a huge viewport can't push the buffer into the millions. */
const MAX_PARTICLES = 34_000;

const ALPHA_THRESHOLD = 128;
const BASE_STRIDE = 2;

/**
 * Minimum gap, in world units (≈ CSS px), to leave between adjacent samples.
 *
 * Stride 2 is the intended sampling density and is what a desktop viewport
 * actually gets. But stride is measured in *canvas* pixels, and the raster is
 * scaled down hard to fit a narrow screen — at 390px the same grid lands ~0.6px
 * apart, so the dots overlap into a solid slab and stop reading as particles.
 * Widening the stride only when the fit would collapse them keeps the field
 * looking the same at every width.
 */
const MIN_SAMPLE_SPACING = 1.8;

/**
 * Resolves the font stack behind a CSS custom property. `ctx.font` will not
 * accept `var(--x)`, so the computed value has to be read off <html> first —
 * next/font emits a generated family name there.
 */
function resolveFontFamily(varName: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
}

/**
 * Waits for webfonts, but never blocks the intro on them: if the face is slow
 * we'd rather sample late than hang. Sampling before fonts settle would rasterise
 * the fallback face and the name would visibly reflow once the real one lands.
 */
async function waitForFonts(timeoutMs = 1500): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  await Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

type Sample = {
  /** xyz triples, centred on the bbox and already scaled into world units. */
  points: Float32Array;
  count: number;
};

/**
 * Rasterises `text` in the real display face and turns every sufficiently
 * opaque pixel into a particle target, scaled so the word spans
 * `targetWorldWidth`.
 */
function sampleText(
  text: string,
  fontFamily: string,
  targetWorldWidth: number,
): Sample | null {
  const fontSize = 180;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const font = `700 ${fontSize}px ${fontFamily}`;

  // Measure first: the canvas only needs to be as large as the word, and the
  // width also determines the fit ratio, which in turn sets the stride.
  ctx.font = font;
  const measured = ctx.measureText(text).width;
  if (!measured) return null;

  const pad = fontSize * 0.4;
  const w = Math.ceil(measured + pad * 2);
  const h = Math.ceil(fontSize * 1.6);

  // How far one canvas pixel travels on screen once the word is fitted.
  const fit = targetWorldWidth / measured;
  let stride = Math.max(BASE_STRIDE, Math.round(MIN_SAMPLE_SPACING / fit));

  canvas.width = w;
  canvas.height = h;

  // Resizing the canvas resets the 2D state, so the font must be set again.
  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);

  const data = ctx.getImageData(0, 0, w, h).data;

  let covered = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > ALPHA_THRESHOLD) covered++;
  }
  if (covered === 0) return null;

  // Keep the buffer bounded no matter how large the raster came out.
  while (covered / (stride * stride) > MAX_PARTICLES) stride++;

  const xs: number[] = [];
  const ys: number[] = [];
  for (let y = 0; y < h; y += stride) {
    for (let x = 0; x < w; x += stride) {
      if (data[(y * w + x) * 4 + 3] > ALPHA_THRESHOLD) {
        xs.push(x);
        ys.push(y);
      }
    }
  }

  const count = xs.length;
  if (count === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    if (xs[i] < minX) minX = xs[i];
    if (xs[i] > maxX) maxX = xs[i];
    if (ys[i] < minY) minY = ys[i];
    if (ys[i] > maxY) maxY = ys[i];
  }

  // Re-derive the scale from the true glyph bbox rather than the advance width,
  // so side bearings can't make the word narrower than asked for.
  const bboxWidth = maxX - minX || measured;
  const scale = targetWorldWidth / bboxWidth;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    points[i * 3] = (xs[i] - cx) * scale;
    points[i * 3 + 1] = -(ys[i] - cy) * scale; // canvas Y grows down; world Y grows up
    points[i * 3 + 2] = 0;
  }

  return { points, count };
}

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 aStart;
  attribute float aSeed;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vSeed;

  void main() {
    vSeed = aSeed;

    // Stagger the starts so the word assembles progressively instead of every
    // particle snapping home on the same frame.
    float delay = aSeed * 0.15;
    float p = clamp((uProgress - delay) / (1.0 - 0.15), 0.0, 1.0);
    float eased = smoothstep(0.0, 1.0, p);

    vec3 pos = mix(aStart, position, eased);

    // Drifting dust that settles as each particle arrives.
    float amp = mix(20.0, 2.0, eased);
    float phase = aSeed * 6.2831853;
    pos.x += sin(uTime * 1.7 + phase) * amp;
    pos.y += cos(uTime * 1.4 + phase) * amp;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // uPixelRatio keeps the dot the same apparent size on HiDPI screens —
    // gl_PointSize is in physical pixels, not CSS pixels.
    gl_PointSize = (2.6 + aSeed * 2.8) * (300.0 / -mvPosition.z) * uPixelRatio;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying float vSeed;

  void main() {
    // Round the square point sprite off, with a soft edge.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d);

    vec3 white = vec3(1.0);
    vec3 violet = vec3(0.659, 0.333, 0.969); // #a855f7
    vec3 color = mix(white, violet, vSeed);

    gl_FragColor = vec4(color, alpha);
  }
`;

export async function createParticleField(
  canvas: HTMLCanvasElement,
  text: string,
): Promise<FieldController | null> {
  // Sampling the fallback face then swapping would reflow the whole word.
  await waitForFonts();

  const fontFamily = resolveFontFamily("--font-space-grotesk", "sans-serif");

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();

  /**
   * The FOV is derived so the frustum height at z=0 equals the viewport height
   * — i.e. one world unit is one CSS pixel. That keeps the particle spread and
   * point-size constants meaningful at any screen size.
   */
  const fovFor = (height: number) =>
    (2 * Math.atan(height / 2 / CAMERA_Z) * 180) / Math.PI;

  const camera = new THREE.PerspectiveCamera(
    fovFor(window.innerHeight),
    window.innerWidth / window.innerHeight,
    1,
    4000,
  );
  camera.position.z = CAMERA_Z;

  /** Actual frustum width at z=0 — never assume, the FOV changes with height. */
  const frustumWidthAtOrigin = () => {
    const h = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * CAMERA_Z;
    return h * camera.aspect;
  };

  const targetWidthFor = (frustumWidth: number) =>
    frustumWidth * (window.innerWidth < 768 ? FIT_MOBILE : FIT_DESKTOP);

  // Sampling needs the real frustum width, so the camera has to exist first —
  // canvas pixels and world units are unrelated scales, and the fit ratio also
  // decides how coarsely the raster can be sampled.
  const sample = sampleText(text, fontFamily, targetWidthFor(frustumWidthAtOrigin()));
  if (!sample) {
    renderer.dispose();
    renderer.forceContextLoss();
    return null;
  }

  const count = sample.count;
  const targets = new Float32Array(count * 3);
  const starts = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    targets[i * 3] = sample.points[i * 3];
    targets[i * 3 + 1] = sample.points[i * 3 + 1];
    targets[i * 3 + 2] = 0;

    starts[i * 3] = (Math.random() * 2 - 1) * 450;
    starts[i * 3 + 1] = (Math.random() * 2 - 1) * 280;
    starts[i * 3 + 2] = (Math.random() * 2 - 1) * 200;

    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  /* ── Interaction & lifecycle ──────────────────────────────────── */

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e: MouseEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("mousemove", onPointerMove, { passive: true });

  const baseWidth = window.innerWidth;
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = fovFor(window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    // Positions are baked, so re-fit by scaling the whole field.
    points.scale.setScalar(window.innerWidth / baseWidth);
  };
  window.addEventListener("resize", onResize);

  let assemblyStart = 0;
  let assemblyDuration = 0;
  let raf = 0;
  let disposed = false;
  const clock = new THREE.Clock();

  // power3.inOut
  const easePower3InOut = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = () => {
    if (disposed) return;
    raf = requestAnimationFrame(tick);

    material.uniforms.uTime.value = clock.getElapsedTime();

    if (assemblyDuration > 0) {
      const raw = Math.min((performance.now() - assemblyStart) / assemblyDuration, 1);
      material.uniforms.uProgress.value = easePower3InOut(raw);
    }

    // Parallax: ease the camera toward the pointer rather than tracking it hard.
    camera.position.x += (pointer.x * 40 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 30 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    particleCount: count,

    startAssembly(durationMs: number) {
      assemblyStart = performance.now();
      assemblyDuration = durationMs;
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", onResize);

      scene.remove(points);
      geometry.dispose();
      material.dispose();
      // Drops the WebGL context so nothing keeps rendering behind the hero.
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
