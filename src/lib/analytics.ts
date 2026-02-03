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

const GA_ID = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID : undefined;

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
