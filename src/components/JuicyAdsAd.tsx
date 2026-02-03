"use client";

import Script from "next/script";
import { useEffect } from "react";

const AD_ZONE_ID = 1110448;

export default function JuicyAdsAd() {
  useEffect(() => {
    (window as unknown as { adsbyjuicy?: unknown[] }).adsbyjuicy =
      (window as unknown as { adsbyjuicy?: unknown[] }).adsbyjuicy || [];
    (window as unknown as { adsbyjuicy: unknown[] }).adsbyjuicy.push({
      adzone: AD_ZONE_ID,
    });
  }, []);

  return (
    <>
      <Script
        src="https://poweredby.jads.co/js/jads.js"
        strategy="lazyOnload"
        data-cfasync="false"
      />
      <ins
        id={String(AD_ZONE_ID)}
        data-width="125"
        data-height="125"
        className="block"
      />
    </>
  );
}
