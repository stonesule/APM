export interface NavItem {
  label: string;
  href: string;
}

/** Primary header navigation. Order here is the order rendered. */
export const primaryNav: readonly NavItem[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
];

/** The estimate call to action, shown as a button in the header and pages. */
export const estimateCta: NavItem = {
  label: 'Request an Estimate',
  href: '/request-estimate/',
};

/** Footer navigation. */
export const footerNav: readonly NavItem[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Painting', href: '/services/painting/' },
  { label: 'Accent Walls', href: '/services/accent-walls/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
  estimateCta,
];

/** True when `href` is the current page or a parent section of it. */
export function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return href === '/' ? path === '/' : path.startsWith(href);
}
