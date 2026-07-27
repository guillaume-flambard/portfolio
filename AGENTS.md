# AGENTS.md — portfolio

Personal portfolio of Guillaume Flambard. Bilingual (FR default, EN), statically generated.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · next-intl · Vitest.

## Layout

```
src/app/[locale]/page.tsx    the whole homepage (nav, hero, work, about, contact, footer)
src/app/[locale]/layout.tsx  font wiring + <Backdrop />
src/app/globals.css          all component styles
src/components/Backdrop.tsx  decorative SVG layer (desktop only, aria-hidden)
src/styles/tokens.css        design tokens — the single source of truth
src/i18n/                    routing, request config, messages/{fr,en}.json
docs/design-direction.md     the visual rules — READ BEFORE ANY UI CHANGE
docs/archive/                superseded specs; do not implement from them
```

## Rules

- **Read `docs/design-direction.md` before touching anything visual.** One typeface, no radius, no
  shadow, whitespace-driven. It also lists the pre-ship checks.
- Copy lives in `src/i18n/messages/*.json`, in sentence case. Uppercase is a CSS decision. Any new
  string must be added to **both** `fr.json` and `en.json`.
- Colours and spacing come from `src/styles/tokens.css` — never hardcode a hex in a component.
- No new runtime dependency for a visual effect. Inline SVG + CSS first.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build (must pass before shipping)
npm test        # vitest
```
