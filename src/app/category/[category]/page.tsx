import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getVideosByCategory } from "@/lib/data";
import { getBaseUrl } from "@/lib/site";
import VideoCard from "@/components/VideoCard";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = categories.find(
    (c) => c.slug === categorySlug
  );
  if (!category) return { title: "Category" };
  const base = getBaseUrl();
  return {
    title: `${category.name} Videos`,
    description: `Browse ${category.name} videos. All content is provided by third-party affiliate partners. Placeholder listings only.`,
    alternates: { canonical: `${base}/category/${categorySlug}` },
    openGraph: {
      title: `${category.name} Videos`,
      description: `Browse ${category.name} videos. Placeholder affiliate content.`,
      images: [{ url: category.thumbnail, width: 400, height: 225, alt: category.name }],
    },
  };
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  const videos = getVideosByCategory(categorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav
        className="mb-6 text-sm text-zinc-400"
        aria-label="Breadcrumb"
      >
        <Link
          href="/"
          className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/categories"
          className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded"
        >
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{category.name}</span>
      </nav>

      <section aria-labelledby="category-heading">
        <h1
          id="category-heading"
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          {category.name} Videos
        </h1>
        <p className="mt-2 text-zinc-400">
          Browse {category.name.toLowerCase()} videos below. This site does not host or produce
          content; all videos are linked from third-party affiliate partners. Placeholder
          listings only.
        </p>
      </section>

      <section
        className="mt-12"
        aria-label="Video grid"
      >
        {videos.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-surfaceElevated px-6 py-12 text-center">
            <p className="text-zinc-400">
              No videos in this category yet. Check back later or browse other categories.
            </p>
            <Link
              href="/categories"
              className="mt-4 inline-block text-sm font-medium text-accent hover:text-accentHover transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded"
            >
              View all categories →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {videos.map((video) => (
              <li key={video.id}>
                <VideoCard video={video} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
