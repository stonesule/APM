# CLAUDE.md

Static Astro website for APM Interior Design, LLC. See README.md for setup and
structure, docs/architecture.md for decisions, docs/pending-inputs.md for
missing client information.

## Validate before committing

```sh
nvm use            # Node 24 (.nvmrc)
npm run validate   # format:check + astro check + build
```

Run `npm run format` to fix formatting. CI runs the same steps and never deploys.

## Technical conventions

- Static output only. Do not add an adapter, server rendering, React or another
  UI framework, a database, auth, or a backend without an explicit decision
  recorded in docs/architecture.md.
- Astro components + semantic HTML + plain CSS. Use tokens from
  `src/styles/tokens.css`; do not hard-code colors in components.
- Keep client JS minimal. The mobile menu script is the only one; anything new
  must work (or degrade gracefully) without JS.
- Accessibility: one `<h1>` per page, labelled sections (`Section labelledBy`),
  visible focus, AA contrast (re-check when colors change), keyboard-usable
  controls. Keep the skip link and `main#main`.
- Internal links use trailing slashes (`/services/`), matching `trailingSlash: 'always'`.
- Business data lives in `src/config/*.ts`; collections in `src/content/`.
  Pages read from these files rather than hard-coding details.
- Never commit secrets. `PUBLIC_` env vars are public by definition.

## Content rules (client-facing copy)

- Company voice: "APM", "we", "our". Present APM as an established company.
- Service umbrella: "Interior Design & Property Enhancement". Never use "handyman".
- Do not invent employee counts, certifications, licenses, insurance,
  warranties, ratings, testimonials, project results, response times, or a
  founding year. The "25+ years of repeat clients" line is client-reported.
- Unknown phone, email, service area, review links, and photos stay `null`/empty
  and are not rendered. Never add dummy contact details or `#` links.
- Never render a form that reports success without confirmed delivery.

## Out of scope unless requested

Provisioning accounts, DNS changes, deployments, paid services, analytics
scripts, and Google Business Profile edits.
