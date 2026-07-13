# The Archipelago — Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a distinctive bilingual (FR/EN) personal portfolio where projects are islands on a freely-explorable 3D nautical chart, engineered so a rushed recruiter never gets stuck.

**Architecture:** Next.js App Router renders every island as real SSR HTML (SEO + the recruiter list-view baseline). A lazy-loaded React Three Fiber canvas mounts on top as a progressive enhancement — the 3D sea/islands/camera. A WebGL-absent or reduced-motion visitor gets the SSR content + list nav with no canvas. Content components come from the "Island Warm" design system where they fit; the 3D engine is bespoke.

**Tech Stack:** Next.js (App Router), TypeScript, React Three Fiber + three + @react-three/drei, GSAP (camera tweens), next-intl (i18n), Tailwind CSS, Playfair Display / Source Serif 4 / JetBrains Mono.

## Global Constraints

- Bilingual FR ⇄ EN, localized routes `/fr` and `/en`, default from browser locale (next-intl).
- Every island has its own deep-linkable route (`/[locale]/isle/[slug]`), keyboard reachable.
- All island content is server-rendered HTML; the 3D canvas is an enhancement layer only.
- Persistent "Skip to list / Quick tour" control on every screen → full list view in one click.
- `prefers-reduced-motion` and no-WebGL → freeze/skip canvas, serve list navigation.
- Three.js rules: handle touch + mouse for all interaction; `cursor:pointer` on raycast hit, reset on miss; if using GLTF, `traverse` the scene to set materials/shadows on every mesh child.
- Palette: cream `#FFFBEB`, ink `#0F172A`, stone `#78716C`, contour `#9c8f6e`, amber `#D97706`, beacon `#c8452f`, phosphor `#39ffcf` (motion only).
- Type: Playfair Display (display), Source Serif 4 (body), JetBrains Mono (labels/coords). No UI sans-serif.
- Five islands only: Home Port, Craft Isle, Echo Atoll, AI Lab, Lighthouse.
- DRY, YAGNI, TDD where it fits, frequent commits.

---

## File Structure

```
src/
  app/
    [locale]/
      layout.tsx              # locale layout, fonts, next-intl provider
      page.tsx                # Home Port (hero) + mounts <ArchipelagoScene>
      isle/[slug]/page.tsx    # island detail (SSR)
      list/page.tsx           # recruiter list view (SSR, no canvas)
    layout.tsx                # root html
  content/
    islands.ts                # island data model + typed registry (source of truth)
    islands.test.ts
  i18n/
    routing.ts                # next-intl routing config
    request.ts                # next-intl request config
    messages/{fr,en}.json
  components/
    LocaleSwitcher.tsx
    SkipToList.tsx            # persistent recruiter escape hatch
    IslandCard.tsx           # content-layer card (Island Warm styled)
    IslandDetail.tsx
  three/
    ArchipelagoScene.tsx     # <Canvas> wrapper, lazy-loaded, WebGL guard
    Sea.tsx                  # shader water plane
    Island.tsx               # island mesh + drei Html label
    useCameraSail.ts         # GSAP camera tween to an island
    useHover.ts              # raycast hover → cursor + wake trigger
    Wake.tsx                 # phosphor pointer trail
    webgl.ts                 # detectWebGL()
    reducedMotion.ts         # prefersReducedMotion()
  styles/
    tokens.css               # palette + font CSS vars
```

---

## Phase 0 — Scaffold

