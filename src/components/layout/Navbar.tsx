"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navItems, site } from "@/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const ids = useMemo(() => navItems.map((n) => n.id), []);
  const active = useActiveSection(ids);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the mobile panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // Let the panel begin closing before the scroll starts.
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <>
      {/* Scrim so page content doesn't peek above the floating nav pill. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 h-28 transition-opacity duration-500",
          "bg-gradient-to-b from-void via-void/85 to-transparent",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 sm:px-5",
            "transition-all duration-500 ease-out",
            scrolled
              ? "glass shadow-[0_10px_40px_-16px_rgba(0,0,0,0.9)]"
              : "border border-transparent bg-transparent",
          )}
        >
          {/* Wordmark */}
          <button
            onClick={() => go("hero")}
            className="flex items-center gap-2.5 rounded-full"
            aria-label="Back to top"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-void">
              JK
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
              {site.name}
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((n) => {
              const isActive = active === n.id;
              return (
                <li key={n.id}>
                  <button
                    onClick={() => go(n.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                      isActive ? "text-white" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-full border border-accent/30 bg-white/[0.07]"
                      />
                    )}
                    {n.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {/* Resume: open in a new tab, with a separate download affordance. */}
            <a
              href={site.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 sm:inline-flex",
                "text-sm font-medium text-accent transition-all duration-300",
                "hover:bg-accent/20 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.6)]",
              )}
            >
              Resume
            </a>
            <a
              href={site.resumePath}
              download="Jaideep-Kundu-Resume.pdf"
              aria-label="Download resume as PDF"
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full text-muted",
                "glass transition-all duration-300 hover:text-accent hover:border-accent/40",
              )}
            >
              <Download className="h-4 w-4" />
            </a>

            {/* Mobile trigger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="glass grid h-10 w-10 place-items-center rounded-full text-fg md:hidden"
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="glass fixed right-0 top-0 z-50 flex h-dvh w-[78%] max-w-xs flex-col gap-1 rounded-l-3xl px-5 pt-24 md:hidden"
            >
              {navItems.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={cn(
                    "flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-left transition-colors",
                    active === n.id
                      ? "bg-white/[0.07] text-white"
                      : "text-muted active:bg-white/5",
                  )}
                >
                  <span className="font-mono text-xs text-accent/70">{n.index}</span>
                  <span className="font-display text-lg">{n.label}</span>
                </button>
              ))}

              <a
                href={site.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-accent/35 bg-accent/10 font-medium text-accent"
              >
                View Resume
              </a>

              <p className="mt-auto pb-8 pt-6 font-mono text-[11px] text-faint">
                {site.email}
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
