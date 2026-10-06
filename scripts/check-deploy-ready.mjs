// Pre-deploy guard for `npm run deploy:preview`.
//
// - Requires CLOUDFLARE_ACCOUNT_ID so a deploy can never silently land in
//   whichever account the local Wrangler login happens to default to.
// - Requires a clean, committed working tree so the version tag recorded with
//   the deployment (the git commit) matches exactly what was deployed.
import { execSync } from 'node:child_process';

const problems = [];

if (!process.env.CLOUDFLARE_ACCOUNT_ID?.trim()) {
  problems.push(
    'CLOUDFLARE_ACCOUNT_ID is not set. Set it to the APM Cloudflare account ID (run `npm run cf:whoami` to list accounts).',
  );
}

const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
if (status) {
  problems.push('The working tree has uncommitted changes. Commit or stash them before deploying.');
}

if (problems.length > 0) {
  console.error('Preview deploy blocked:\n' + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}

const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
console.log(
  `Deploy checks passed. Account ${process.env.CLOUDFLARE_ACCOUNT_ID}, commit ${commit}.`,
);
