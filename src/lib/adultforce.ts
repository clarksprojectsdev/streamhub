/**
 * AdultForce ad slot URLs. Override in .env.local if you have different slot IDs.
 * @see https://adultforce.com
 */

const DEFAULT = {
  PREROLL: "https://a.adtng.com/get/10016607",
  BANNER_950: "https://a.adtng.com/get/10016608",
  BOX_300: "https://a.adtng.com/get/10016609",
  BANNER_728: "https://a.adtng.com/get/10016610",
};

function slot(envKey: string, fallback: string): string {
  const v = process.env[envKey]?.trim();
  return v || fallback;
}

/** Pre-roll: before each video (1920×1080) */
export const ADULTFORCE_PREROLL = slot("NEXT_PUBLIC_ADULTFORCE_PREROLL", DEFAULT.PREROLL);

/** Top banner: homepage header (950×250) */
export const ADULTFORCE_950 = slot("NEXT_PUBLIC_ADULTFORCE_BANNER_950", DEFAULT.BANNER_950);

/** NTVA: sidebar next to video (300×250) */
export const ADULTFORCE_300 = slot("NEXT_PUBLIC_ADULTFORCE_BOX_300", DEFAULT.BOX_300);

/** Below video banner (728×90) */
export const ADULTFORCE_728 = slot("NEXT_PUBLIC_ADULTFORCE_BANNER_728", DEFAULT.BANNER_728);
