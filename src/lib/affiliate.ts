/**
 * Central affiliate link configuration.
 * Set NEXT_PUBLIC_AFFILIATE_BASE_URL in .env.local to your partner's base URL.
 * See .env.example for optional campaign/source params.
 */

/** Base URL for outbound affiliate links (no trailing slash). */
export const AFFILIATE_BASE_URL =
  process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL ?? "https://example.com/affiliate";

/** Optional campaign name (e.g. streamhub) – only added if set in env. */
export const AFFILIATE_CAMPAIGN = process.env.NEXT_PUBLIC_AFFILIATE_CAMPAIGN ?? "";

/** Optional source (e.g. web) – only added if set in env. */
export const AFFILIATE_SOURCE = process.env.NEXT_PUBLIC_AFFILIATE_SOURCE ?? "";

/** Optional medium (e.g. affiliate) – only added if set in env. */
export const AFFILIATE_MEDIUM = process.env.NEXT_PUBLIC_AFFILIATE_MEDIUM ?? "";

/** Query parameter name used for video slug (subid). */
export const AFFILIATE_SUBID_PARAM = "subid";

/** Recommended rel for external affiliate links. */
export const AFFILIATE_LINK_REL = "nofollow noopener noreferrer" as const;

/**
 * Builds the outbound affiliate URL for a video: base URL + subid (slug) + optional campaign/source.
 * @param slug - Video slug (e.g. from route or video.slug)
 * @returns Full affiliate URL with subid and any optional params
 */
export function getAffiliateUrl(slug: string): string {
  const url = new URL(AFFILIATE_BASE_URL);
  url.searchParams.set(AFFILIATE_SUBID_PARAM, slug);
  if (AFFILIATE_CAMPAIGN) url.searchParams.set("campaign", AFFILIATE_CAMPAIGN);
  if (AFFILIATE_SOURCE) url.searchParams.set("source", AFFILIATE_SOURCE);
  if (AFFILIATE_MEDIUM) url.searchParams.set("medium", AFFILIATE_MEDIUM);
  return url.toString();
}
