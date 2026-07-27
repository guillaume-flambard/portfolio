# Design direction — editorial condensed

**Adopted 2026-07-27.** Supersedes the 3D "Archipelago" concept (see `docs/archive/`).

Reference: [planting.space](https://planting.space/org/). What we borrowed: one condensed grotesque
for everything, massive vertical whitespace, flat surfaces, and a line-art backdrop layer.
What we did not borrow: their green palette, `text-justify`, Bootstrap.

## Rules

1. **One typeface.** Oswald (`next/font/google`, self-hosted) for headings *and* body. Both
   `--font-display` and `--font-body` point at it. No second family — resist adding one.
2. **Headings are uppercase via CSS**, never in the content. `src/i18n/messages/{fr,en}.json` stay in
   sentence case so the copy is reusable and translatable.
3. **Flat.** No `border-radius`, no `box-shadow`. Structure comes from 1px hairlines in `--line`.
4. **Whitespace is the layout.** Sections use `--sec-y` (`clamp(120px, 18vw, 240px)`). If a section
   feels empty, that is the design — do not fill it.
5. **Two column widths.** `.wrap` = 1180px for the work grid; `.wrap.narrow` = `--narrow` (920px) for
   prose (about, contact).
6. **Motion is slow and small.** `0.2s`–`0.3s ease-in-out` on colour/border; no lift-on-hover, no
   scale. The backdrop drifts over ~60s.
7. **The backdrop is a bonus, never a dependency.** `src/components/Backdrop.tsx` is inline SVG,
   `aria-hidden`, `z-index: -1`, hidden below 922px, and fully inert under
   `prefers-reduced-motion`. No Lottie, no animation library, no client JS.

## Tokens

`src/styles/tokens.css` is the single source of truth. Warm palette, unchanged from the previous
design: `--bg #faf9f7`, `--ink #16130f`, `--muted #6b6055`, `--line #e7e2da`, `--accent #c8672e`,
`--accent-soft #e58a4a`, `--surface #ffffff`. Rhythm: `--sec-y`, `--narrow`.

## Where things live

- `src/app/globals.css` — all component styles, ordered: base → backdrop → nav → hero → sections →
  about → contact → reduced-motion.
- `src/app/[locale]/page.tsx` — the whole homepage; class names match the CSS sections above.
- `src/app/[locale]/layout.tsx` — font wiring (`oswald.variable` on `<html>`) and `<Backdrop />`.

## Checks before shipping a visual change

- `npm run build` and `npm test` pass.
- Both `/fr` and `/en` render; no string moved into CSS `content` except decorative arrows.
- 390px: no horizontal overflow, nav fits one line, backdrop hidden.
- No external font or asset requests at runtime.
