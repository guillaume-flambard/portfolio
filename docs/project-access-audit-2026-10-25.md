# Project access and evidence audit — 2026-10-25

## Scope and methodology

This is an **accessibility/content audit**, not a certification of production adoption. HTTP 200 means the public page responds; it does **not** establish that the complete app works, that payments succeed, or that customers are active. Verified claims should be tied to the actual observed surface.

The catalog source contains 76 items: 7 featured case-study pages and 69 map/reference entries. Only the seven featured projects are rendered as detailed portfolio work on /work; dormant map and reference records remain inventory, **not** verified case studies. Avoid presenting forks/clones as authored products.

Checks were conducted against public URLs from the Mac using HTTPS requests with redirects (25 Oct 2026). Content inspection was used to distinguish a landing page from an application. The public GitHub repositories listed below were reachable. npm.com returned HTTP 403 to scripted access; the package was separately found listed in the npm search index. No login-based or payment transaction was performed.

## Featured projects

| Project | Nature | Public access/evidence | Observed result | Safe public claim |
| --- | --- | --- | --- | --- |
| Émargo | Independent business SaaS | Public website | https://emargo.fr → HTTP 200 | Website accessible; real user volume/private journeys not audited |
| Echo Travel | Technical client project | Operator-reported use | https://echotravel.app → HTTP 200 | Booking site accessible; operator reports seasonal use (approx. 150 passengers/day, not independently audited) |
| PayKit | Independent developer toolkit | Early-access landing | https://paykit-landing.vercel.app → HTTP 200, early-access CTA; GitHub repo HTTP 200 | Project source available, product in early access; no claim about active paying clients |
| Blue Owl | Collaborative education/AI project | Public informational site | https://blueowl.org → HTTP 200, site includes sign-in CTA | Education site accessible; private AI generator end-to-end unverified |
| Weave | Experimental open-source prototype | Source code only | https://weave.memolabs.dev → HTTP 200 but UI explicitly says “hors ligne”; GitHub repo HTTP 200 | Public Rust/MCP code only; do not promote a functioning web demo |
| n8n-nodes-opn | Open-source integration | npm package and repository | GitHub repo HTTP 200; npm.com scripted check HTTP 403; package found listed on npm | Published npm package, code public; access to the npm detail page may vary under bot protection |
| Largo IA | Client marketing site | Public website | https://largo-ai.vercel.app → HTTP 200, redirects to /fr | Live public marketing website; no claims about commercial traction or private features |

## Additional checked URLs

- L’Étrille public site: https://etrillecherbourg.vercel.app → HTTP 200 (not a featured detailed case-study page).
- Memo Labs Lab public destination: https://memolabs.dev/lab → redirects to https://lab.memolabs.dev/fr/ (HTTP 200).
- `https://github.com/guillaume-flambard/lab-hub` returned HTTP 404; this archived/private repository URL was removed from the public catalog mapping.
- PayKit, Weave and Largo public GitHub links returned HTTP 200.
- `https://www.npmjs.com/package/n8n-nodes-opn` returned HTTP 403 from automated curl. This is **not** evidence that the page is broken for a human browser; preserve the link with honest package labels.

## Data model and presentation rules

1. `ProjectStatus` describes **link availability** only: public website / source or package / no public link. It does not mean “deployed production product.”
2. Every featured project has an explicit `verification.kind`, `verification.proof`, `verification.checkedAt` and FR/EN `verification.note`. These fields reflect the limits of the evidence.
3. Home and Work project cards show project nature and proof type without green live-status dots. Individual project pages expose the verification note.
4. Do not create “production” or customer-count badges from HTTP responses. Commercial outcomes need owner confirmation and supporting business evidence.
5. Nonfeatured map/reference items are an archival inventory, not a recommended list of deployed products. Review links before surfacing them in public UI.
6. Re-check external URLs after major releases and whenever a reviewer reports a broken path.

## Unverified by this pass

- Logins, member-only flows, payment authorizations, AI content generation, uptime, customer counts, accessibility, actual browser performance, and all 69 historical map/reference URLs.
- This audit should not be used as evidence that every catalog item or every production workflow was exercised.
