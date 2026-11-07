# Buyer-led evidence selection, 7 November 2026

## Intent and discovery

Owner feedback after PR #52: the contact repair is delivered, but the selection of work still does not make the buyer's fit obvious. Specifically surface Flylooping, compare actual peers, and fix the confusing project/Lab catalog. Freelance sales remain the primary site purpose; recruitment is secondary. No commercial acceptance inferred from checked boxes in #53: the latest owner feedback explicitly asks for further work.

Risk T3: coordinated public portfolio + Lab deployment. Reuse existing project data, i18n, static rendering and pipelines; no new platform, dependency, backend, prospect messages or private exposure. Sole writer: parent agent. Independent read-only benchmark and catalog review completed; implementation review required.

## Research and model

Primary sources consulted 2026-11-07: Edmond Daoust https://eddaoust.com/services/developpeur-web-freelance/ ; Olivier Larose https://www.olivierlarose.com/ ; AC Développement https://alexandrechauvin.fr/realisations/mon-bureau-detudes-creation-dun-erp?id=22 ; Moncif Aissaoui https://www.lemoncef.fr/ ; LogicFox https://logicfox.ai/case-studies/scene3d-ai-automation-and-crm ; Code & Wander https://www.codeandwander.com/ventures and /pricing ; Brittany Chiang https://brittanychiang.com/ . Larger consultancy counterpoints: thoughtbot and Evil Martians. Observed structures are evidence of presentation, never proof of their conversion rates or an instruction to adopt their prices.

Pattern inferred for this scope: buyer need → named professional work → exact personal role/context → accessible artifact or bounded account → contact. A recruiting reader needs responsibilities and technical detail, available from the same cases and CV. Internal experiments are secondary evidence, not automatically client references.

Current Lab: 33 public entries, sorted into live/lab/beta, untranslated GitHub descriptions despite localized notes. HTTP 200 does not establish product health (Weave shows offline); FoldReady text describes an old offer; two GitHub identities are obsolete. Preserve the wider public code catalog as a secondary exploration; do not imply deployment or adoption from old status fields.

Career provenance read directly: owner's CV copy (2026-08-18), Experience and ventures, Project attribution map (2026-08-21), current experience.ts. **Owner correction 2026-11-07 13:08–13:10 Europe/Paris supersedes the old Flylooping description:** mostly frontend, covering approximately all of it, in HTML/CSS/JavaScript; backend was a smaller part. Present the substantial frontend contribution at Symbyoz in 2024–2025, without claiming sole ownership of the whole booking product. Old API/security emphasis must disappear from the case, project data, services and the shared About/CV experience. Medsharing: frontend role 2021–2023, 100+ screen migration. Public employer/product pages provide context only, not independent attribution. No private screenshots or employer source published.

## Requirements and acceptance

| ID | Outcome / acceptance | Verification |
|---|---|---|
| E1 | Home connects buyer needs to four professional references: Medsharing, Flylooping via Symbyoz, Echo Travel, Blue Owl. Demos are separately labelled and secondary. | FR/EN browser and content review |
| E2 | Flylooping and Medsharing each have a structured bilingual case (need, contribution, work delivered, scope/period). Flylooping foregrounds the owner's confirmed HTML/CSS/JS frontend contribution consistently in case/services/About/CV. No fabricated image, metric, testimonial or whole-product ownership. | Unit, content review, live link |
| E3 | Work page puts professional references first and independent/internal work second, with both groups still navigable; existing URLs and contact anchors work. | Unit, E2E, link inspection |
| E4 | Lab opens with a small need-based selection with localized descriptions, source/package links and honest context. Full public exploration remains secondary; no technical live status is sold as maturity. | Data contract, bilingual browser |
| E5 | Obsolete/dead/misleading selected links and descriptions are corrected; private/internal projects stay private. Keep public source evidence and distinguish demo/internal/client roles. | Primary URL/repo checks and independent review |
| E6 | Builds, relevant tests, responsive/keyboard/contrast checks, exact revision CI and deployed smoke pass for both apps. | Recorded commands, image SHA, live tests |

## Finite graph

| Task | Priority | Dependencies | Status | Evidence |
|---|---|---|---|---|
| S1 benchmark peers and inspect actual career/catalog | P1 | none | DONE | Primary sources above; two independent read-only reports |
| S2 specify selection and compatibility | P1 | S1 | DONE | E1–E6 and selection below |
| S3 implement professional cases and buyer-oriented portfolio | P1 | S2 | DONE | Owner correction applied consistently in four sources; 71 unit and all 83 browser cases PASS, build/typecheck PASS |
| S4 implement curated bilingual Lab and secondary exploration | P1 | S2 | DONE | 3 contract tests, Vite build, 27 bilingual responsive page checks and 4 failure/no-JS states |
| S5 verify independently, publish and reconcile | P1 | S3,S4 | VERIFYING | Independent diff/content review PASS; local checks below; exact-head CI and live rollout pending |
| S6 owner accepts selection and attribution | P2 | S5 | TODO | #53, updated after technical delivery |

