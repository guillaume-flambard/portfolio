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

## Run — 2026-08-09 (passe COMPLÈTE superflow, Phase 4 — toutes les gates)

| gate | result |
|---|---|
| typecheck | ok (tsc --noEmit 0 err) |
| **unit+property** | **14 vitest / 3 fichiers** — routing + data integrity + fast-check (invariants urls/names/stacks) |
| **model E2E (Playwright)** | **10/10** — navigation (liens→routes, état actif `.on`, logo, Lab externe), galerie /work (8 cards, 7 img, pas de listing), about, home |
| a11y (axe) | 0 violation × 3 viewports × 6 routes (/fr /work /about /contact /legal /work/largo) |
| audit | 0 vulnerabilities |
| **AppSec headers** | AJOUTÉS — CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| **perf** | **images optimisées (next/image)** — largo 220→37KB (÷6), blueowl 646→65KB (÷10), srcset responsive |
| secrets | 0 trouvé · .env absent · .gitignore `.env*` ✓ |
| walk (12 routes) | 200 · 0 console error · 0 failed request |

### Fixes apportés (passe complète)
1. **AppSec** : headers de sécurité manquants (CSP/HSTS/etc.) → `next.config.ts` `headers()`.
2. **Perf (Core Web Vitals)** : `<img>` bruts (jusqu'à 650KB) → `next/image` via composant partagé `ProjectImage.tsx` (3 fichiers : home, /work, /work/[slug]).
3. **Config** : vitest exclude `e2e/` (le dossier Playwright cassait la suite) — `include: src/**/*.{test,spec}`.
4. **Tooling** : ajout `fast-check`, `@playwright/test`, `playwright.config.ts`, `e2e/navigation.spec.ts`, `e2e/work.spec.ts`.

### Debt / à suivre
- P3 : pas de script `lint` (npm run lint absent) — eslint non configuré.
- P3 : pas de modèle XState formel (site statique — les E2E Playwright couvrent la nav) ; model-based optionnel si le site gagne de la complexité.

verdict: **DONE** — gates: typecheck✓ unit/property 14✓ e2e 10✓ a11y 0✓ audit 0✓ appsec✓ perf✓ — commit c27c39f
