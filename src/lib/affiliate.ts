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

/** Optional Brazzers affiliate URL. When set, main CTA rotates 50/50 with Chaturbate (by slug hash). */
const BRAZZERS_AFFILIATE_URL = (process.env.NEXT_PUBLIC_BRAZZERS_AFFILIATE_URL ?? "").trim() || undefined;

/**
 * Chaturbate affiliate links (Revshare program)
 */
export const CHATURBATE_LINKS = {
  /** General homepage - best for tube site traffic */
  HOME_PAGE: "https://chaturbate.com/in/?tour=grq0&campaign=0roTN&track=default",
  /** Direct signup focus */
  JOIN_PAGE: "https://chaturbate.com/in/?tour=3Mc9&campaign=0roTN&track=default&redirect_to_room=-welcomepage-",
  /** Female-focused traffic */
  HOME_PAGE_FEMALES: "https://chaturbate.com/in/?tour=IsSO&campaign=0roTN&track=default",
} as const;

/**
 * Builds the outbound affiliate URL for a video. When Brazzers URL is set, rotates 50/50 with
 * Chaturbate by slug hash (same video always gets same program). Otherwise uses base URL only.
 * @param slug - Video slug (e.g. from route or video.slug)
 * @returns Full affiliate URL with subid and any optional params
 */
export function getAffiliateUrl(slug: string): string {
  if (!BRAZZERS_AFFILIATE_URL) {
    const url = new URL(AFFILIATE_BASE_URL);
    url.searchParams.set(AFFILIATE_SUBID_PARAM, slug);
    if (AFFILIATE_CAMPAIGN) url.searchParams.set("campaign", AFFILIATE_CAMPAIGN);
    if (AFFILIATE_SOURCE) url.searchParams.set("source", AFFILIATE_SOURCE);
    if (AFFILIATE_MEDIUM) url.searchParams.set("medium", AFFILIATE_MEDIUM);
    return url.toString();
  }
  const hash = slug.split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  const useBrazzers = Math.abs(hash) % 2 === 1;
  if (useBrazzers) {
    const url = new URL(BRAZZERS_AFFILIATE_URL);
    url.searchParams.set(AFFILIATE_SUBID_PARAM, slug);
    return url.toString();
  }
  const url = new URL(AFFILIATE_BASE_URL);
  url.searchParams.set(AFFILIATE_SUBID_PARAM, slug);
  if (AFFILIATE_CAMPAIGN) url.searchParams.set("campaign", AFFILIATE_CAMPAIGN);
  if (AFFILIATE_SOURCE) url.searchParams.set("source", AFFILIATE_SOURCE);
  if (AFFILIATE_MEDIUM) url.searchParams.set("medium", AFFILIATE_MEDIUM);
  return url.toString();
}

/**
 * Builds a Chaturbate affiliate URL with subid tracking.
 * @param baseUrl - Chaturbate affiliate link
 * @param slug - Video slug for tracking
 * @returns Full Chaturbate affiliate URL with subid
 */
export function getChaturbateUrl(baseUrl: string, slug: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set(AFFILIATE_SUBID_PARAM, slug);
  return url.toString();
}
