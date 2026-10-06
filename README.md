# APM Interior Design — website

Website for **APM Interior Design, LLC**, an Interior Design & Property
Enhancement company serving the Atlanta metropolitan area.

Built with [Astro](https://astro.build) as a fully static site: TypeScript, plain
CSS, and almost no client-side JavaScript.

> **Status:** scaffold. The homepage is a starter, and the other routes are page
> shells awaiting approved content. See [pending client inputs](docs/pending-inputs.md).

## Requirements

- Node.js 24 LTS (pinned in `.nvmrc`; Astro 7 needs ≥ 22.12)
- npm (comes with Node)

```sh
nvm use        # or install Node 24 another way
npm ci         # install exact versions from package-lock.json
cp .env.example .env   # optional; every value may stay empty locally
```

## Commands

| Command                           | What it does                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`                     | Start the dev server at http://localhost:4321                                   |
| `npm run check`                   | Astro and TypeScript diagnostics                                                |
| `npm run build`                   | Production build to `dist/`                                                     |
| `npm run preview`                 | Serve the production build locally                                              |
| `npm run format`                  | Format all files with Prettier                                                  |
| `npm run format:check`            | Verify formatting (used in CI)                                                  |
| `npm run validate`                | Run `format:check`, `check`, and `build` (run before opening a PR)              |
| `npm run preview:worker`          | Preview build served through Wrangler at http://localhost:8787                  |
| `npm run deploy:check`            | Preview build + Wrangler dry run (no publish, no login needed)                  |
| `npm run verify:hosting -- <url>` | HTTP checks against a running site (local or deployed)                          |
| `npm run deploy:preview`          | **Publishes** the preview Worker (see [docs/deployment.md](docs/deployment.md)) |

CI (`.github/workflows/ci.yml`) runs the same checks on every pull request and on
pushes to `main`, plus a Wrangler dry run. CI does not deploy.

## Project structure

```text
src/
  config/
    site.ts           Business name, tagline, contact details, service areas
    navigation.ts     Header and footer links, estimate CTA
    services.ts       Service catalog (titles, summaries, detail-page links)
    integrations.ts   Form and analytics boundaries (nothing live yet)
  content/
    projects/         One Markdown file per approved project (empty)
    testimonials/     One Markdown file per approved testimonial (empty)
  content.config.ts   Schemas for the collections above
  components/         Metadata, SiteHeader, SiteFooter, Button, Section,
                      PageHeader, ServiceCard, EstimateCta
  layouts/
    BaseLayout.astro  Page shell: metadata, skip link, header, main, footer
  pages/              One file per route (see below)
  styles/
    tokens.css        Colors, type, spacing — change the look here
    global.css        Base element styles and utilities
public/               Static files copied as-is (favicon)
docs/                 Architecture notes and pending client inputs
```

Routes: `/`, `/services/`, `/services/painting/`, `/services/accent-walls/`,
`/projects/`, `/about/`, `/request-estimate/`, and a custom `404` page.

## Editing content

- **Business details** (phone, email, service areas, review links): edit
  `src/config/site.ts`. A value left as `null` or `[]` is simply not shown, so
  never add a placeholder like "555-0100".
- **Services**: edit `src/config/services.ts`. Cards on the homepage and
  `/services/` update automatically. Detail-page copy is in
  `src/pages/services/`.
- **Navigation**: edit `src/config/navigation.ts`.
- **Colors and typography**: edit `src/styles/tokens.css`, then re-check text
  contrast (WCAG AA: 4.5:1 for body text).
- **Projects**: add `src/content/projects/<slug>.md`:

  ```md
  ---
  title: Living room repaint
  summary: One-sentence description of the work.
  services: [painting, accent-walls] # slugs from src/config/services.ts
  area: Decatur # general area only, never an address
  completed: 2026-09-01
  coverImage: ./living-room.jpg # file next to the .md file
  coverAlt: Describe what the photo shows
  ---
  ```

  Only publish completed work APM approved, with photos APM may use.

- **Testimonials**: add `src/content/testimonials/<slug>.md` with the quote as
  the body:

  ```md
  ---
  attribution: Jordan P.
  service: painting
  permissionConfirmed: true
  ---

  The client's exact words.
  ```

  A homepage testimonial section appears automatically once one exists. Use only
  real quotes with the client's permission.

Set `draft: true` on a project or testimonial to keep it out of the build. Empty
collections log a harmless `No files found` warning during builds.

## Environment variables

See `.env.example`. All variables are `PUBLIC_`: they end up in the HTML and are
not secrets. Never commit `.env`.

| Variable                   | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`          | Production URL for canonical/OG tags; production only, not previews     |
| `PUBLIC_ALLOW_INDEXING`    | `true` only on the production deployment; otherwise pages are `noindex` |
| `PUBLIC_FORMSPREE_FORM_ID` | Reserved for the estimate form ticket; the scaffold renders no form     |

## Hosting

The site is hosted on **Cloudflare Workers static assets** (Free plan), with
no Worker script, adapter, or backend. `wrangler.jsonc` defines one isolated
**preview** Worker, `apm-website-preview`, served on `workers.dev` only, with
no route or custom domain for `apminteriordesign.com`. Unknown paths return the
custom 404 page with HTTP 404.

Deploys are manual: `npm run deploy:preview` validates, forces `noindex`,
rebuilds, and publishes. It requires `CLOUDFLARE_ACCOUNT_ID` (APM's account)
and a clean working tree. Authentication, account selection, redeploying, and
rollback are covered in [docs/deployment.md](docs/deployment.md). Production
launch (domain, DNS) is a separate ticket.

## Pending client inputs

Contact details, service area, production DNS and launch, photos, testimonials, review links, logo,
service scope, and the hosting choice are all pending. The full list, with where
each value goes, is in [docs/pending-inputs.md](docs/pending-inputs.md).
