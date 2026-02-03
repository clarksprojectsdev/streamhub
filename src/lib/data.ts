export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  /** Placeholder embed URL for iframe (preview). */
  embedUrl: string;
  /** External affiliate URL for CTA (watch full video). */
  affiliateUrl: string;
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  thumbnail: string;
  videoCount: string;
}

export const categories: CategoryItem[] = [
  { id: "1", slug: "featured", name: "Featured", thumbnail: "https://picsum.photos/400/225?random=1", videoCount: "120" },
  { id: "2", slug: "popular", name: "Popular", thumbnail: "https://picsum.photos/400/225?random=2", videoCount: "340" },
  { id: "3", slug: "new-releases", name: "New Releases", thumbnail: "https://picsum.photos/400/225?random=3", videoCount: "89" },
  { id: "4", slug: "collections", name: "Collections", thumbnail: "https://picsum.photos/400/225?random=4", videoCount: "56" },
  { id: "5", slug: "premium", name: "Premium", thumbnail: "https://picsum.photos/400/225?random=5", videoCount: "210" },
  { id: "6", slug: "exclusive", name: "Exclusive", thumbnail: "https://picsum.photos/400/225?random=6", videoCount: "45" },
];

const PLACEHOLDER_EMBED = "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0";
const PLACEHOLDER_AFFILIATE = "https://example.com/affiliate";

export const featuredVideos: VideoItem[] = [
  { id: "1", slug: "sample-video-1", title: "Sample Video Title One", description: "Placeholder preview for sample video one. Full-length content available via the watch button. No real adult material.", thumbnail: "https://picsum.photos/640/360?random=10", duration: "12:34", views: "125K", category: "Featured", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/1` },
  { id: "2", slug: "sample-video-2", title: "Sample Video Title Two", description: "Placeholder preview for sample video two. Watch the full video on our partner site. Placeholder only.", thumbnail: "https://picsum.photos/640/360?random=11", duration: "08:21", views: "98K", category: "Popular", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/2` },
  { id: "3", slug: "sample-video-3", title: "Sample Video Title Three", description: "Placeholder preview for sample video three. Click below to view full content externally. No real content.", thumbnail: "https://picsum.photos/640/360?random=12", duration: "15:00", views: "210K", category: "New Releases", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/3` },
  { id: "4", slug: "sample-video-4", title: "Sample Video Title Four", description: "Placeholder preview for sample video four. Full video available via affiliate link. Placeholder only.", thumbnail: "https://picsum.photos/640/360?random=13", duration: "22:45", views: "67K", category: "Premium", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/4` },
  { id: "5", slug: "sample-video-5", title: "Sample Video Title Five", description: "Placeholder preview for sample video five. Watch full video on partner site. No real adult material.", thumbnail: "https://picsum.photos/640/360?random=14", duration: "18:12", views: "156K", category: "Exclusive", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/5` },
  { id: "6", slug: "sample-video-6", title: "Sample Video Title Six", description: "Placeholder preview for sample video six. Full-length content via affiliate link. Placeholder only.", thumbnail: "https://picsum.photos/640/360?random=15", duration: "09:33", views: "89K", category: "Featured", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/6` },
];

export function getVideoBySlug(slug: string): VideoItem | undefined {
  return featuredVideos.find((v) => v.slug === slug);
}

export function getVideosByCategory(categorySlug: string): VideoItem[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return featuredVideos;
  return featuredVideos.filter((v) => v.category.toLowerCase() === cat.name.toLowerCase());
}
