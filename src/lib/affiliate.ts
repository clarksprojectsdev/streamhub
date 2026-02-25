/**
 * Central affiliate link configuration.
 * Set NEXT_PUBLIC_AFFILIATE_BASE_URL in .env.local to your partner's base URL.
 * See .env.example for optional campaign/source params.
 *
 * Smart affiliate: GEO + device detection + offer rotation (Chaturbate, Dating, Webcam).
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

/** Offer types for rotation and conversion tracking. */
export type AffiliateOfferType = "chaturbate" | "dating" | "webcam";

/** Context for smart affiliate selection (GEO + device). */
export interface AffiliateContext {
  country?: string;
  isMobile?: boolean;
}

/** Optional dating affiliate URL. Falls back to Chaturbate if unset. */
const AFFILIATE_DATING_URL = (process.env.NEXT_PUBLIC_AFFILIATE_DATING_URL ?? "").trim() || undefined;

/** Optional webcam affiliate URL (e.g. Stripchat, BongaCams). Falls back to Chaturbate if unset. */
const AFFILIATE_WEBCAM_URL = (process.env.NEXT_PUBLIC_AFFILIATE_WEBCAM_URL ?? "").trim() || undefined;

/**
 * Lovense affiliate (adult toys store). Override with NEXT_PUBLIC_LOVENSE_AFFILIATE_URL in .env.local.
 * @see https://www.lovense.com/affiliate/become-an-affiliate
 */
export const LOVENSE_STORE_URL =
  (process.env.NEXT_PUBLIC_LOVENSE_AFFILIATE_URL ?? "https://www.lovense.com/r/g5oi41").trim();

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
 * Extracts GEO and device context from request headers.
 * Supports Vercel (x-vercel-ip-country), Cloudflare (cf-ipcountry), AWS (cloudfront-viewer-country).
 * Device: sec-ch-ua-mobile or User-Agent.
 * @param headers - Next.js headers() result (Headers or Promise<Headers>)
 * @returns Context for smart affiliate selection
 */
export function getAffiliateContextFromHeaders(
  headers: Headers
): AffiliateContext {
  let country = "";
  const tryHeader = (name: string) => {
    const v = headers.get(name);
    if (v && v.length === 2) country = v.toUpperCase();
  };
  tryHeader("x-vercel-ip-country");
  if (!country) tryHeader("cf-ipcountry");
  if (!country) tryHeader("cloudfront-viewer-country");

  const ua = headers.get("user-agent")?.toLowerCase() ?? "";
  const secMobile = headers.get("sec-ch-ua-mobile");
  const isMobile =
    secMobile === "?1" ||
    /mobile|android|iphone|ipad|webos|blackberry|iemobile/i.test(ua);

  return { country: country || undefined, isMobile };
}

/** Available offers for rotation (only includes configured URLs). */
function getAvailableOffers(): { type: AffiliateOfferType; url: string }[] {
  const offers: { type: AffiliateOfferType; url: string }[] = [
    { type: "chaturbate", url: AFFILIATE_BASE_URL },
  ];
  if (AFFILIATE_DATING_URL) offers.push({ type: "dating", url: AFFILIATE_DATING_URL });
  if (AFFILIATE_WEBCAM_URL) offers.push({ type: "webcam", url: AFFILIATE_WEBCAM_URL });
  if (BRAZZERS_AFFILIATE_URL) offers.push({ type: "webcam", url: BRAZZERS_AFFILIATE_URL });
  return offers;
}

/**
 * Deterministic hash for rotation (same inputs → same output).
 */
function hashRotation(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Smart affiliate URL: rotates offers by GEO, device, and slug.
 * Uses context for GEO-specific and mobile vs desktop targeting.
 * @param slug - Video or page slug for tracking
 * @param context - From getAffiliateContextFromHeaders, or omit for default
 * @returns { url, offerType } for tracking
 */
export function getSmartAffiliateUrl(
  slug: string,
  context?: AffiliateContext
): { url: string; offerType: AffiliateOfferType } {
  const offers = getAvailableOffers();
  if (offers.length === 0 || (offers.length === 1 && offers[0].type === "chaturbate")) {
    const url = buildUrlWithParams(offers[0]?.url ?? AFFILIATE_BASE_URL, slug);
    return { url, offerType: "chaturbate" };
  }

  const country = context?.country ?? "XX";
  const device = context?.isMobile ? "m" : "d";
  const seed = `${country}|${device}|${slug}`;
  const idx = hashRotation(seed) % offers.length;
  const offer = offers[idx];
  const url = buildUrlWithParams(offer.url, slug);
  return { url, offerType: offer.type };
}

function buildUrlWithParams(baseUrl: string, slug: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set(AFFILIATE_SUBID_PARAM, slug);
  if (AFFILIATE_CAMPAIGN) url.searchParams.set("campaign", AFFILIATE_CAMPAIGN);
  if (AFFILIATE_SOURCE) url.searchParams.set("source", AFFILIATE_SOURCE);
  if (AFFILIATE_MEDIUM) url.searchParams.set("medium", AFFILIATE_MEDIUM);
  return url.toString();
}

/**
 * Builds the outbound affiliate URL for a video. Uses smart rotation when context provided.
 * When Brazzers URL is set, rotates 50/50 with Chaturbate (legacy). Otherwise uses base or smart logic.
 * @param slug - Video slug (e.g. from route or video.slug)
 * @param context - Optional from getAffiliateContextFromHeaders
 * @returns Full affiliate URL with subid and any optional params
 */
export function getAffiliateUrl(slug: string, context?: AffiliateContext): string {
  return getAffiliateUrlWithOffer(slug, context).url;
}

/**
 * Returns affiliate URL and offer type for conversion tracking.
 * Use this in server components with headers() → getAffiliateContextFromHeaders.
 * @param slug - Video or page slug
 * @param context - Optional from getAffiliateContextFromHeaders(headers)
 * @returns { url, offerType } for TrackedAffiliateLink
 */
export function getAffiliateUrlWithOffer(
  slug: string,
  context?: AffiliateContext
): { url: string; offerType: AffiliateOfferType } {
  if (context && (AFFILIATE_DATING_URL || AFFILIATE_WEBCAM_URL || BRAZZERS_AFFILIATE_URL)) {
    return getSmartAffiliateUrl(slug, context);
  }
  if (!BRAZZERS_AFFILIATE_URL) {
    return {
      url: buildUrlWithParams(AFFILIATE_BASE_URL, slug),
      offerType: "chaturbate",
    };
  }
  const hash = slug.split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  const useBrazzers = Math.abs(hash) % 2 === 1;
  return {
    url: buildUrlWithParams(useBrazzers ? BRAZZERS_AFFILIATE_URL : AFFILIATE_BASE_URL, slug),
    offerType: "webcam",
  };
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

/**
 * Builds a Lovense store affiliate URL with optional subid for tracking.
 * @param baseUrl - Lovense referral link (e.g. https://www.lovense.com/r/g5oi41)
 * @param slug - Video/page slug for tracking (optional)
 * @returns Full Lovense URL with subid if slug provided
 */
export function getLovenseUrl(baseUrl: string, slug: string): string {
  const url = new URL(baseUrl);
  if (slug) url.searchParams.set(AFFILIATE_SUBID_PARAM, slug);
  return url.toString();
}