### Task 1: Bootstrap Next.js + Tailwind + fonts

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/styles/tokens.css`, `src/app/layout.tsx`
- Test: `src/content/islands.test.ts` (added Task 2; Vitest wired here)

- [ ] **Step 1: Scaffold app**

```bash
cd ~/projects/portfolio
npx create-next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*" --no-eslint --use-npm
npm i three @react-three/fiber @react-three/drei gsap next-intl
npm i -D vitest @testing-library/react jsdom
```

- [ ] **Step 2: Add design tokens** — write `src/styles/tokens.css`:

```css
:root{
  --paper:#FFFBEB; --ink:#0F172A; --stone:#78716C; --contour:#9c8f6e;
  --amber:#D97706; --beacon:#c8452f; --phosphor:#39ffcf;
}
```

- [ ] **Step 3: Load fonts** in `src/app/layout.tsx` via `next/font/google` (Playfair_Display, Source_Serif_4, JetBrains_Mono) exposing CSS vars `--font-display/-body/-mono`; map them in `tailwind.config.ts` `fontFamily`.

- [ ] **Step 4: Add Vitest config** (`vitest.config.ts`, jsdom env) + `"test": "vitest"` script.

- [ ] **Step 5: Verify** — `npm run build` succeeds, `npm run test` runs (0 tests).

- [ ] **Step 6: Commit** — `git add -A && git commit -m "chore: scaffold next.js + tailwind + fonts + vitest"`

---

## Phase 1 — Content layer (SSR, testable)

### Task 2: Island data model

**Files:**
- Create: `src/content/islands.ts`
- Test: `src/content/islands.test.ts`

**Interfaces:**
- Produces: `type Island = { slug: string; kind: 'port'|'craft'|'ventures'|'ai'|'contact'; pos: [number,number]; titles: Record<Locale,string>; blurb: Record<Locale,string>; projects?: Project[] }`; `type Project = { name: string; url?: string; repo?: string; stack: string[]; live: boolean }`; `const ISLANDS: Island[]`; `getIsland(slug): Island | undefined`; `type Locale='fr'|'en'`.

- [ ] **Step 1: Failing test**

```ts
import { ISLANDS, getIsland } from './islands'
test('has exactly the 5 canonical islands', () => {
  expect(ISLANDS.map(i => i.slug).sort()).toEqual(['ai','craft','echo','home','lighthouse'])
})
test('getIsland returns typed island with bilingual titles', () => {
  const c = getIsland('craft')!
  expect(c.titles.fr).toBeTruthy(); expect(c.titles.en).toBeTruthy()
  expect(c.pos).toHaveLength(2)
})
test('every project on craft isle has a stack and live flag', () => {
  for (const p of getIsland('craft')!.projects ?? []) {
    expect(Array.isArray(p.stack)).toBe(true); expect(typeof p.live).toBe('boolean')
  }
})
```

- [ ] **Step 2: Run → FAIL** (`npm run test islands` — module not found).

- [ ] **Step 3: Implement** `src/content/islands.ts` with the 5 islands, chart positions, FR/EN copy, and the default project set (largo-ai 🟢, blueowl 🟢, portsense 🔴, zentegra 🔴 on craft; minerva 🟢, talktwin 🔴, wikipedia-semantic-search 🔴 on ai). `live` mirrors deploy status; `url` only where live.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5: Commit** — `git commit -am "feat: island data model with bilingual content"`

### Task 3: i18n routing (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/messages/fr.json`, `src/i18n/messages/en.json`, `src/middleware.ts`
- Test: `src/i18n/routing.test.ts`

**Interfaces:**
- Produces: `routing` (locales `['fr','en']`, defaultLocale `'fr'`, localePrefix `'always'`); exported `Link, redirect, usePathname, getPathname` from next-intl navigation.

- [ ] **Step 1: Failing test** — assert `routing.locales` equals `['fr','en']` and `routing.defaultLocale==='fr'`.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** `routing.ts` (defineRouting), `request.ts` (load messages by locale), `middleware.ts` (createMiddleware(routing), matcher excluding `/_next` & assets), seed messages json with hero + nav keys.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** — `git commit -am "feat: next-intl FR/EN routing"`

### Task 4: Locale layout + Home Port hero (SSR)

