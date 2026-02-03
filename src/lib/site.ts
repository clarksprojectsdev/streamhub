/**
 * Base URL for the site (used in sitemap, robots, canonical).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yoursite.com).
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
}

/** Contact email for legal, DMCA, and general inquiries. */
export const CONTACT_EMAIL = "clarksprojectsdev@gmail.com";

/** Display date for "Last updated" on legal pages. Update when policies change. */
export const LAST_LEGAL_UPDATE = "February 2, 2025";
