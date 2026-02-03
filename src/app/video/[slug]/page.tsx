import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug, featuredVideos } from "@/lib/data";
import { getAffiliateUrl, AFFILIATE_LINK_REL } from "@/lib/affiliate";
import { getBaseUrl } from "@/lib/site";
import VideoCard from "@/components/VideoCard";
import TrackedAffiliateLink from "@/components/TrackedAffiliateLink";

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return { title: "Video" };
  const base = getBaseUrl();
  return {
    title: video.title,
    description: video.description,
    alternates: { canonical: `${base}/video/${slug}` },
    openGraph: {
      title: video.title,
      description: video.description,
      images: [{ url: video.thumbnail, width: 640, height: 360, alt: video.title }],
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const relatedVideos = featuredVideos.filter((v) => v.id !== video.id).slice(0, 6);
  const affiliateUrl = getAffiliateUrl(video.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-zinc-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-white transition-colors">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{video.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2">
          {/* Responsive iframe embed */}
          <div className="relative w-full overflow-hidden rounded-lg bg-black shadow-xl ring-1 ring-white/10">
            <div className="relative aspect-video">
              <iframe
                title={`Watch ${video.title}`}
                src={video.embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {video.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {video.views} views · {video.duration} · {video.category}
            </p>

            <p className="mt-4 text-zinc-300 leading-relaxed">
              {video.description}
            </p>

            <TrackedAffiliateLink
              href={affiliateUrl}
              videoSlug={video.slug}
              rel={AFFILIATE_LINK_REL}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            >
              Watch Full Video
            </TrackedAffiliateLink>
          </div>
        </article>

        <aside>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Related Videos
          </h2>
          <div className="space-y-4">
            {relatedVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
