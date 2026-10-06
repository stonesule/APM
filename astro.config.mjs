// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

// The production domain is pending (see docs/pending-inputs.md). When it is
// confirmed, set PUBLIC_SITE_URL in the host's build environment so canonical
// URLs and Open Graph tags use absolute links.
const site = env.PUBLIC_SITE_URL || undefined;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