**Files:**
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/components/LocaleSwitcher.tsx`, `src/components/SkipToList.tsx`

**Interfaces:**
- Consumes: `routing`, `getIsland('home')`, next-intl `getTranslations`.
- Produces: `<SkipToList/>` (fixed control, links to `/[locale]/list`), `<LocaleSwitcher/>`.

- [ ] **Step 1:** `[locale]/layout.tsx` — `setRequestLocale`, wrap children in `NextIntlClientProvider`, render `<SkipToList/>` + `<LocaleSwitcher/>` globally.
- [ ] **Step 2:** `page.tsx` — Home Port hero: Playfair display name "Guillaume Flambard", mono positioning line, chart-grid background (CSS), an "Enter the chart / Voir la liste" pair. No canvas yet.
- [ ] **Step 3: Verify** — `npm run dev`, load `/fr` and `/en`; switcher swaps copy; "Skip to list" visible. (Use the `run` skill / browser.)
- [ ] **Step 4: Commit** — `git commit -am "feat: locale layout + Home Port hero + skip-to-list"`

### Task 5: Island detail route + Craft/Echo/AI/Lighthouse content

**Files:**
- Create: `src/app/[locale]/isle/[slug]/page.tsx`, `src/components/IslandDetail.tsx`, `src/components/IslandCard.tsx`

- [ ] **Step 1:** `generateStaticParams` over `ISLANDS × locales`; `page.tsx` calls `getIsland(slug)` → 404 if missing.
- [ ] **Step 2:** `IslandDetail` renders title/blurb; when `projects`, render `IslandCard` grid (name, stack chips, "Live demo"→`url` when `live`, "Code"→`repo`). Style with Island Warm tokens (Card/Chip/Button equivalents).
- [ ] **Step 3:** `generateMetadata` per island/locale (title, description) for SEO.
- [ ] **Step 4: Verify** — visit `/en/isle/craft`, `/fr/isle/ai`; live links resolve, 🔴 projects show "Demo soon" instead of a dead link.
- [ ] **Step 5: Commit** — `git commit -am "feat: island detail pages + project cards"`

### Task 6: Recruiter list view

**Files:**
- Create: `src/app/[locale]/list/page.tsx`
- Test: `src/app/[locale]/list/list.test.tsx`

- [ ] **Step 1: Failing test** — render list page (RTL), assert all 5 island titles + every live project link render as anchors.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** a plain, fast, fully-SSR list: each island as a section with its blurb and project links. Zero canvas. This is the accessible + no-WebGL baseline.
- [ ] **Step 4: Run → PASS**, verify at `/en/list`.
- [ ] **Step 5: Commit** — `git commit -am "feat: recruiter list view (accessible baseline)"`

---

## Phase 2 — 3D engine (build + verify in browser)

### Task 7: WebGL + reduced-motion guards

**Files:**
- Create: `src/three/webgl.ts`, `src/three/reducedMotion.ts`
- Test: `src/three/webgl.test.ts`

**Interfaces:**
- Produces: `detectWebGL(): boolean`, `prefersReducedMotion(): boolean`.

- [ ] **Step 1: Failing test** — `detectWebGL` returns boolean; in jsdom (no WebGL) returns `false` without throwing.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** canvas `getContext('webgl2'||'webgl')` probe wrapped in try/catch; `matchMedia('(prefers-reduced-motion: reduce)').matches` guarded for SSR.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** — `git commit -am "feat: webgl + reduced-motion detection"`

### Task 8: Scene mount with guard + lazy load

**Files:**
- Create: `src/three/ArchipelagoScene.tsx`; Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `detectWebGL`, `prefersReducedMotion`, `ISLANDS`.
- Produces: `<ArchipelagoScene islands={ISLANDS} locale={locale} />` — renders `null` when guards fail (SSR content stays as the experience).

- [ ] **Step 1:** Client component; `next/dynamic` import of the `<Canvas>` subtree with `ssr:false`; if `!detectWebGL() || prefersReducedMotion()` render `null`.
- [ ] **Step 2:** Mount empty `<Canvas>` (drei `<OrbitControls/>` temporary) behind the hero content (`position:fixed; inset:0; z-index:0`; hero `z-index:1`, `pointer-events` tuned).
- [ ] **Step 3: Verify** — canvas appears on `/fr`; DevTools emulate reduced-motion → canvas gone, hero intact.
- [ ] **Step 4: Commit** — `git commit -am "feat: lazy guarded R3F canvas mount"`

### Task 9: Sea shader plane

**Files:** Create `src/three/Sea.tsx`

- [ ] **Step 1:** Large plane, custom `shaderMaterial` (drei) — vertex displacement (summed sines by `uTime`), fragment = warm-paper→contour gradient with faint depth-contour lines (`fract` bands). Feed `uTime` via `useFrame`.
- [ ] **Step 2: Verify** — gentle animated chart-sea renders; perf ≥50fps desktop.
- [ ] **Step 3: Commit** — `git commit -am "feat: nautical sea shader"`

### Task 10: Islands + labels at chart positions

**Files:** Create `src/three/Island.tsx`; Modify `ArchipelagoScene.tsx`

**Interfaces:**
- Consumes: `Island.pos`, `Island.slug`, `Island.titles`.
- Produces: one `<Island>` per registry entry; each exposes `userData.slug` for raycasting.

- [ ] **Step 1:** Low-poly island mesh (extruded contour rings look) placed at `[pos[0], 0, pos[1]]`; drei `<Html>` mono label (title + fake coordinates) that faces camera.
- [ ] **Step 2:** Map `ISLANDS` → `<Island>`s in the scene.
- [ ] **Step 3: Verify** — 5 labeled islands at distinct positions.
- [ ] **Step 4: Commit** — `git commit -am "feat: island meshes + chart labels"`

### Task 11: Hover (raycast) → cursor + wake

**Files:** Create `src/three/useHover.ts`, `src/three/Wake.tsx`

- [ ] **Step 1:** Pointer + touch listeners normalized to NDC; raycast island meshes each frame; on hit set `document.body.style.cursor='pointer'` and mark hovered slug, else reset to `'auto'` (honor the Three.js rule).
- [ ] **Step 2:** `Wake` — phosphor `#39ffcf` trail following the pointer on the sea (points/line with fading opacity).
- [ ] **Step 3: Verify** — hovering an island shows pointer + phosphor wake; works with touch emulation.
- [ ] **Step 4: Commit** — `git commit -am "feat: hover cursor feedback + phosphor wake"`

