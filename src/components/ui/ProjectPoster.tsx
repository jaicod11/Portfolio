"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cover art for a project card.
 *
 * When a screenshot exists it's rendered through next/image (lazy, sized).
 * Otherwise we draw a deterministic poster from the project's accent pair —
 * an empty image well would read as broken, whereas this reads as designed.
 * Drop a file at /public/projects/<slug>.png and set `image` to swap it in.
 */
export function ProjectPoster({
  title,
  image,
  accent,
  className,
}: {
  title: string;
  image?: string;
  accent: [string, string];
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={`${title} screenshot`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={cn(
          "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]",
          className,
        )}
      />
    );
  }

  const [from, to] = accent;

  // Initials from the title. Splits on separators *and* camelCase humps so
  // one-word names still yield two letters: "CollabDocs" -> "CD".
  const words = title
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const initials =
    words.length >= 2
      ? words.slice(0, 2).map((w) => w[0].toUpperCase()).join("")
      : (words[0] ?? title).slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]",
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at 18% 12%, ${from}55, transparent 62%),
                       radial-gradient(110% 95% at 85% 88%, ${to}55, transparent 60%),
                       linear-gradient(140deg, #0d0d16, #07070c)`,
        }}
      />

      {/* Blueprint grid — nods to the systems work without being literal. */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(80% 70% at 50% 50%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(80% 70% at 50% 50%, #000, transparent)",
        }}
      />

      <div className="absolute inset-0 grid place-items-center">
        <span
          className="font-display text-6xl font-bold tracking-tighter sm:text-7xl"
          style={{
            background: `linear-gradient(135deg, ${from}, ${to})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: 0.9,
          }}
        >
          {initials}
        </span>
      </div>

      <div
        className="absolute inset-0"
        style={{ boxShadow: `inset 0 -80px 90px -60px ${to}44` }}
      />
    </div>
  );
}
