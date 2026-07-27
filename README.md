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