### Task 12: Sail-to-island camera + deep-link sync

**Files:** Create `src/three/useCameraSail.ts`; Modify `Island.tsx`, `ArchipelagoScene.tsx`

**Interfaces:**
- Consumes: next-intl `useRouter`, `Island.pos/slug`.
- Produces: `sailTo(island)` — GSAP tween of camera position/target, then `router.push('/[locale]/isle/'+slug)`.

- [ ] **Step 1:** Click/Enter on an island → `sailTo`: GSAP tweens camera over ~1.2s to frame the island, then navigates to its route.
- [ ] **Step 2:** Keyboard: islands focusable (drei `<Html>` anchor), Enter triggers `sailTo`.
- [ ] **Step 3: Verify** — clicking an island sails then opens its page; back returns to chart; direct `/en/isle/ai` still renders (SSR) without requiring the sail.
- [ ] **Step 4: Commit** — `git commit -am "feat: camera sail + deep-link navigation"`

---

## Phase 3 — Integration & hardening

### Task 13: Perf budget + asset lazy-load audit

**Files:** Modify `ArchipelagoScene.tsx`, `next.config.ts`

- [ ] **Step 1:** Confirm canvas subtree is `ssr:false` + dynamically imported; add a lightweight `<Suspense>` fallback (static chart image). Cap DPR (`dpr={[1,1.5]}`), `frameloop="demand"` where possible.
- [ ] **Step 2: Verify** — Lighthouse on `/en`: Performance ≥90 mobile, content visible with JS disabled (SSR), no layout shift from canvas.
- [ ] **Step 3: Commit** — `git commit -am "perf: canvas lazy-load + dpr/frameloop budget"`

### Task 14: Accessibility & no-WebGL pass

**Files:** Modify `ArchipelagoScene.tsx`, `SkipToList.tsx`

- [ ] **Step 1:** Verify reduced-motion + WebGL-off both fall back to SSR + list. `SkipToList` reachable by keyboard as first focusable element.
- [ ] **Step 2:** axe/Lighthouse a11y ≥95 on `/en` and `/en/list`; all islands keyboard-navigable.
- [ ] **Step 3: Commit** — `git commit -am "a11y: keyboard nav + graceful fallbacks verified"`

### Task 15: Deploy + live-project wiring

**Files:** Create `vercel.json` (if needed); Modify `src/content/islands.ts`

- [ ] **Step 1:** Deploy to Vercel; confirm `/fr` `/en` + all island routes render.
- [ ] **Step 2:** As 🔴 projects get deployed, flip `live:true` + add `url` in `islands.ts` (portsense, zentegra, talktwin, wikipedia-semantic-search). Ship first with the 3 live (largo-ai, blueowl, minerva).
- [ ] **Step 3: Commit** — `git commit -am "chore: deploy + wire live project links"`

---

## Self-Review

- **Spec coverage:** concept/archipelago (Tasks 8–12) ✓; nautical-chart register (Tasks 4,9,10) ✓; palette+type (Task 1) ✓; free 3D nav (Task 12) ✓; recruiter escape hatch (Tasks 4,6) ✓; SEO SSR (Tasks 4,5) ✓; perf (Task 13) ✓; FR/EN (Task 3) ✓; deep-links (Task 12) ✓; accessibility/reduced-motion (Tasks 7,14) ✓; 5 islands (Task 2) ✓; Island Warm content styling (Task 5) — via design-sync, see below; default project set (Task 2) ✓; Three.js rules (Tasks 11) ✓.
- **Deferred to build:** dark/night register (optional, §8); final project selection (Task 15).
- **Design-system sync:** after Task 5, optionally `/design-sync` the local content components against the "Island Warm" project to keep them aligned (DesignSync MCP), one component at a time.

## Notes on tooling during execution

- Use the **ui-ux-pro-max** skill DB (`.claude/skills/ui-ux-pro-max/scripts/search.py`) when picking any additional component style, chart, or motion pattern.
- Use the **run** skill / browser to verify each visual task in a real browser.
