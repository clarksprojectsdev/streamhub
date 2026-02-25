import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPostBySlug,
  splitContentAfterParagraphs,
  getPostKeywords,
  BLOG_OG_IMAGE_DEFAULT,
} from "@/lib/blog";
import { getRelatedVideos } from "@/lib/data";
import { getBaseUrl } from "@/lib/site";
import {
  getAffiliateUrlWithOffer,
  getAffiliateContextFromHeaders,
  AFFILIATE_LINK_REL,
} from "@/lib/affiliate";
import VideoCard from "@/components/VideoCard";
import TrackedAffiliateLink from "@/components/TrackedAffiliateLink";
import ShareButtons from "@/components/ShareButtons";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function isValidImageUrl(s: string | undefined): boolean {
  return Boolean(s && (s.startsWith("http://") || s.startsWith("https://")));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post" };

  const base = getBaseUrl();
  const canonicalUrl = `${base}/blog/${slug}`;

  let ogImage: { url: string; width: number; height: number; alt: string };
  if (isValidImageUrl(post.image)) {
    ogImage = { url: post.image!, width: 1200, height: 630, alt: post.title };
  } else {
    const first = getRelatedVideos(slug, 1)[0];
    const thumb = isValidImageUrl(first?.thumbnail) ? first!.thumbnail! : `${base}${BLOG_OG_IMAGE_DEFAULT}`;
    ogImage = { url: thumb, width: 640, height: 360, alt: post.title };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: getPostKeywords(post),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: canonicalUrl,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/blog");
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headersList = await headers();
  const affiliateContext = getAffiliateContextFromHeaders(headersList);
  const relatedVideos = getRelatedVideos(slug, 6);
  const ctaVideoSlug = relatedVideos[0]?.slug;
  const affiliateResult = ctaVideoSlug
    ? getAffiliateUrlWithOffer(ctaVideoSlug, affiliateContext)
    : null;
  const { before, after } = splitContentAfterParagraphs(post.content, 3);

  const base = getBaseUrl();
  const postUrl = `${base}/blog/${slug}`;
  const ogImage =
    isValidImageUrl(post.image) ? post.image!
    : isValidImageUrl(relatedVideos[0]?.thumbnail) ? relatedVideos[0]!.thumbnail
    : `${base}${BLOG_OG_IMAGE_DEFAULT}`;

  const articleSchema = {
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: ogImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "StreamHub" },
    publisher: { "@type": "Organization", name: "StreamHub", logo: { "@type": "ImageObject", url: `${base}/streamhub.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-8 text-sm text-zinc-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-white transition-colors">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{post.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {post.title}
          </h1>
          <time
            dateTime={post.publishedAt}
            className="mt-2 block text-sm text-zinc-500"
          >
            {formatDate(post.publishedAt)}
          </time>
          <div className="mt-4">
            <ShareButtons
              url={`${base}/blog/${slug}`}
              title={post.title}
              contentType="blog"
              contentId={slug}
            />
          </div>
        </header>

        <div className="blog-content space-y-4 text-zinc-300 [&_a]:text-accent [&_a]:underline [&_a:hover]:text-accentHover [&_p]:leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: before }} />
          {affiliateResult && ctaVideoSlug && (
            <div className="my-6 flex flex-col items-center sm:items-start">
              <TrackedAffiliateLink
                href={affiliateResult.url}
                videoSlug={ctaVideoSlug}
                rel={AFFILIATE_LINK_REL}
                offerType={affiliateResult.offerType}
                trackingExtras={{
                  country: affiliateContext.country,
                  isMobile: affiliateContext.isMobile,
                }}
                className="inline-flex w-full min-w-0 justify-center rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface sm:w-auto"
              >
                Watch the full video on partner site
              </TrackedAffiliateLink>
            </div>
          )}
          {after ? <div dangerouslySetInnerHTML={{ __html: after }} /> : null}
        </div>
      </article>

      <section
        className="mt-12 border-t border-white/10 pt-8"
        aria-labelledby="related-videos-heading"
      >
        <h2 id="related-videos-heading" className="text-xl font-semibold text-white mb-6">
          Related Videos
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {relatedVideos.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-accent hover:text-accentHover transition-colors"
        >
          ← Back to Blog
        </Link>
      </footer>
    </div>
  );
}
