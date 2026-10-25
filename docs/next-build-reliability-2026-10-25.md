# Deterministic Next.js production builds — 2026-10-25

## Incident

After merging [portfolio PR #23](https://github.com/guillaume-flambard/portfolio/pull/23), the GHCR publishing workflow for main failed during `npm run build` in the Nixpacks Docker environment. The error was `Turbopack build failed` with repeated `Can't resolve '@vercel/turbopack-next/internal/font/google/font'` from Oswald font declarations, even though the PR's test and build workflows were green.

This intermittency has been reported in Next.js 16.3.x using `next/font/google` (see https://github.com/vercel/next.js/issues/97344). The official Next.js CLI documents `next build --webpack` as a supported production alternative: https://nextjs.org/docs/app/api-reference/cli/next.

## Resolution

The shared `npm run build` script now calls `next build --webpack`. This means local builds, CI/CD, the production-mode Chromium tests, and the GHCR Nixpacks Docker image all exercise the **same bundler**, without editing generated `.github/workflows/build.yml` (managed upstream by lab-infra).

Webpack is a reliability workaround while this Next.js Turbopack font-regression affects the pinned version, not a claim that Turbopack is generally slower or insecure. Re-evaluate after a verified Next.js upgrade; never remove the fallback until repeated full Docker image builds and public deployment validation have passed.

## Required acceptance

- GitHub Actions CI: unit tests and production Next build success.
- GitHub Actions Chromium: bilingual 320/390px routing, navigation and A4 PDF success.
- GHCR Docker image: main build/push success using the Webpack command.
- VPS autodeploy: correct image reported healthy, then live site HTML checked.

Do not mark a site release complete based on CI alone; the final two checks above are mandatory.
