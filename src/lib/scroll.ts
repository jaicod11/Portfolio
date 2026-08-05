import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/**
 * The live Lenis instance, or null before SmoothScroll mounts / under reduced
 * motion. The intro overlay uses this to pause smooth scrolling while it plays;
 * without it the page keeps scrolling underneath the curtain.
 */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Scrolls to a section by id. Uses Lenis when it's running so the motion
 * matches the rest of the page, and falls back to native behaviour when it
 * isn't (reduced motion, or before hydration).
 */
export function scrollToSection(id: string, offset = -72) {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.15 });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
