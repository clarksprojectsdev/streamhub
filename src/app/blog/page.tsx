import Link from "next/link";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site";
import { getPaginatedPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "StreamHub blog – updates, curated picks, and streaming tips.",
  openGraph: {
    title: "Blog | StreamHub",
    description: "StreamHub blog – updates, curated picks, and streaming tips.",
    type: "website",
  },
  alternates: {
    canonical: `${getBaseUrl()}/blog`,
  },
};

interface BlogPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q?.trim() ?? "";
  const page = Math.max(
    1,
    Number.parseInt(params?.page ?? "1", 10) || 1
  );

  const { posts, totalPages, totalCount } = getPaginatedPosts(searchQuery, page);

  const qs = searchQuery ? `q=${encodeURIComponent(searchQuery)}&` : "";
  const prevHref = page > 1 ? `/blog?${qs}page=${page - 1}` : null;
  const nextHref = page < totalPages ? `/blog?${qs}page=${page + 1}` : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section aria-labelledby="blog-heading">
        <h1 id="blog-heading" className="text-3xl font-bold text-white sm:text-4xl">
          Blog
        </h1>
        <p className="mt-2 text-zinc-400">
          Updates, curated picks, and streaming tips.
        </p>
      </section>

      <section className="mt-8" aria-label="Search and filters">
        <form action="/blog" method="get" className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search posts..."
              aria-label="Search blog posts"
              className="flex-1 rounded-lg border border-white/10 bg-surfaceElevated px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {searchQuery && (
        <p className="mb-6 text-sm text-zinc-400">
          {totalCount} result{totalCount !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
        </p>
      )}

      <section
        className="mt-6"
        aria-labelledby="posts-heading"
        aria-label="Blog posts"
      >
        {posts.length === 0 ? (
          <p className="py-12 text-center text-zinc-400">
            No posts found. Try a different search or{" "}
            <Link href="/blog" className="text-accent hover:text-accentHover underline">
              view all posts
            </Link>
            .
          </p>
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {posts.map((post) => (
                <li key={post.slug}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex items-center justify-center gap-4"
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
                  Page {page} of {totalPages}
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
          </>
        )}
      </section>
    </div>
  );
}
