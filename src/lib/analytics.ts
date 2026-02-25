/**
 * Basic analytics helpers. Use with a provider (e.g. Google Analytics) via
 * NEXT_PUBLIC_GA_MEASUREMENT_ID. Respects Privacy Policy (analytics disclosed).
 * No-op when no provider is configured.
 */

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  if (window.gtag && GA_ID) {
    window.gtag("config", GA_ID, { page_path: path });
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (window.gtag && GA_ID) {
    window.gtag("event", eventName, params);
  }
}

export function trackCtaClick(videoSlug: string): void {
  trackEvent("watch_full_video", { video_slug: videoSlug });
}

/** Tracks affiliate click with offer type and GEO/device for conversion analysis. */
export function trackAffiliateClick(
  videoSlug: string,
  offerType: string,
  extras?: { country?: string; isMobile?: boolean }
): void {
  const params: Record<string, string | boolean> = {
    video_slug: videoSlug,
    affiliate_offer: offerType,
  };
  if (extras?.country) params.affiliate_country = extras.country;
  if (extras?.isMobile !== undefined)
    params.affiliate_device = extras.isMobile ? "mobile" : "desktop";
  trackEvent("affiliate_click", params);
}

export function trackShareClick(
  platform: string,
  contentType: string,
  contentId: string
): void {
  trackEvent("share_click", {
    share_platform: platform,
    content_type: contentType,
    content_id: contentId,
  });
}
