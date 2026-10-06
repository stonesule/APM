/**
 * Service catalog. Add or edit services here; the homepage, services page,
 * service detail pages, and the estimate form layout read from this list.
 *
 * Keep descriptions factual. Do not add guarantees, licenses, certifications,
 * warranties, turnaround promises, or scope (e.g. exterior painting, cleaning
 * packages) unless the client has confirmed them. Unconfirmed details go in
 * `pendingDetails`, which the design preview shows as "pending confirmation".
 */

export type ServiceSlug =
  'painting' | 'accent-walls' | 'interior-design' | 'electrical-plumbing' | 'residential-cleaning';

/** core = the specialty; feature = has its own page; supporting = grouped. */
export type ServiceTier = 'core' | 'feature' | 'supporting';

export interface Service {
  slug: ServiceSlug;
  title: string;
  /** One or two sentences for cards. */
  summary: string;
  tier: ServiceTier;
  /** Detail page path, if one exists. */
  href: string | null;
  /** Scope questions awaiting client confirmation. Empty once confirmed. */
  pendingDetails: readonly string[];
}

export const services: readonly Service[] = [
  {
    slug: 'painting',
    title: 'Professional Painting',
    summary:
      'Careful preparation, clean lines, and finishes chosen to suit the way each space is used.',
    tier: 'core',
    href: '/services/painting/',
    pendingDetails: [
      'Which surfaces and settings are offered (for example interior, exterior, cabinetry, or commercial)',
      'Finish and product options',
    ],
  },
  {
    slug: 'accent-walls',
    title: 'Custom Accent Walls',
    summary:
      'Designed feature walls that add texture, depth, and character to a room, planned with you from the first idea.',
    tier: 'feature',
    href: '/services/accent-walls/',
    pendingDetails: ['Accent wall styles, materials, and installation types offered'],
  },
  {
    slug: 'interior-design',
    title: 'Interior Design',
    summary:
      'Thoughtful guidance on color, finishes, and how a space comes together, so each improvement feels intentional.',
    tier: 'supporting',
    href: null,
    pendingDetails: ['How design services are offered and what they include'],
  },
  {
    slug: 'electrical-plumbing',
    title: 'Minor Electrical & Plumbing',
    summary:
      'Smaller electrical and plumbing tasks coordinated alongside your project, so the details are finished together.',
    tier: 'supporting',
    href: null,
    pendingDetails: ['Which tasks are included, and how any licensed-trade work is handled'],
  },
  {
    slug: 'residential-cleaning',
    title: 'Residential Cleaning',
    summary: 'Cleaning services that help leave a home ready to enjoy, show, or move into.',
    tier: 'supporting',
    href: null,
    pendingDetails: ['Types of cleaning offered'],
  },
];

export const serviceSlugs = services.map((service) => service.slug) as [
  ServiceSlug,
  ...ServiceSlug[],
];

export function getService(slug: ServiceSlug): Service {
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export const servicesByTier = (tier: ServiceTier) =>
  services.filter((service) => service.tier === tier);

/** Customer groups APM serves. */
export const audiences: readonly string[] = [
  'Homeowners',
  'Property owners',
  'Real estate investors',
  'Commercial clients',
];
