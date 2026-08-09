# Run log — portfolio (superflow T2 report, 2026-08-08)

| check | result |
|---|---|
| stack | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · next-intl · Vitest (node-next) |
| gates | typecheck:ok (`tsc --noEmit` 0 err) · tests:1/1 pass (vitest) · audit:4 high (sharp/libvips CVEs via Next, `npm audit fix --force` needs out-of-range next@16.3.0) |
| web | boot:ok (dev :3000) · routes:2 (/fr, /en → 200; walk.js /book 404 expected — route list from embark template) · console errors:0 · a11y:1 violation (color-contrast, serious) |
| verdict | green (debt: audit + contrast) |
| findings P1/P2/P3 | 1. **P2** `npm audit`: 4 high — inherited sharp/libvips CVEs (GHSA-f88m-g3jw-g9cj CVE-2026-33327/33328/35590/35591). Fix path requires next@16.3.0 outside declared range → coordinate upgrade. 2. **P2** a11y color-contrast (serious): 5 nodes — `.navlinks > a[href$="#work"]`, `a[href$="#about"]`, `.navlinks > a[href$="#contact"]`, `.p.btn[href$="#work"]`, `mailto:g.flambard@gmail.com` — nav/CTA text fails 4.5:1 on all viewports. 3. **P3** deprecated Next `middleware` file convention → rename to `proxy`. |

## Sweep fix — 2026-08-08

| check | result |
|---|---|
| audit | 0 high (was 4). `npm audit fix` (safe) cleared nanoid; remaining next/postcss/sharp fixed by **next 16.2.10 → 16.3.0** — same major 16.x (`isSemVerMajor:false`), exact-pin only, applied to package.json + npm install, not `--force`. |
| a11y | 0 (was 5 serious color-contrast). Root cause: `--accent: #c8672e` failed 3.67:1 on `--bg` and 3.86:1 with white CTA text. Darkened to `#ad4c16` in `src/styles/tokens.css` → 5.22:1 on bg, 5.49:1 white-on. Re-ran axe (3 viewports): 0 violations. |
| gates | typecheck:ok · tests:1/1 (vitest) · build:ok (23/23 static pages) |
| committed | yes (push to origin/main) |

## Run — 2026-08-09 (correctif nav + galerie, bet portfolio-nav-gallery)

| gate | result |
|---|---|
| typecheck | ok (tsc --noEmit 0 err) |
| tests | 1/1 vitest pass |
| build | ok (routes /fr /en /about /contact /work /work/[slug]) |
| nav (prod) | Home présent · état actif `.on` sur la bonne page · chaque lien → bonne route |
| /work | galerie 8 FEATURED, 7 images, 0 listing MAP |
| /about | plus de produits nommés en redite |

verdict: **DONE** — commit d6dbd9c push + deploy Coolify finished · vérifié navigateur (3 routes)
notes: SPEC.md + tasks.md ajoutés au contrat .superflow

## Run — 2026-08-09 (passe complète, profil node-next)

| gate | result |
|---|---|
| typecheck | ok (tsc --noEmit 0 err) |
| lint | N/A (aucun script `lint` dans package.json — à ajouter ?) |
| tests | 1/1 vitest pass |
| audit | 0 vulnerabilities (complet + omit=dev) |
| a11y | 0 violation × 3 viewports (home + /work, axe-core) |
| walk (12 routes) | toutes 200 · 0 console error · 0 request failed · titles cohérents |
| /lab redirect | /fr/lab → 307 lab.memolabs.dev ✓ |

### Finding corrigé
- **P2** `/work` titre « Bibliothèque — Tous les projets, catégorisés » (périmé depuis le passage en galerie FEATURED) → **« Produits — Les produits Memo Labs en production »** (fr+en).

### Debt / à suivre
- P3 : pas de script `lint` dans le portfolio (npm run lint n'existe pas) — ajouter eslint si on veut la gate.
- P3 : run-log T2 2026-08-08 notait audit 4 high + contrast 5 nodes — **résolus** (audit 0, a11y 0).

verdict: **DONE** — gates 4 green (typecheck/tests/audit/a11y/walk) + 1 finding P2 corrigé · commit suivant
