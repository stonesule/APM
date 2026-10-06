// HTTP checks against a running deployment of the site.
//
// Usage: npm run verify:hosting -- <base-url>
//   e.g. npm run verify:hosting -- http://localhost:8787
//        npm run verify:hosting -- https://apm-website-preview.<subdomain>.workers.dev
//
// Checks every route, the 404 behavior, linked assets and internal links,
// trailing-slash redirects, noindex, and that no form or third-party script
// is present. Exits non-zero on any failure.

const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) {
  console.error('Usage: npm run verify:hosting -- <base-url>');
  process.exit(2);
}

const routes = [
  '/',
  '/services/',
  '/services/painting/',
  '/services/accent-walls/',
  '/projects/',
  '/about/',
  '/request-estimate/',
];

const failures = [];
let passes = 0;
const check = (ok, label) => {
  if (ok) passes += 1;
  else failures.push(label);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
};

const get = (path, init) => fetch(base + path, { redirect: 'manual', ...init });
const attrs = (html, pattern) => [...html.matchAll(pattern)].map((m) => m[1]);

const internalTargets = new Set();

for (const route of routes) {
  const res = await get(route);
  const html = await res.text();
  check(res.status === 200, `${route} returns 200 (got ${res.status})`);
  check(/text\/html/.test(res.headers.get('content-type') ?? ''), `${route} is text/html`);
  check(/<meta name="robots" content="noindex, nofollow"/.test(html), `${route} has noindex`);
  check(!/<form\b/i.test(html), `${route} has no <form>`);
  check(!/<script[^>]+src=/i.test(html), `${route} loads no external/third-party scripts`);
  check(/data-menu-toggle/.test(html), `${route} includes the mobile menu`);

  for (const href of attrs(html, /(?:href|src)="([^"]+)"/g)) {
    if (href.startsWith('#')) continue;
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      check(false, `${route} has unexpected external link ${href}`);
    } else {
      internalTargets.add(href.split('#')[0]);
    }
  }
}

for (const target of [...internalTargets].sort()) {
  const res = await get(target);
  check(res.status === 200, `linked ${target} returns 200 (got ${res.status})`);
  if (target.endsWith('.css')) {
    check(/text\/css/.test(res.headers.get('content-type') ?? ''), `${target} is text/css`);
  }
  if (target.endsWith('.svg')) {
    check(/image\/svg\+xml/.test(res.headers.get('content-type') ?? ''), `${target} is SVG`);
  }
}

for (const missing of ['/this-page-does-not-exist/', '/services/not-a-service/', '/missing.css']) {
  const res = await get(missing);
  const html = await res.text();
  check(res.status === 404, `${missing} returns 404 (got ${res.status})`);
  check(/We couldn(?:'|&#39;)t find that page/.test(html), `${missing} serves the custom 404 page`);
  check(/noindex/.test(html), `${missing} 404 page has noindex`);
}

const redirect = await get('/about');
check(
  [301, 307, 308].includes(redirect.status) &&
    new URL(redirect.headers.get('location') ?? '', base).pathname === '/about/',
  `/about redirects to /about/ (got ${redirect.status} → ${redirect.headers.get('location')})`,
);

console.log(`\n${passes} passed, ${failures.length} failed`);
process.exit(failures.length > 0 ? 1 : 0);
