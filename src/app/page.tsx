import Link from "next/link";
import type { Metadata } from "next";
import { getVideosPage } from "@/lib/data";
import InfiniteVideoGrid from "@/components/InfiniteVideoGrid";
import AdultForceAd from "@/components/AdultForceAd";
import { ADULTFORCE_950 } from "@/lib/adultforce";
import { getBaseUrl } from "@/lib/site";

const VIDEOS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "Home",
  description: "Browse featured and popular streaming videos. StreamHub adult affiliate streaming.",
  alternates: { canonical: getBaseUrl() },
};

export default async function HomePage() {
  const { videos, hasMore } = getVideosPage(1, VIDEOS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top header banner (950×250) - homepage only */}
      <section aria-label="Featured advertisement" className="mb-8">
        <AdultForceAd
          src={ADULTFORCE_950}
          width={950}
          height={250}
          title="Homepage banner advertisement"
          responsive
        />
      </section>

      <section aria-labelledby="featured-heading">
        <h1 id="featured-heading" className="text-3xl font-bold text-white sm:text-4xl">
          Featured Videos
        </h1>
        <p className="mt-2 text-zinc-400">
          Browse thousands of videos. All content is provided by third-party partners.
        </p>
      </section>

      <section
        className="mt-12"
        aria-labelledby="video-grid-heading"
        aria-label="Video grid"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="video-grid-heading" className="text-xl font-semibold text-white">
            Trending
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-accent hover:text-accentHover transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded"
          >
            View all categories →
          </Link>
        </div>
        <InfiniteVideoGrid
          initialVideos={videos}
          initialPage={1}
          initialHasMore={hasMore}
        />
      </section>
    </div>
  );
}
