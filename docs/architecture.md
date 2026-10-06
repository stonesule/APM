# Architecture notes

Decision record for the initial scaffold (October 2026). Update this file when a
decision changes.

## Decisions

| Area       | Decision                                                                              | Why                                                                                    |
| ---------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Framework  | Astro 7, `output: 'static'`, no adapter                                               | Marketing site with no per-request logic; static HTML is fast, cheap, and portable.    |
| Language   | TypeScript, `astro/tsconfigs/strict` plus `noUncheckedIndexedAccess`                  | Catch content and config mistakes at `npm run check` time.                             |
| Runtime    | Node 24 LTS (`.nvmrc`); `engines` allows ≥ 22.12 (Astro 7 minimum)                    | Same version locally and in CI.                                                        |
| Packages   | npm with committed `package-lock.json`; CI uses `npm ci`                              | Reproducible installs.                                                                 |
| UI         | Astro components, semantic HTML, plain CSS with tokens in `src/styles/tokens.css`     | No UI framework is needed for this content. No React.                                  |
| JavaScript | One small inline script for the mobile menu; no other client JS                       | Menu works without JS (nav is shown, toggle hidden), enhanced when JS is available.    |
| Fonts      | System font stacks                                                                    | No third-party font requests or licensing questions. Revisit if branding requires one. |
| Content    | Typed TS config in `src/config/`; empty `projects` and `testimonials` collections     | Business details editable in one place; no fabricated portfolio or reviews.            |
| URLs       | `trailingSlash: 'always'`, `build.format: 'directory'`                                | Every route is `/path/` → `dist/path/index.html`, which all static hosts serve.        |
| Indexing   | `noindex` unless `PUBLIC_ALLOW_INDEXING=true`                                         | Preview and pre-launch builds stay out of search results.                              |
| CI         | GitHub Actions: `npm ci`, `format:check`, `check`, `build` on PRs and pushes to main. | CI never deploys.                                                                      |

Not used, on purpose: React or other UI frameworks, a database, authentication,
a paid CMS, server rendering, custom backend, analytics scripts.

## Hosting: pending decision

The earlier proposal was **Cloudflare Pages**. Current official guidance (checked
2026-10-06) has changed:

- Astro's Cloudflare guide states that Cloudflare recommends **Workers** for new
  projects, and that a fully static Astro site needs no adapter.
- Cloudflare's Pages → Workers migration guide positions **Workers static
  assets** as the successor for static sites.

Both options serve this build unchanged, cost nothing for a static site at this
scale, and fit the < $50/month operating budget. **The choice is pending** and
nothing has been provisioned. The build is portable to any static host.

### Option A — Workers static assets (current Cloudflare recommendation)

Requires adding `wrangler` as a dev dependency and a `wrangler.jsonc` at the
repo root (not committed yet, so the decision is not made implicitly):

```jsonc
{
  "name": "apm-website",
  "compatibility_date": "<deploy date, YYYY-MM-DD>",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
  },
}
```

Workers Builds (Git integration) settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node version: from `.nvmrc` (or set `NODE_VERSION=24`)

### Option B — Cloudflare Pages (original proposal)

Pages Git integration settings:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION=24` (if `.nvmrc` is not picked up)

Pages serves `dist/404.html` for unknown paths automatically.

### Either option

- Set `PUBLIC_SITE_URL` once the domain is known; set `PUBLIC_ALLOW_INDEXING=true`
  **only** on the production environment.
- The Cloudflare account should be owned by APM (Alonza) with delegated access
  for Sule.

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
- Formspree's free plan has a monthly submission cap; confirm the plan against
  expected lead volume and budget before launch.

### Email (Google Workspace proposed)

- No email address is rendered until one is set in `src/config/site.ts`.
- The form's notification inbox should be an APM Workspace address.

### Analytics

- No provider chosen; no script installed. `integrations.analytics.enabled` is
  `false`. Choosing a provider (e.g. Cloudflare Web Analytics, which is cookieless)
  and any consent requirements is a separate ticket.
