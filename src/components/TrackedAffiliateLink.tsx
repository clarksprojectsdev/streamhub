"use client";

import { trackCtaClick, trackAffiliateClick } from "@/lib/analytics";

interface TrackedAffiliateLinkProps {
  href: string;
  videoSlug: string;
  rel: string;
  className?: string;
  children: React.ReactNode;
  /** Offer type for conversion tracking (chaturbate, dating, webcam) */
  offerType?: string;
  /** GEO/device context for analytics */
  trackingExtras?: { country?: string; isMobile?: boolean };
}

export default function TrackedAffiliateLink({
  href,
  videoSlug,
  rel,
  className,
  children,
  offerType,
  trackingExtras,
}: TrackedAffiliateLinkProps) {
  const handleClick = () => {
    if (offerType) {
      trackAffiliateClick(videoSlug, offerType, trackingExtras);
    } else {
      trackCtaClick(videoSlug);
    }
  };
  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
