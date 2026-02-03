"use client";

import { trackCtaClick } from "@/lib/analytics";

interface TrackedAffiliateLinkProps {
  href: string;
  videoSlug: string;
  rel: string;
  className?: string;
  children: React.ReactNode;
}

export default function TrackedAffiliateLink({
  href,
  videoSlug,
  rel,
  className,
  children,
}: TrackedAffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      onClick={() => trackCtaClick(videoSlug)}
    >
      {children}
    </a>
  );
}
