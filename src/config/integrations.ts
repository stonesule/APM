/**
 * Boundaries for third-party integrations. Nothing here is live yet.
 *
 * - Forms: Formspree is proposed. The estimate form is a later ticket; the
 *   scaffold intentionally renders no form, so no request can appear to
 *   succeed when it was not delivered.
 * - Analytics: no provider has been chosen and no tracking script is loaded.
 *
 * See docs/architecture.md for the decision record.
 */

const formspreeFormId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID?.trim() || null;

export const integrations = {
  forms: {
    provider: 'formspree' as const,
    /** Endpoint the estimate form will post to, once a form ID is configured. */
    endpoint: formspreeFormId ? `https://formspree.io/f/${formspreeFormId}` : null,
  },
  analytics: {
    enabled: false,
  },
};

/** Only the approved production build should be indexed by search engines. */
export const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
