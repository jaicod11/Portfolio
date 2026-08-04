"use client";

import { ArrowUp } from "lucide-react";
import { site, socials } from "@/data/site";
import { scrollToSection } from "@/lib/scroll";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mx-auto w-full max-w-6xl px-5 pb-10 sm:px-6">
      <div aria-hidden className="rule-glow" />

      <div className="flex flex-col items-center justify-between gap-6 pt-8 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-medium">{site.name}</p>
          <p className="mt-1 font-mono text-[11px] text-faint">
            © {year} · Built with Next.js, Three.js &amp; Tailwind
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-1">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-lg text-faint transition-colors hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollToSection("hero")}
            aria-label="Back to top"
            className="glass grid h-10 w-10 place-items-center rounded-full text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
