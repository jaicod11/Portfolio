# Nebula Bento

Personal portfolio for **Jaideep Kundu** — a floating 3D hero over a glassmorphic
bento-grid layout, on a dark neon theme.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion · Lenis ·
React Three Fiber.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment variables are required to run it — every integration has a
fallback (see below).

```bash
npm run build && npm start   # production build
npx tsc --noEmit             # typecheck
npx eslint .                 # lint
```

---

## Environment variables

Copy `.env.example` → `.env.local`. All are optional.

| Variable | Effect when set | Fallback when unset |
|---|---|---|
| `GITHUB_TOKEN` | `/api/github` uses the GraphQL API for exact contribution totals | Parses the public contributions page — works, but counts only public activity |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`<br>`NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`<br>`NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Contact form sends through EmailJS | Form opens the visitor's mail client with the message pre-filled |

`GITHUB_TOKEN` needs only the `read:user` scope and is read **server-side only** —
it never reaches the browser.

---

## Editing content

Everything writable lives in `src/data/` — no component edits needed:

| File | Contains |
|---|---|
| `src/data/site.ts` | Name, role, blurb, email, social links, nav items |
| `src/data/projects.ts` | Featured 4 + the filterable "other projects" list |
| `src/data/skills.ts` | Skill groups, icons and brand colours |

**Resume:** replace `public/resume.pdf`.

**Project screenshots:** drop an image at `public/projects/<name>.png` and set
`image: "/projects/<name>.png"` on that project. Without one, the card renders a
generated poster from the project's `accent` gradient — deliberate, not a
placeholder, so the grid never shows an empty image well.

**Photo:** the About card uses a "JK" monogram. To use a photo instead, swap that
block in `src/components/sections/About.tsx` for a `next/image`.

---

## How the live stats work

Both cards fetch from internal API routes, cached for an hour (`revalidate = 3600`):

- **`/api/github`** — GraphQL when `GITHUB_TOKEN` is set, otherwise it parses the
  public contribution grid (joining each day cell to its tooltip to recover real
  counts, not just intensity levels). The grid is plain HTML and unmetered, while
  the repo/follower counts come from `api.github.com`, which allows only 60
  unauthenticated requests/hour — so those are fetched best-effort. When that
  quota is spent the heatmap still renders and the affected tiles show a dash
  rather than a misleading `0`. Setting `GITHUB_TOKEN` raises the limit to 5,000/hr
  and avoids this entirely.
- **`/api/leetcode`** — LeetCode's own GraphQL endpoint, falling back to the
  community `alfa-leetcode-api` wrapper.

Both are unofficial sources, so each route returns `{ ok: false, error }` with a
**200** rather than throwing. The cards render a skeleton while loading and a
"view profile directly" link on failure — a broken upstream degrades one card,
never the page.

---

## Accessibility & performance notes

- Three.js is dynamically imported (`ssr: false`) and **only mounts on ≥768px
  viewports** — mobile gets a CSS-only orb, so no WebGL context or rAF loop on
  battery-powered devices.
- `prefers-reduced-motion` is honoured throughout: Lenis doesn't mount, the
  canvas is replaced by the static orb, count-ups snap to their final value, and
  idle float animations stop.
- Cursor tilt is gated behind `(hover: hover) and (pointer: fine)`; touch devices
  get tap-scale feedback instead. Touch targets are ≥44px.
- The LeetCode donut palette (`#22D3EE / #A855F7 / #FB7185`) was validated for
  colour-vision-deficiency separation against the `#0A0A0F` surface (worst
  adjacent pair ΔE 21.5 deutan, 25.2 normal), and every segment carries a direct
  label so identity never rests on colour alone.

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new) — the Next.js
   preset is detected automatically.
3. Add any environment variables under **Settings → Environment Variables**.
4. Push to `main` to redeploy.

Update `site.url` in `src/data/site.ts` to the production domain so Open Graph
metadata resolves correctly.