## Selection rationale

| Buyer need | Primary work | Secondary proof |
|---|---|---|
| Modernize business interfaces | Medsharing | UI examples when relevant |
| Develop the frontend of an existing product or support an agency | Flylooping via Symbyoz | BananAI in the career record |
| Booking, payments and operations | Echo Travel | n8n payment node, PayKit prototype |
| Put an AI engine behind a usable web product | Blue Owl | Explicitly simulated public automation demo |

Lab selection favors a few directly understandable public technical artifacts, not recency or repository count. Experimental/archive entries remain code exploration, not client experience.

## Risk, coverage and verification plan

High risks: attribution inflation, confidential material, lost outreach URLs, misleading maturity/availability, coordinated deploy regressions. Mitigate with exact role/employer/period labels, no private artifacts, preserved routes, curated source links, builds/E2E/independent review, exact image revision and normal-pipeline rollback. No open high risk may remain at technical closure.

Applicable: UX, i18n, accessibility, data integrity of public catalog, link contracts, privacy/security of published data, JS-loading/error/empty state for Lab, static metadata, builds, deployment/rollback, diagnostics and docs. No new auth, secrets, database/migration, persistence, billing, scheduling, offline service or concurrent state changes. External sites/packages remain external; no click counts or adoption claims added. Existing design tokens and Oswald direction remain authoritative. Loading/error states must still expose the portfolio/contact path.

Before publication: portfolio build/typecheck/unit/data tests plus affected browser flows; Lab build and curated-data checks, render in FR/EN at 390/1000/1440, JS error and keyboard checks, inspect screenshot and independently review diff. After normal GitHub → GHCR → VPS pipeline, confirm exact revisions and repeat focused live paths. Roll back each app through its own normal pipeline if needed. Technical state ends at READY_FOR_MANUAL_ACCEPTANCE; owner acceptance stays separate in #53.

## Local evidence, 2026-11-07

- Portfolio `npm run build`: PASS, 49 static routes including FR/EN Medsharing and Flylooping, TypeScript included. Existing Next middleware deprecation warning unchanged.
- `npm test`: 70/70; `npm run test:snapshot`: 4/4; `npm run test:evidence`: 6/6. Evidence target test includes both newly linked product-context sites.
- Full Playwright run: 79 passed, four failures in the old work-gallery expectations (8 image cards/old about identity). Updated that affected specification for four professional cases + six complementary items, retained detail navigation and about contact; focused `playwright test e2e/work.spec.ts`: 5/5. Together all 83 test cases pass on the final implementation.
- Public Lab `npm test`: 3/3; `npm run build`: PASS. No dependency added.
- Browser smoke: 27 page/width combinations, FR/EN, 390/1000/1440, no overflow or page error. Three curated cards, 27 secondary explorations, native keyboard expansion; network failure, malformed catalog, empty catalog and no-JavaScript fallback all PASS.
- Measured contrast sweep: no contrast/overflow failure. Corrected actual Lab inline-link touch target. Native closed-details descendants produce phantom 4px widths in the generic measurement helper; excluded by actual visibility inspection, with visible menu links measured separately. Final sweep evidence retained in task workspace.
- Independent reviewer read final source/text diff in both repositories: PASS, no blocking attribution, privacy or navigation defect. Product contribution stays bounded to documented role and period; no employer/private image or code added.
- Humanizer on parsed new copy: no flagged phrases/punctuation. `git diff --check`: PASS in both repositories.

Public-reader delta after the first deployment: remove technical proof-state labels from the four primary cards and the redundant header label on the new employment cases; replace “evidence limits” with context/scope and “outcome” with work delivered. Roles, periods, caveats and sources remain available. This is required presentation cleanup under E3, not a new attribution or business-outcome claim. Independent delta review PASS; build/typecheck and 70 unit tests PASS. Browser regression: 82 passed, one stale legend expectation replaced by asserting four visible roles and absence of audit jargon; its focused rerun passed. All 83 cases covered on this implementation.

Owner correction pass, 2026-11-07 13:10–13:12 Europe/Paris: recent owner facts override the old CV line. Red test confirmed the old backend/API emphasis; updated project, case, service reference and shared career data to frontend HTML/CSS/JavaScript across most of the frontend. No particular booking screen or additional framework invented. `npm test` 71/71, production build/typecheck PASS, final full `playwright test` 83/83 including the frontend snapshot assertion. Independent read-only delta review PASS, `git diff --check` and parsed-copy humanizer PASS. Public deployment of this correction still pending at this entry.

Release evidence and owner acceptance are tracked below after exact revisions are deployed. No technical or commercial acceptance is inferred from an HTTP response or a checked box in #53.
