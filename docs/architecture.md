# Architecture notes

Decision record for the initial scaffold (October 2026). Update this file when a
decision changes.

## Decisions

| Area       | Decision                                                                                                | Why                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Framework  | Astro 7, `output: 'static'`, no adapter                                                                 | Marketing site with no per-request logic; static HTML is fast, cheap, and portable.    |
| Language   | TypeScript, `astro/tsconfigs/strict` plus `noUncheckedIndexedAccess`                                    | Catch content and config mistakes at `npm run check` time.                             |
| Runtime    | Node 24 LTS (`.nvmrc`); `engines` allows ≥ 22.12 (Astro 7 minimum)                                      | Same version locally and in CI.                                                        |
| Packages   | npm with committed `package-lock.json`; CI uses `npm ci`                                                | Reproducible installs.                                                                 |
| UI         | Astro components, semantic HTML, plain CSS with tokens in `src/styles/tokens.css`                       | No UI framework is needed for this content. No React.                                  |
| JavaScript | One small inline script for the mobile menu; no other client JS                                         | Menu works without JS (nav is shown, toggle hidden), enhanced when JS is available.    |
| Fonts      | System font stacks                                                                                      | No third-party font requests or licensing questions. Revisit if branding requires one. |
| Content    | Typed TS config in `src/config/`; empty `projects` and `testimonials` collections                       | Business details editable in one place; no fabricated portfolio or reviews.            |
| URLs       | `trailingSlash: 'always'`, `build.format: 'directory'`                                                  | Every route is `/path/` → `dist/path/index.html`, which all static hosts serve.        |
| Indexing   | `noindex` unless `PUBLIC_ALLOW_INDEXING=true`                                                           | Preview and pre-launch builds stay out of search results.                              |
| CI         | GitHub Actions: `npm ci`, `format:check`, `check`, `build`, Wrangler dry run on PRs and pushes to main. | CI never deploys.                                                                      |

Not used, on purpose: React or other UI frameworks, a database, authentication,
a paid CMS, server rendering, custom backend, analytics scripts.

## Hosting: Cloudflare Workers static assets (decided in AMP-4)

**Decision:** host the static build as an assets-only Cloudflare Worker on the
Free plan. This replaces the earlier Cloudflare Pages proposal, in line with
current Astro and Cloudflare guidance (checked 2026-10-06): Astro's Cloudflare
guide says Cloudflare recommends Workers for new projects, and Cloudflare
positions Workers static assets as the successor to Pages for static sites.

**Why no backend is needed:** every page is pre-rendered HTML. Cloudflare serves
`dist/` directly, with no `main` script, no Astro adapter, and no server
rendering. The future estimate form will post to Formspree from the browser, so
it doesn't need an APM backend either.

**Configuration** (`wrangler.jsonc`):

- Preview Worker `apm-website-preview` on `workers.dev`; no routes or custom
  domains. Per-version preview URLs are off, so there is one URL to review.
- `html_handling: "auto-trailing-slash"`: `/about/` serves `about/index.html`,
  and `/about` redirects (307) to `/about/`.
- `not_found_handling: "404-page"`: unknown paths get `dist/404.html` with
  HTTP 404.

**Costs and limits (Free plan):**

- Static asset requests are free and unlimited, and don't count toward the
  100,000 daily Worker invocations.
- Up to 20,000 files per version and 25 MiB per file.
- No storage charge. Expected hosting cost: $0/month, within the
  < $50/month operating budget.

**Process:** deploys are manual and explicit (`npm run deploy:preview`). CI
validates and runs a Wrangler dry run, but never deploys. Commands,
authentication, and rollback are covered in [deployment.md](deployment.md).

**Still pending:** the production Worker or route for `apminteriordesign.com`,
DNS, and launch configuration. Each needs its own ticket and APM sign-off.

## Deferred integrations

### Estimate form (Formspree proposed)

- `PUBLIC_FORMSPREE_FORM_ID` is reserved in `.env.example` and read by
  `src/config/integrations.ts`. The form ID is public by design (it appears in
  the form action URL); it is not a secret.
- `/request-estimate/` intentionally renders **no form**. The form ticket must
  include: labelled fields, client- and server-side validation feedback, spam
  protection (Formspree honeypot/reCAPTCHA settings), a success state shown only
  after Formspree confirms delivery, an error state with an alternative contact
  method, and a test submission to an APM-owned inbox.
- Formspree remains deferred. Its plan must be reconciled with the AMP-2
  proposal before implementation: monthly submission capacity against expected
  lead volume, cost against the < $50/month budget, and account ownership by
  APM with delegated access for Sule.

### Email (Google Workspace proposed)

- No email address is rendered until one is set in `src/config/site.ts`.
- The form's notification inbox should be an APM Workspace address.

### Analytics

- No provider chosen; no script installed. `integrations.analytics.enabled` is
  `false`. Choosing a provider (e.g. Cloudflare Web Analytics, which is cookieless)
  and any consent requirements is a separate ticket.
