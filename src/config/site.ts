/**
 * Business settings for APM Interior Design, LLC.
 *
 * Values set to `null` are pending client input (tracked in
 * docs/pending-inputs.md). Components must not render a pending value, so
 * leave a field `null` rather than adding a placeholder.
 */

export interface SiteSettings {
  /** Legal business name. */
  legalName: string;
  /** Short brand name used in copy ("APM"). */
  shortName: string;
  /** Service umbrella shown under the brand name. */
  tagline: string;
  /** Default meta description. */
  description: string;
  /** Market description. Exact service boundaries are pending. */
  market: string;
  /**
   * Client-reported relationship history. Do not convert this into a
   * founding year or company age.
   */
  experienceStatement: string;
  contact: {
    /** Display format, e.g. "(404) 555-…". Pending. */
    phone: string | null;
    /** Public inbox on the Google Workspace domain. Pending. */
    email: string | null;
  };
  /** Cities or counties served. Pending — keep empty until confirmed. */
  serviceAreas: readonly string[];
  /** Approved review profile links (e.g. Google Business Profile). Pending. */
  reviewLinks: readonly { label: string; href: string }[];
  /** Approved social profile links. Pending. */
  socialLinks: readonly { label: string; href: string }[];
}

export const site: SiteSettings = {
  legalName: 'APM Interior Design, LLC',
  shortName: 'APM',
  tagline: 'Interior Design & Property Enhancement',
  description:
    'APM Interior Design provides professional painting, custom accent walls, and coordinated property enhancement services in the Atlanta metropolitan area.',
  market: 'the Atlanta metropolitan area',
  experienceStatement:
    'Our work is built on more than 25 years of repeat clients and word-of-mouth referrals.',
  contact: {
    phone: null,
    email: null,
  },
  serviceAreas: [],
  reviewLinks: [],
  socialLinks: [],
};

/** Convert a display phone number into a `tel:` href. */
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
