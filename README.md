# portfolio

Personal portfolio of Guillaume Flambard — full-stack & AI engineer. Bilingual FR/EN, statically
generated with Next.js.

## Run

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /fr
```

```bash
npm run build    # production build
npm test         # vitest
```

## Design

Editorial direction: a single condensed grotesque (Oswald), flat surfaces, generous whitespace, and a
decorative line-art backdrop on desktop. The rules — and what must be checked before shipping a
visual change — are in [`docs/design-direction.md`](docs/design-direction.md).

Design tokens live in [`src/styles/tokens.css`](src/styles/tokens.css); component styles in
[`src/app/globals.css`](src/app/globals.css).

## Content & i18n

Copy is in [`src/i18n/messages/fr.json`](src/i18n/messages/fr.json) and
[`en.json`](src/i18n/messages/en.json), in sentence case (uppercase is applied by CSS). Routes are
prefixed: `/fr`, `/en`. Projects shown on the homepage are the `PROJECTS` array in
[`src/app/[locale]/page.tsx`](src/app/%5Blocale%5D/page.tsx).

Notes for AI assistants: [`AGENTS.md`](AGENTS.md).

## Living GitHub activity

The homepage is a portfolio with two evidence layers:

- **Editorial case studies** stay curated in `src/data/projectNavigation.ts`. They show
  business context and verified outcomes and are not silently reordered by GitHub.
- **GitHub activity** in `src/lib/githubActivity.ts` refreshes at most once per hour.
  It shows recently updated public repositories and merged pull requests in external projects.
  A code update does **not** imply a working demo, green CI, or production usage.

**New public repositories are discovered automatically without a topic or manual
portfolio changes.** The homepage shows a separate *Recently published*
section for eligible public repositories created in the last 90 days, with an
explicit *public code / not audited* label. Private, archived, forked, empty,
internal/infrastructure-named repositories are excluded. `memo-hide` and
`memo-internal` topics opt out of automatic discovery. The recent-discovery
section displays up to four entries, ordered by GitHub creation date. GitHub
does not guarantee a push is a production release.

The editorial *In progress* area still shows up to four reviewed repositories
(sorted by latest push). For established repositories, add the optional topic
`memo-showcase` to opt in, or update `EDITORIAL_REPOS`. These editorial picks
are **not** automatically promoted from new public repositories.

Open-source PRs are automatically searched across GitHub, **without** listing
upstream repositories or contribution URLs in this codebase. The homepage shows
the five most recently merged external PRs plus two open proposals. The
bilingual `/fr/open-source` and `/en/open-source` routes show the full retrieved
feed (up to 100 merged and 100 open PRs via each GitHub Search result). Each PR
is kept, including multiple real contributions to the same upstream project.
Merge status comes from `pull_request.merged_at`, not merely `closed_at`.
PRs still under review are clearly marked **open**, not merged.

Public GitHub data is cached for up to one hour and refreshed on a site visit
after that interval. GitHub availability, API rate limits, the API search result
window (100 per status), and indexing latency mean this is *eventually consistent*,
not a guaranteed instantaneous or exhaustive stream. Optional server-only
`GITHUB_READ_TOKEN` helps with rate limits. To get stronger delivery guarantees,
add a monitored scheduled sync with retry and a persisted last-known-good feed,
instead of relying exclusively on public live API responses.

This feature reads **public GitHub API data only**. An optional server-side
`GITHUB_READ_TOKEN` can increase API rate limits; never expose it using a
`NEXT_PUBLIC_` variable. When GitHub is unavailable or rate-limited, the homepage
remains usable and shows a neutral fallback rather than fabricated activity.

Run `npm test`, `npm run build`, then `npm run test:e2e` before publishing. Verify
that both locale pages render and that the public GitHub links remain accurate.

## Evidence-based project development journals

Every qualifying curated or newly discovered public repository on the
homepage can link to `/{fr|en}/build/{owner}/{repo}`. The route checks current
eligible public repositories; private, archived and forked code stays excluded.

The journal is a **selective, verifiable history**, not a productivity score:
- GitHub repository creation date is labeled *repository created*, **not** first prototype.
- Recent authored PRs display as **merged into the codebase**, **not** deployed features.
- Releases display as **published on GitHub**, **not** production deployments.
- An existing verified public site may be linked at its **check date**, without
  implying it is a working demo (currently inherited from the curated project evidence).
- CI-only, bot-authored, drafts, invalid or cross-repository events are excluded.
- An API outage produces a plainly marked partial history, not invented milestones.

GitHub requests are server-only, limited and cached for an hour. Changes are
picked up automatically after revalidation; pages do not expose arbitrary
GitHub repos. Prototype/demo/production milestones require additional
editorial proof with a date and verifiable public URL; never derive them
from commit or PR counts.

Validation: `npm test`, `npm run build`, and the Playwright recruiter E2E.

## Durable autonomous GitHub synchronization (30-minute schedule)

`.github/workflows/github-activity.yml` uses `GITHUB_TOKEN` to collect public
repositories and external PRs every 30 minutes, **without a visitor**.
It commits `data/github-snapshot.json` on an isolated `github-activity`
branch, keeping periodic data churn away from `main`, CI and GHCR deploys.

The site first reads that persisted snapshot through GitHub's static raw-file
endpoint (Next cache 15 minutes). Until the first scheduled run, it falls back
to live public GitHub requests. Each section has `syncedAt` and `healthy`
metadata; transient API errors preserve previously published data, raise a
dedicated scheduled-workflow failure, and expose a degraded/stale note. A
missing snapshot AND failed live API read throws so an existing ISR page
remains available rather than publishing a fabricated empty feed.

Schedule timing is best-effort (GitHub may delay or drop scheduled workflows),
not an SLA. Users may see changes after the scheduler, raw CDN and Next ISR
caches have propagated. Monitor the **Public GitHub activity snapshot**
workflow; do not count Vercel deploy success as the VPS production check.
`npm run test:snapshot` exercises fallback and corruption cases.

## Optional source-linked product milestones (per repository)

An ongoing public project can publish a small versioned manifest **in its own
repository** at `.portfolio/milestones.json`. The portfolio discovers it
automatically when rendering the project's `/build/{owner}/{repo}` page.
**No manual portfolio code change or deployment is needed for new milestones.**

Example **schema only** (replace all sample data with real, dated evidence):

```json
{
  "version": 1,
  "milestones": [
    {
      "kind": "prototype",
      "date": "2026-09-01",
      "title": {
        "fr": "Premier prototype documenté",
        "en": "First documented prototype"
      },
      "detail": {
        "fr": "Ce qui a réellement été démontré.",
        "en": "What was actually demonstrated."
      },
      "evidenceUrl": "https://github.com/OWNER/REPOSITORY/commit/FULL_40_CHAR_SHA"
    }
  ]
}
```

Allowed `kind` values: `prototype`, `demo`, `deployment`. Dates must
be real ISO calendar days no later than the current date and no earlier than
GitHub repo creation. Titles need both FR and EN; descriptions are optional.
Evidence must link to a **specific commit, merged or open pull request, release
tag or Actions run in the exact same repository**. A demo can alternatively
link to a YouTube or Vimeo video. Arbitrary hosts, cross-repo references,
duplicates and invalid dates are ignored; only six milestones are presented.

**Evidence semantics:** these are *maintainer-reported and source-linked*
milestones. A green Actions run, commit or release cannot independently
demonstrate that a product is live, a workflow works end-to-end, or users
adopted it. The UI labels prototypes, demos and deployments accordingly.
Unsubstantiated dates are never filled automatically. Merged PRs, releases,
repository creation and editorially checked public pages continue to appear
without any manifest. Add a milestone only when its real date and evidence
are known. The optional manifest is read server-side through the public
GitHub Contents API, with an existing hourly cache and 50 KB size cap.

A `demo` milestone may optionally specify `"demoUrl"` alongside the
documented source PR or commit. Accepted URLs are deliberately restricted to
the exact owning repository's GitHub Pages root
(`https://OWNER.github.io/REPOSITORY/`) or the same approved YouTube/Vimeo
video used as its evidence. The build log then presents two distinct actions:
**view source evidence** and **try the public demo**. The live demo is only
represented as accessible public software, **not a claim of user adoption or
production usage**. Arbitrary outbound links and mismatched projects are rejected.

An owned project can also declare its **registered** public homepage as a demo
(`"demoUrl": "https://rescue.memolabs.dev/"`) if GitHub's repository homepage
matches that URL and the URL is on an exact HTTPS `*.memolabs.dev` subdomain
at the root path. The homepage is rechecked against the public GitHub
repository metadata; an arbitrary URL, redirect parameter, nonstandard port,
another project or lookalike host is rejected. The portfolio does **not**
infer a successful deployment from the homepage field: this link must be used
only for a real, independently checked public demo, with its source evidence
and stated verification date in the manifest. An accessible landing page does
not establish a working authenticated application.
