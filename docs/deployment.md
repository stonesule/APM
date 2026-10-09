# Deployment (Cloudflare Workers static assets)

The site is hosted as a **static-assets-only Cloudflare Worker**: Cloudflare
serves the files Astro builds into `dist/`. No Worker script, server rendering,
or backend runs. Configuration lives in `wrangler.jsonc`.

Only the **preview** target exists. It is served on a `workers.dev` URL, has no
routes or custom domains, and cannot serve `apminteriordesign.com`. Production
launch (custom domain, DNS) is a separate ticket.

**Status:** preview deployed and verified (latest: AMP-5 design with supplied logos, 2026-10-09).

| Field           | Value                                                     |
| --------------- | --------------------------------------------------------- |
| URL             | https://apm-website-preview.apminteriordesign.workers.dev |
| Deployed commit | `83a4a1d` (AMP-5 logos, PR #4; Wrangler version tag)      |
| Version ID      | `d154ead6-0ec6-4755-9f76-53510047e651`                    |
| Verification    | `verify:hosting` 65/65 passed; browser checks (see PR #4) |

Update this table after each redeploy, or run `npx wrangler deployments list`.
Previous: `efa48c3` / `f3ebedac…` (AMP-5 first design) and `5b1671e` / `c02002eb…`
(AMP-4 scaffold, PR #3), available for rollback.

| Target  | Worker name           | URL                                                         | Indexed?              |
| ------- | --------------------- | ----------------------------------------------------------- | --------------------- |
| Preview | `apm-website-preview` | `https://apm-website-preview.apminteriordesign.workers.dev` | No (`noindex` forced) |

The account's workers.dev subdomain is `apminteriordesign`, created on
2026-10-06. Changing it later changes every workers.dev URL in the account.

## Commands

| Command                                | Publishes? | What it does                                                                                             |
| -------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `npm run validate`                     | No         | Format check, `astro check`, production build                                                            |
| `npm run build:preview`                | No         | Build with `PUBLIC_ALLOW_INDEXING=false` forced, overriding `.env` and the shell                         |
| `npm run preview:worker`               | No         | Preview build, then serve `dist/` through Wrangler at http://localhost:8787 (same routing as Cloudflare) |
| `npm run deploy:check`                 | No         | Preview build, then `wrangler deploy --dry-run` (validates config and assets; needs no login)            |
| `npm run verify:hosting -- <base-url>` | No         | HTTP checks against a running site: routes, 404s, assets, links, redirects, noindex, no forms            |
| `npm run cf:whoami`                    | No         | Show the logged-in Cloudflare user and the accounts it can access                                        |
| `npm run deploy:preview`               | **Yes**    | `validate` → deploy guard → fresh preview build → `wrangler deploy`, tagged with the git commit          |

`deploy:preview` refuses to run unless `CLOUDFLARE_ACCOUNT_ID` is set and the
working tree is clean (`scripts/check-deploy-ready.mjs`). Each deployment's
version is tagged with the short commit hash, which **identifies the commit that
was deployed**. A clean tree only guarantees the build matches that commit; it
does not prove the commit was reviewed. Deploy commits that have passed review
and CI (normally `main`, or a PR branch under review).

These scripts use POSIX shell syntax (macOS, Linux, WSL, or Git Bash).

## Account ownership and access

**Current state (verified 2026-10-06):** the preview is hosted in Cloudflare
account `Sule.stone1024@gmail.com's Account` (ID
`0ce9e34b…c0ec14`; full ID via `npm run cf:whoami`), Free plan. That account also holds the
`apminteriordesign.com` zone. Sule designated it for APM hosting. Its only
member is Sule (Super Administrator), and APM/Alonza is not yet a member. Billing
ownership could not be read with the available token. Bringing it in line with
the target below is a launch dependency (see pending-inputs.md).

Target:

- The Cloudflare account must be **owned by APM** (Alonza), on the Free plan,
  with APM's billing. Sule is invited as a member
  (Manage Account → Members) with the **Workers Platform Admin** role, which can
  deploy Workers without account-wide admin rights. Do not deploy from a
  personal account.
- Never commit API tokens. `.env`, `.dev.vars`, and `.wrangler/` are git-ignored.

## Authenticate

Pick one:

1. **Interactive (local machine):** `npx wrangler login` opens a browser OAuth
   flow. Sign in as the user who is a member of the APM account. Then run
   `npm run cf:whoami` and confirm the APM account is listed.
2. **API token (scripts or a shared machine):** in the APM account create a token
   from the **Edit Cloudflare Workers** template, scoped to the APM account only.
   Export it in your shell for the session; do not write it to a file in the repo:

   ```sh
   export CLOUDFLARE_API_TOKEN=…   # paste locally; never commit or share in chat
   ```

## Select the account

Always set the APM account explicitly. The ID is shown in `npm run cf:whoami`
and in the dashboard URL/sidebar. An account ID is not a secret, but it is kept
out of the repo until APM's account is confirmed:

```sh
export CLOUDFLARE_ACCOUNT_ID=<APM account id>
npm run cf:whoami    # confirm the account name is APM's
```

## Deploy or redeploy the preview

```sh
git switch main && git pull           # or the branch under review
npm ci
export CLOUDFLARE_ACCOUNT_ID=<APM account id>
npm run deploy:preview
```

Wrangler prints the `workers.dev` URL. The first deploy creates the
`apm-website-preview` Worker. Later deploys replace its content with a new
version. Then verify:

```sh
npm run verify:hosting -- https://apm-website-preview.<account-subdomain>.workers.dev
```

Also spot-check the mobile menu and keyboard navigation in a browser.

## Recover a previously reviewed version

Option A, roll back to an earlier uploaded version (fastest, no rebuild):

```sh
npx wrangler deployments list     # recent deployments, with version IDs
npx wrangler versions list        # versions, tagged with the deployed commit hash
npx wrangler rollback <version-id> --message "Roll back to <commit>"
```

Option B, rebuild a specific commit (pick one that passed review and CI):

```sh
git switch --detach <commit>
npm ci
npm run deploy:preview
git switch main
```

## Free plan limits and costs

- Requests for static assets are free and unlimited. This Worker has no script,
  so it uses none of the Free plan's 100,000 daily Worker invocations.
- Up to 20,000 files per version and 25 MiB per file on the Free plan; the site
  is currently 10 files and under 100 KB.
- Asset storage has no additional cost.
- Hosting cost: **$0/month** on the Free plan. Paid add-ons are not needed.

Limits checked against Cloudflare documentation on 2026-10-06; recheck before
launch.

## Not part of this setup

- Production deployment, custom domain or route for `apminteriordesign.com`,
  DNS, and email records.
- Automatic deploys. GitHub Actions only validates, including a no-publish
  Wrangler dry run. Cloudflare Workers Builds (Git integration) is not
  connected.
