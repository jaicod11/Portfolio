"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Mail, MapPin, Send, TriangleAlert } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButtonAction } from "@/components/ui/NeonButton";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { site, socials } from "@/data/site";
import { cn } from "@/lib/utils";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

/** EmailJS only engages once all three vars are present. */
const emailjsConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-xl border border-hairline bg-white/[0.03] px-4 py-3 text-sm text-fg " +
  "placeholder:text-faint transition-all duration-300 outline-none " +
  "focus:border-accent/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.14)]";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    // Without EmailJS credentials, hand off to the user's mail client rather
    // than failing — the message still reaches the same inbox.
    if (!emailjsConfigured) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      return;
    }

    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        SERVICE_ID!,
        TEMPLATE_ID!,
        {
          from_name: form.name,
          from_email: form.email,
          reply_to: form.email,
          message: form.message,
          to_name: site.name,
        },
        { publicKey: PUBLIC_KEY! },
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("[contact] EmailJS send failed:", err);
      setError("Couldn't send that. Email me directly and I'll get back to you.");
      setStatus("error");
    }
  }

  return (
    <Section id="contact">
      <SectionHeader
        index="06"
        label="Contact"
        title="Let's build something"
        description="Open to SDE roles and interesting backend problems. The fastest way to reach me is email — I reply to everything."
      />

      <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
        {/* ── Form ─────────────────────────────────────────── */}
        <RevealItem className="h-full">
          <GlassCard className="h-full p-6 sm:p-8" tilt={0} glow="cyan">
            <form onSubmit={onSubmit} className="flex h-full flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="eyebrow mb-2 block">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Ada Lovelace"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="eyebrow mb-2 block">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@company.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="message" className="eyebrow mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="What are you working on?"
                  className={cn(fieldClass, "resize-y min-h-[132px]")}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <NeonButtonAction
                  type="submit"
                  disabled={status === "sending"}
                  icon={
                    status === "sending" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )
                  }
                  className={status === "sending" ? "opacity-70" : undefined}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </NeonButtonAction>

                <AnimatePresence mode="wait">
                  {status === "sent" && (
                    <motion.p
                      key="sent"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-sm text-accent"
                      role="status"
                    >
                      <Check className="h-4 w-4" />
                      {emailjsConfigured ? "Message sent — thanks!" : "Opening your mail app…"}
                    </motion.p>
                  )}

                  {status === "error" && error && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-sm text-[#FB7185]"
                      role="alert"
                    >
                      <TriangleAlert className="h-4 w-4" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </GlassCard>
        </RevealItem>

        {/* ── Direct links ─────────────────────────────────── */}
        <RevealItem className="h-full">
          <GlassCard
            className="h-full p-6 sm:p-8"
            contentClassName="flex flex-col"
            tilt={0}
            glow="violet"
          >
            <h3 className="font-display text-lg font-semibold">Elsewhere</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Or skip the form entirely.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-3">
              {socials.map(({ label, href, icon: Icon, hoverClass }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-hairline bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-[0_0_26px_-8px_rgba(34,211,238,0.7)]"
                  >
                    <Icon
                      className={`h-5 w-5 text-muted transition-colors ${hoverClass}`}
                    />
                    <span className="text-xs text-muted transition-colors group-hover:text-fg">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div aria-hidden className="rule-glow my-7" />

            <dl className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-fg/90 transition-colors hover:text-accent"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
                    Based in
                  </dt>
                  <dd className="text-fg/90">{site.location}</dd>
                </div>
              </div>
            </dl>

            <p className="mt-auto pt-7 font-mono text-[11px] leading-relaxed text-faint">
              Usually replies within a day.
            </p>
          </GlassCard>
        </RevealItem>
      </Reveal>
    </Section>
  );
}
