# Portfolio — "The Archipelago" — Design Spec

**Date:** 2026-07-13
**Owner:** Guillaume Flambard
**Status:** Approved (design); content (project selection) to be finalized during build.

## 1. Purpose

A distinctive personal portfolio whose primary job is to land a **Design Engineer CDI** in Europe
(Qonto, n8n and similar), while also serving freelance prospects, professional identity, and a "wow"
technical statement. Bilingual FR ⇄ EN. Must feel original — not a templated dark-tech / brutalist /
generic-3D site.

Success criteria:
- A hiring manager understands "fullstack + AI Design Engineer who ships craft" within ~10 seconds.
- At least 3 live, clickable project demos reachable in one click.
- The site itself is proof of craft (the 3D navigation and polish are the demo).
- Fast and accessible enough that a rushed recruiter never gets stuck.

## 2. Concept — The Archipelago

The organizing metaphor is drawn from Guillaume's real life (Koh Phangan, Echo Travel boat operations,
digital-nomad arc): **the portfolio is a nautical chart of an archipelago**. Each island is a section;
the visitor sails freely between them in 3D. Originality comes from the concept + visual register, not
a style skin.

**Visual register:** nautical / bathymetric chart — vellum-paper base, ink depth-contour lines,
survey coordinates, a single beacon-red accent. On hover/sail, a **bioluminescent phosphor wake**
(the real plankton of Koh Phangan) trails the pointer. Deliberately not a cartoon beach.

**Style system (from UI/UX Pro Max db):** Portfolio/Personal → **Motion-Driven + Minimalism**,
landing pattern **Storytelling-Driven** (fits the voyage). Secondary lens: editorial.

**Palette** (warm ink + amber on cream, db-validated, reconciled with the chart register):
- Cream paper `#FFFBEB`, warm ink `#0F172A`, stone primary `#78716C`, contour grey `#9c8f6e`
- Amber accent `#D97706`, beacon red `#c8452f`
- Phosphor wake `#39ffcf` (motion only, cool pop against warm)
- Dark/night register variant decided during build (near-black sea).

**Typography** — "Minimalist Monochrome Editorial" (100% serif/mono, no UI sans):
- Display: **Playfair Display** (900, tight tracking, for heroes)
- Body: **Source Serif 4** (300–600)
- Mono: **JetBrains Mono** (uppercase, wide tracking — coordinates, tags, dates, island labels)

## 3. Navigation model

**Freely explorable 3D sea map** (chosen deliberately for maximum "wow"). Free camera: pan / zoom /
sail between islands.

Because free 3D navigation risks losing rushed visitors, hurting SEO, and perf, the design bakes in
three mandatory mitigations:

1. **Recruiter escape hatch** — a persistent "Quick tour / Skip to list" control renders a plain,
   classic list view of every island + its content in one click. The rushed see everything in
   seconds; the curious explore.
2. **SEO** — every island's real content is server-rendered HTML underneath the canvas. The 3D layer
   is an enhancement over real SSR pages; crawlers get full content. Each island is its own route.
3. **Perf** — the WebGL canvas is lazy-loaded; a static fallback (chart image + text links) renders
   when WebGL is absent or on weak/mobile devices. Strict asset budget.

**Deep-linking:** each island has its own URL (`/isle/craft`, `/isle/echo`, `/isle/ai`, …), keyboard
-navigable and shareable.

## 4. Islands (sitemap)

Five islands. Curation over volume.

| Island | Route | Role | Content |
|--------|-------|------|---------|
| **Home Port** ⚓ | `/` | Hero + who I am | Name, one-line positioning, entry to the map |
| **Craft Isle** ◈ | `/isle/craft` | Design-Engineer proof | 3–4 live, clickable project demos |
| **Echo Atoll** ⛵ | `/isle/echo` | Ventures | Echo Travel + Thailand ventures story |
| **AI Lab** ◈ | `/isle/ai` | AI/LLM work | minerva (RAG) + AI builds |
| **Lighthouse** 🅻 | `/isle/contact` | Work with me | CDI + freelance CTA, contact |

### Default project content (to refine during build)

Selection is deferred by the owner; these are the working defaults from the project inventory
(2026-07-13). 🟢 = deployed, 🔴 = needs a deploy before it reads as "live".

- **Craft Isle:** largo-ai 🟢 (flagship, DESIGN.md + GSAP), blueowl 🟢 (shipped product),
  portsense 🔴 (deepest UI craft), zentegra 🔴 (clean marketing + data-viz).
- **AI Lab:** minerva 🟢 (minerva-web; the site's own "Retrieval Augmented Consciousness" identity),
  talktwin 🔴 (AI persona chat), wikipedia-semantic-search 🔴 (pure RAG credential).

Phased content option: ship first with the 3 live projects (largo-ai, blueowl, minerva), deploy the
others and add them as islands over time.

## 5. Tech stack

- **Framework:** Next.js (App Router), React, TypeScript.
- **3D:** React Three Fiber + Three.js + drei. Sea = shader plane (displacement waves); islands =
  low-poly meshes with `drei/Html` chart-style labels; phosphor wake = pointer trail.
- **Motion / camera:** GSAP (or Framer Motion) for camera transitions between islands.
- **i18n:** next-intl, FR ⇄ EN toggle in the chart header, localized routes (`/fr`, `/en`), default
  from browser locale.
- **Styling:** Tailwind CSS for the SSR/HTML content layer.
- **Design intelligence:** UI/UX Pro Max skill installed at `.claude/skills/` (project scope) — its
  CSV db drives style/color/font/chart picks. Three.js production rules to honor from `stacks/threejs`:
  handle touch + mouse for all interaction; cursor→pointer on raycast hit; GLTFLoader `traverse` for
  shadows/materials on every mesh child.

## 5b. Claude Design — tooling status (NOT yet set up for this project)

The portfolio does **not** exist as a Claude Design project yet. To be decided (see Open items):
whether/how to use Claude Design at all for this build.

Pre-existing, separate assets the owner already has in Claude Design (candidates only — none wired
to this project): design-system projects "Weave", "Island Warm", "Echo Travel", "Blue Owl",
"Largo IA". "Island Warm" is a 21-component travel/boating-themed library (BoardingPass, SailingOption,
RouteSelect, tokens, bundle) that *could* seed the content layer if we choose to.

Tooling done 2026-07-13: `claude-design` HTTP MCP added at user scope
(`https://api.anthropic.com/v1/design/mcp`), auth verified. Nothing else configured.

## 6. Accessibility

- `prefers-reduced-motion` → freeze the map, serve list navigation.
- Full keyboard navigation across all islands (Tab + Enter to reach/enter each island).
- The list-view escape hatch doubles as the accessible baseline.

## 7. Out of scope (YAGNI)

- No CMS / blog engine at launch (content is code-defined).
- No backend/auth for v1 — static + SSR content only.
- No analytics dashboard, no newsletter, no dark-mode toggle beyond the reduced-motion/WebGL
  fallbacks (dark register decided during build if desired).

## 8. Open items for build phase

- Final project selection + deploying the 🔴 projects.
- Dark/night register palette decision.
- Exact copy (FR + EN) per island.
