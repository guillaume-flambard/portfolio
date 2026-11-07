# Parcours commercial, 7 novembre 2026

## Intent and discovery

Owner request: investigate the VPS traffic and contact failures, remove duplicated contact instructions, make the offer coherent with demos sent to companies. Owner explicitly chose freelance sales to agencies and companies first, recruitment second.

Baseline: `a272deb`, PR #51 merged. No open portfolio issues or PRs at discovery. Production serves that revision. The previous contact fix is delivered; this change simplifies its resulting experience. Repository clean at start, no competing portfolio workspace found. Risk T3 because main deploys to production. Main agent is sole writer; independent read-only review required.

## Model and scope

Prospect email or demo → home → relevant example/service → one contact block → external email composer → owner mailbox. Next.js 16 server components, next-intl FR/EN, static email links, no form backend or persisted lead data. Existing case studies, services, CV and open-source pages remain available. Existing demo URLs and contact anchors are contracts.

The traffic audit is private and stored outside the public repository. Rotated access logs cover 2026-11-05 15:05 UTC to 2026-11-07 11:05 UTC, not a complete week. Telegram's notification history starts on 3 November and contains historical classifier false positives. HTTP 200 is not successful email delivery. Network names do not identify a prospect. No outbound prospect messages are authorized.

## Requirements and acceptance

| ID | Requirement / acceptance | Verification |
|---|---|---|
| R1 | FR/EN home names the freelance buyer and concrete work; two main actions: contact and examples. Recruitment is secondary. | DOM, manual inspection |
| R2 | Home connects to three specific accessible examples, with demo/past engagement status, and explains scope → implementation → handover without invented prices, guarantees or response times. | Links, content review, browser |
| R3 | Contact has one visible address and one immediately accessible set of email/Gmail/Outlook options. No disclosure must be opened to write. Recruitment keeps a distinct subject and both legacy anchors resolve. | E2E FR/EN, keyboard, JS disabled |
| R4 | Contact/about/metadata describe the same web, integration, automation offer. No unverified count of public demos. | Diff, translation and link inspection |
| R5 | At 390/1000/1440 px: no horizontal overflow, legible contact contrast, keyboard focus and no new runtime third-party asset dependency. Existing relevant recruiter/CV/case-study behavior passes. | Build, unit and browser suites, rendered inspection |
| R6 | Only reviewed/tested code is published. Verify deployed revision and the home → contact path; preserve rollback. | CI, image revision, live browser |

## Coverage and interfaces

Applicable: normal/empty static content, UX, accessibility, compatibility, email integrations, browser networking, static metadata/caching, diagnostics, tests/build, deployment/rollback, documentation. Loading is normal document navigation; no new asynchronous UI. Errors/retries/cancellation of an external email composer belong to that service; always expose selectable address and alternative providers. No success/delivery claim is shown. No new persistence, data schema/migration, authentication, authorization, concurrency/idempotency or offline service is introduced. Privacy: do not add tracking or export raw visitor IPs. Security: encode email subjects, retain noopener on external composers, no backend/secrets changes. Performance: remove home GitHub feed and its retrieval; no new dependency. Existing pages and anchors remain compatible.

## Finite work graph

| Task | Priority | Dependency | Status | Evidence |
|---|---|---|---|---|
| T1 audit current deployment, tracker and traffic | P1 | none | DONE | Baseline/traffic scope above; private audit evidence |
| T2 specify buyer journey and obtain priority | P1 | T1 | DONE | Owner answer in current chat; R1–R6 |
| T3 simplify contact and align FR/EN copy | P1 | T2 | DONE | Contact server markup, bilingual copy, 74 browser checks |
| T4 focus home on offer, examples and engagement | P1 | T2 | DONE | Home examples/process and secondary code page, independent review |
| T5 update relevant checks and verify independently | P1 | T3,T4 | DONE | Verification results below |
| T6 publish, verify runtime, reconcile tracker | P1 | T5 | DONE | PR #52 merged, CI/image build green, VPS revision and six live browser scenarios verified |
| T7 owner manual acceptance | P2 | T6 | TODO | https://github.com/guillaume-flambard/portfolio/issues/53, Guillaume checks offer and real mailbox flow |

## Risks and mitigation

| Risk | Level | Mitigation / residual |
|---|---|---|
| Break existing outreach URLs | high | Preserve #freelance/#recruitment and demo routes, verify links |
| Regress contact contrast or keyboard access | high | Desktop/mobile rendered checks and native links, no JS dependency |
| Confuse demos with delivered client results | high | Explicit demo/past engagement labels, independent content review |
| Lose deployment health | high | Build/tests/review before publication; verify image SHA and live route; revert commit via normal pipeline if needed |
| Infer lost leads from noisy telemetry | medium | State observation limits; no conversion or identity claim |
| New copy does not resonate commercially | medium | Manual owner acceptance; future buyer feedback, no conversion promise |

