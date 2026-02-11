import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug, getFeaturedVideos } from "@/lib/data";
import {
  getAffiliateUrl,
  getChaturbateUrl,
  getLovenseUrl,
  AFFILIATE_LINK_REL,
  CHATURBATE_LINKS,
  LOVENSE_STORE_URL,
} from "@/lib/affiliate";
import { getBaseUrl } from "@/lib/site";
import VideoCard from "@/components/VideoCard";
import TrackedAffiliateLink from "@/components/TrackedAffiliateLink";
import JuicyAdsAd from "@/components/JuicyAdsAd";
import AdultForceAd from "@/components/AdultForceAd";
import {
  ADULTFORCE_PREROLL,
  ADULTFORCE_300,
  ADULTFORCE_728,
} from "@/lib/adultforce";

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

function isValidImageUrl(s: string | undefined): boolean {
  return Boolean(s && (s.startsWith("http://") || s.startsWith("https://")));
}

export async function generateMetadata({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return { title: "Video" };
  const base = getBaseUrl();
  const ogImage = isValidImageUrl(video.thumbnail)
    ? [{ url: video.thumbnail, width: 640, height: 360, alt: video.title }]
    : undefined;
  return {
    title: video.title,
    description: video.description,
    alternates: { canonical: `${base}/video/${slug}` },
    openGraph: {
      title: video.title,
      description: video.description,
      ...(ogImage && { images: ogImage }),
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const relatedVideos = getFeaturedVideos().filter((v) => v.id !== video.id).slice(0, 6);
  const affiliateUrl = getAffiliateUrl(video.slug);
  const adsterraGateUrl = process.env.NEXT_PUBLIC_ADSTERRA_GATE_URL?.trim() || undefined;

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
        <article className="lg:col-span-2 space-y-4">
          {/* Video embed */}
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

          {/* Below video banner (728×90) */}
          <div className="flex justify-center">
            <AdultForceAd
              src={ADULTFORCE_728}
              width={728}
              height={90}
              title="Below video advertisement"
            />
          </div>

          {adsterraGateUrl && (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center">
              <a
                href={adsterraGateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Sponsored
              </a>
            </div>
          )}

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

            {/* Additional Chaturbate Links */}
            <div className="mt-4 flex flex-wrap gap-3">
              <TrackedAffiliateLink
                href={getChaturbateUrl(CHATURBATE_LINKS.JOIN_PAGE, video.slug)}
                videoSlug={video.slug}
                rel={AFFILIATE_LINK_REL}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Join Live Cams
              </TrackedAffiliateLink>
              <TrackedAffiliateLink
                href={getChaturbateUrl(CHATURBATE_LINKS.HOME_PAGE_FEMALES, video.slug)}
                videoSlug={video.slug}
                rel={AFFILIATE_LINK_REL}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Female Cams
              </TrackedAffiliateLink>
            </div>

            {/* Lovense banner */}
            <TrackedAffiliateLink
              href={getLovenseUrl(LOVENSE_STORE_URL, video.slug)}
              videoSlug={video.slug}
              rel={AFFILIATE_LINK_REL}
              className="mt-4 block"
            >
              <img
                width={1200}
                height={630}
                alt="Lovense"
                src="https://cdn.lovense.com/UploadFiles/web/affiliateMaterials/20260128/bbc8bd9fb2854160bca1e8474b94ffce.jpg"
                className="w-full h-auto max-w-full rounded-lg border-0"
              />
            </TrackedAffiliateLink>

            {/* Shop Lovense button */}
            <div className="mt-3">
              <TrackedAffiliateLink
                href={getLovenseUrl(LOVENSE_STORE_URL, video.slug)}
                videoSlug={video.slug}
                rel={AFFILIATE_LINK_REL}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Shop Lovense
              </TrackedAffiliateLink>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          {/* NTVA: 300×250 next to video */}
          <div className="flex justify-center">
            <AdultForceAd
              src={ADULTFORCE_300}
              width={300}
              height={250}
              title="Sidebar advertisement"
            />
          </div>
          <div className="flex justify-center">
            <JuicyAdsAd />
          </div>
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