import path from "path";
import fs from "fs";

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

const STATIC_CATEGORIES: CategoryItem[] = [
  { id: "1", slug: "featured", name: "Featured", thumbnail: "https://picsum.photos/400/225?random=1", videoCount: "120" },
  { id: "2", slug: "popular", name: "Popular", thumbnail: "https://picsum.photos/400/225?random=2", videoCount: "340" },
  { id: "3", slug: "new-releases", name: "New Releases", thumbnail: "https://picsum.photos/400/225?random=3", videoCount: "89" },
  { id: "4", slug: "collections", name: "Collections", thumbnail: "https://picsum.photos/400/225?random=4", videoCount: "56" },
  { id: "5", slug: "premium", name: "Premium", thumbnail: "https://picsum.photos/400/225?random=5", videoCount: "210" },
  { id: "6", slug: "exclusive", name: "Exclusive", thumbnail: "https://picsum.photos/400/225?random=6", videoCount: "45" },
];

const PLACEHOLDER_EMBED = "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0";
const PLACEHOLDER_AFFILIATE = "https://example.com/affiliate";

const PLACEHOLDER_VIDEOS: VideoItem[] = [
  { id: "1", slug: "sample-video-1", title: "Sample Video Title One", description: "Placeholder preview for sample video one. Full-length content available via the watch button. No real adult material.", thumbnail: "https://picsum.photos/640/360?random=10", duration: "12:34", views: "125K", category: "Featured", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/1` },
  { id: "2", slug: "sample-video-2", title: "Sample Video Title Two", description: "Placeholder preview for sample video two. Watch the full video on our partner site. Placeholder only.", thumbnail: "https://picsum.photos/640/360?random=11", duration: "08:21", views: "98K", category: "Popular", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/2` },
  { id: "3", slug: "sample-video-3", title: "Sample Video Title Three", description: "Placeholder preview for sample video three. Click below to view full content externally. No real content.", thumbnail: "https://picsum.photos/640/360?random=12", duration: "15:00", views: "210K", category: "New Releases", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/3` },
  { id: "4", slug: "sample-video-4", title: "Sample Video Title Four", description: "Placeholder preview for sample video four. Full video available via affiliate link. Placeholder only.", thumbnail: "https://picsum.photos/640/360?random=13", duration: "22:45", views: "67K", category: "Premium", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/4` },
  { id: "5", slug: "sample-video-5", title: "Sample Video Title Five", description: "Placeholder preview for sample video five. Watch full video on partner site. No real adult material.", thumbnail: "https://picsum.photos/640/360?random=14", duration: "18:12", views: "156K", category: "Exclusive", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/5` },
  { id: "6", slug: "sample-video-6", title: "Sample Video Title Six", description: "Placeholder preview for sample video six. Full-length content via affiliate link. Placeholder only.", thumbnail: "https://picsum.photos/640/360?random=15", duration: "09:33", views: "89K", category: "Featured", embedUrl: PLACEHOLDER_EMBED, affiliateUrl: `${PLACEHOLDER_AFFILIATE}/6` },
];

/** Cached video list – loaded once from disk to avoid parsing 7MB+ JSON on every request and in IDE. */
let videosCache: VideoItem[] | null = null;

/**
 * Load videos from src/data/videos.json at runtime (server-only). No static import so the 7MB file
 * is not parsed by TypeScript/IDE, which prevents Cursor from hanging.
 */
function loadVideos(): VideoItem[] {
  if (videosCache) return videosCache;
  try {
    const p = path.join(process.cwd(), "src/data/videos.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      const arr = Array.isArray(parsed) ? parsed : [];
      if (arr.length > 0) {
        videosCache = arr as VideoItem[];
        return videosCache;
      }
    }
  } catch {
    // fallback to placeholders
  }
  videosCache = PLACEHOLDER_VIDEOS;
  return videosCache;
}

export function getFeaturedVideos(): VideoItem[] {
  return loadVideos();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    || "uncategorized";
}

function deriveCategoriesFromVideos(videos: VideoItem[]): CategoryItem[] {
  const bySlug = new Map<string, { name: string; count: number; thumb: string }>();
  for (const v of videos) {
    const slug = slugify(v.category);
    const cur = bySlug.get(slug);
    if (!cur) bySlug.set(slug, { name: v.category, count: 1, thumb: v.thumbnail });
    else cur.count += 1;
  }
  return Array.from(bySlug.entries()).map(([slug, { name, count, thumb }], i) => ({
    id: String(i + 1),
    slug,
    name,
    thumbnail: thumb,
    videoCount: String(count),
  }));
}

export function getCategories(): CategoryItem[] {
  const videos = loadVideos();
  return videos.length > 0 ? deriveCategoriesFromVideos(videos) : STATIC_CATEGORIES;
}

export function getVideoBySlug(slug: string): VideoItem | undefined {
  return loadVideos().find((v) => v.slug === slug);
}

export function getVideosByCategory(categorySlug: string): VideoItem[] {
  const videos = loadVideos();
  const cats = getCategories();
  const cat = cats.find((c) => c.slug === categorySlug);
  if (!cat) return videos;
  return videos.filter((v) => slugify(v.category) === categorySlug);
}
