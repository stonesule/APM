/**
 * Service catalog. Add or edit services here; the services index, homepage,
 * and service cards read from this list.
 *
 * Keep descriptions factual. Do not add guarantees, licenses, certifications,
 * warranties, or turnaround promises unless the client has confirmed them.
 */

export type ServiceSlug =
  'painting' | 'accent-walls' | 'electrical-plumbing' | 'residential-cleaning';

export interface Service {
  slug: ServiceSlug;
  title: string;
  /** One or two sentences for cards. */
  summary: string;
  /** Marks the core specialty. */
  featured: boolean;
  /** Detail page path, if one exists. Services without a page link to the index. */
  href: string | null;
}

export const services: readonly Service[] = [
  {
    slug: 'painting',
    title: 'Professional Painting',
    summary:
      'Our core specialty: careful preparation, clean lines, and finishes that suit the way each space is used.',
    featured: true,
    href: '/services/painting/',
  },
  {
    slug: 'accent-walls',
    title: 'Custom Accent Walls',
    summary:
      'Designed and installed feature walls that add texture, depth, and character to a room.',
    featured: true,
    href: '/services/accent-walls/',
  },
  {
    slug: 'electrical-plumbing',
    title: 'Minor Electrical & Plumbing',
    summary:
      'Smaller electrical and plumbing tasks handled alongside your project, so the details are finished together.',
    featured: false,
    href: null,
  },
  {
    slug: 'residential-cleaning',
    title: 'Residential Cleaning',
    summary: 'Cleaning services that leave a home ready to enjoy, show, or move into.',
    featured: false,
    href: null,
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

/** Customer groups APM serves. */
export const audiences: readonly string[] = [
  'Homeowners',
  'Property owners',
  'Real estate investors',
  'Commercial clients',
];
