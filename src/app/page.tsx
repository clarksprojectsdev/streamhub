import Link from "next/link";
import type { Metadata } from "next";
import { featuredVideos } from "@/lib/data";
import VideoCard from "@/components/VideoCard";
import { getBaseUrl } from "@/lib/site";

const VIDEOS_PER_PAGE = 12;

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params?.page ?? "1", 10) || 1);
  const base = getBaseUrl();
  const canonical = page <= 1 ? base : `${base}/?page=${page}`;
  return {
    title: "Home",
    description: "Browse featured and popular streaming videos. Placeholder adult affiliate site.",
    alternates: { canonical },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const pageParam = params?.page;
  const currentPage = Math.max(
    1,
    Math.min(
      Number.parseInt(pageParam ?? "1", 10) || 1,
      Math.ceil(featuredVideos.length / VIDEOS_PER_PAGE) || 1
    )
  );
  const totalPages = Math.ceil(featuredVideos.length / VIDEOS_PER_PAGE) || 1;
  const start = (currentPage - 1) * VIDEOS_PER_PAGE;
  const paginatedVideos = featuredVideos.slice(start, start + VIDEOS_PER_PAGE);

  const prevHref = currentPage > 1 ? (currentPage === 2 ? "/" : `/?page=${currentPage - 1}`) : null;
  const nextHref = currentPage < totalPages ? `/?page=${currentPage + 1}` : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section aria-labelledby="featured-heading">
        <h1 id="featured-heading" className="text-3xl font-bold text-white sm:text-4xl">
          Featured Videos
        </h1>
        <p className="mt-2 text-zinc-400">
          Hand-picked placeholder content. No real adult material.
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
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {paginatedVideos.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <nav
            className="mt-8 flex items-center justify-center gap-4"
            aria-label="Pagination"
          >
            {prevHref ? (
              <Link
                href={prevHref}
                className="rounded-lg border border-white/10 bg-surfaceElevated px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
              >
                Previous
              </Link>
            ) : (
              <span
                className="cursor-not-allowed rounded-lg border border-white/10 bg-surfaceElevated px-4 py-2 text-sm font-medium text-zinc-500"
                aria-disabled="true"
              >
                Previous
              </span>
            )}
            <span className="text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            {nextHref ? (
              <Link
                href={nextHref}
                className="rounded-lg border border-white/10 bg-surfaceElevated px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
              >
                Next
              </Link>
            ) : (
              <span
                className="cursor-not-allowed rounded-lg border border-white/10 bg-surfaceElevated px-4 py-2 text-sm font-medium text-zinc-500"
                aria-disabled="true"
              >
                Next
              </span>
            )}
          </nav>
        )}
      </section>
    </div>
  );
}