## Verification plan and evidence

Baseline `npm test`: 13 files, 70 tests pass. Before publish: production build, TypeScript, unit/snapshot/evidence checks, affected E2E in both languages, 390/1000/1440 rendered checks plus no-JS contact, independent diff review. After publish: exact image revision, HTTP routes, live home/contact inspection. Record actual outcomes here.

## Manual acceptance

Owner: read the first screen as an agency/client, follow one example, then Contact; confirm the offer matches the outreach being sent. Open the preferred email provider, send a real message and confirm receipt in the mailbox. That last send is not simulated or claimed by the agent. Commercial conversion remains unproven until qualified conversations occur.

## Deployment, rollback and closure

GitHub main → existing image build → GHCR → VPS autodeploy. No manual server mutation needed. If verification fails after deployment, revert the delivery commit and let the same pipeline restore baseline behavior. Final AI-controlled state: READY_FOR_MANUAL_ACCEPTANCE only after R1–R6 pass. Do not mark DONE before the owner's acceptance.

### Local verification completed

- `npm run build`: PASS, 45 generated pages. Existing Next middleware-deprecation notice remains unrelated.
- `npx tsc --noEmit`: PASS.
- `npm test`: PASS, 13 files / 70 tests.
- `npm run test:snapshot`: PASS, 4 tests. `npm run test:evidence`: PASS, 6 tests.
- `npx playwright test e2e/client-journey.spec.ts e2e/recruiter-journey.spec.ts e2e/navigation.spec.ts --workers=3`: PASS, 74 scenarios, after final touch-target CSS change. Includes JS-disabled contact with touch emulation, FR/EN, CV print, compatibility and keyboard paths.
- Render sweep, FR/EN home/contact, 375/768/1000/1440 px, light theme: no horizontal overflow, contrast failure or page error. Real visible touch targets meet 44px. Raw helper reports 6 repeated false positives for links inside closed native details; `checkVisibility()` confirms all are hidden. Opening the menu at 375px yields six visible links, each 335 x 46.59px. No dark theme requested or claimed.
- Screenshots inspected at desktop and mobile. Browser CUA inspection confirms the intended copy and the single immediate contact group.
- Independent read-only reviewer: PASS on R1–R4, links, encoded subjects, evidence wording, FR/EN coherence and relocation of GitHub content. `git diff --check`: PASS.
- No physical mobile device or Safari receipt test claimed. External email delivery and commercial acceptance remain manual.

The initial new contact test failed against the previous cached build (zero visible address/options), then passed against the new production build. The first regression run passed 68/74; six tests still expected GitHub activity on the homepage. The activity and corresponding tests were moved to the secondary open-source page, preserving access rather than removing those checks. Final run passes 74/74.

### Production evidence and closure

- Delivery PR: https://github.com/guillaume-flambard/portfolio/pull/52, MERGED at 2026-11-07T11:18:17Z. Delivery revision: `0c7f062a639b67820e6f90da0b91ac93717f8acd`.
- Exact-head CI: https://github.com/guillaume-flambard/portfolio/actions/runs/42367607692 SUCCESS. Image build/push: https://github.com/guillaume-flambard/portfolio/actions/runs/42367607699 SUCCESS. Security and Vercel preview passed; CodeRabbit skipped, independent agent review completed instead.
- VPS container image revision confirmed as the delivery revision, running since 2026-11-07T11:21:52Z. Native autodeploy journal at 11:21:55Z: portfolio deployed and healthy. No manual server mutation or hold bypass.
- CUA live observation: English home → primary contact CTA → single visible email/provider group; both recruitment and freelance intents intact.
- `PW_BASE_URL=https://memolabs.dev npx playwright test e2e/client-journey.spec.ts --workers=2`: 6/6 PASS against production, including both locales, touch/no-JS contact and responsive rendering.
- Owner-only acceptance remains OPEN: https://github.com/guillaume-flambard/portfolio/issues/53. Owner: Guillaume. Next action: read the offer, follow an example and verify actual email receipt. No lost-lead count, delivery success or business conversion claimed.
- Tracker reconciliation: PR #52 merged, no open technical PR or issue for this scope. #53 is explicitly manual acceptance. Work branch is published and merged; no worktree created. Remote branches preserved per owner storage policy.
- Final controlled state: READY_FOR_MANUAL_ACCEPTANCE. R1–R6 pass. No open critical/high implementation risk or unverified technical acceptance criterion remains. Residual uncertainty is commercial response and manual email receipt, recorded separately.
