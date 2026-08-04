"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view for nav highlighting.
 *
 * Rather than taking the first intersecting entry (which flickers when two
 * sections straddle the viewport), this keeps a live map of visibility ratios
 * and picks the most-visible section on each callback.
 */
export function useActiveSection(ids: string[], offsetPx = 96): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = "";
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio > 0) setActive(bestId);
      },
      {
        // Discount the area hidden behind the fixed navbar.
        rootMargin: `-${offsetPx}px 0px -35% 0px`,
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);

    nodes.forEach((n) => observer.observe(n));

    // Pin the last section once the page is scrolled to the very bottom —
    // a short final section may never win on ratio alone.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
      if (atBottom && ids.length) setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids, offsetPx]);

  return active;
}
