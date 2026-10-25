# Public evidence access audit

This process keeps the **links** in the recruiter-facing portfolio usable. It does **not** prove that a linked application can fulfill a private workflow, process a successful payment, generate correct AI results, or has active customers.

## What is covered

The audit reads `FEATURED[].links` in `src/data/projects.ts`. It performs read-only GET requests against all published public destinations and, for an npm package, queries **both** the human-facing npm page and the official npm registry's `/latest` metadata. It does not create accounts, book tickets, submit purchases, sign in, access private data, invoke customer APIs, or scrape hidden services.

Public URLs may redirect. The report records the final URL, HTTP response, timestamp and independent result for each link. Only `404` or `410` conclusively means the public link is missing. `401`, `403`, and `429` are **restricted**, not broken; transient or network errors are **inconclusive**. In particular, npm.com can return 403 to bots while registry metadata confirms that `n8n-nodes-opn` is published. An HTTP 200 alone is not product verification.

## Run and review

```sh
npm run test:evidence
npm run audit:evidence
```

GitHub Actions runs [Public project evidence access audit](../.github/workflows/public-evidence-audit.yml) weekly (Monday 07:15 UTC), when public evidence source/audit files change in a pull request, and when manually requested. A concise Markdown table is shown in the run summary. Two machine-readable artifacts are retained for 21 days: `public-links.json` and `public-links.md`.

An audit fails only after a public link actually returns 404/410, **not** because a site blocks a bot or times out. It creates no GitHub issues, emails, DMs or other external notifications and never edits the portfolio automatically.

## Responsible evidence claims

The manually reviewed `ProjectVerification.checkedAt` and `note` fields in the portfolio describe the **separately verified scope** at the recorded date. Scheduled link checks must not silently rewrite those fields, imply continuous operation or change the public product maturity labels. Before making new claims, collect dated, reproducible proofs on non-sensitive/test data and validate the whole user journey.

After a missing link alert, a human should check redirects, confirm whether it is a temporary outage or removal, and only then update the link, status or visible evidence. Record the date and limits of that manual validation.
