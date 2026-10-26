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

To add a **new public project** to the automatically refreshed "In progress" section,
add the GitHub repository topic `memo-showcase`. No site code change is needed.
The repository must not be archived, forked, private, empty, or without a push in
the last 120 days. Add `memo-hide` to keep a repository off the homepage. A few
established repositories are seeded in `EDITORIAL_REPOS` to make the initial
section useful. Only four projects are shown at once, ordered by most recent code
update, so a newly tagged project may replace an older project.

Merged PRs are discovered by GitHub search, filtered to the authenticated author's
public upstream contributions and deduplicated by upstream repository. Counts are
not used as a quality score.

This feature reads **public GitHub API data only**. An optional server-side
`GITHUB_READ_TOKEN` can increase API rate limits; never expose it using a
`NEXT_PUBLIC_` variable. When GitHub is unavailable or rate-limited, the homepage
remains usable and shows a neutral fallback rather than fabricated activity.

Run `npm test`, `npm run build`, then `npm run test:e2e` before publishing. Verify
that both locale pages render and that the public GitHub links remain accurate.
