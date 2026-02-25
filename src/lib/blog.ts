import path from "path";
import fs from "fs";
import { getCategories, getRelatedVideos } from "@/lib/data";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  content: string;
  image?: string;
}

let postsCache: BlogPost[] | null = null;

function loadPosts(): BlogPost[] {
  if (postsCache) return postsCache;
  try {
    const p = path.join(process.cwd(), "src/data/blog.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      const arr = Array.isArray(parsed) ? parsed : [];
      postsCache = arr as BlogPost[];
      return postsCache;
    }
  } catch {
    // fallback empty
  }
  postsCache = [];
  return postsCache;
}

/**
 * Splits HTML content after the nth paragraph. Returns { before, after }.
 * Use before/after to inject content (e.g. CTA) between them.
 */
export function splitContentAfterParagraphs(
  content: string,
  paragraphCount: number
): { before: string; after: string } {
  const paraRegex = /<p(?:\s[^>]*)?>[\s\S]*?<\/p\s*>/gi;
  let match: RegExpExecArray | null;
  let count = 0;
  let endIndex = 0;
  while ((match = paraRegex.exec(content)) !== null) {
    count += 1;
    if (count === paragraphCount) {
      endIndex = match.index + match[0].length;
      break;
    }
  }
  if (count >= paragraphCount) {
    return {
      before: content.slice(0, endIndex),
      after: content.slice(endIndex),
    };
  }
  return { before: content, after: "" };
}

/**
 * Derives related keywords for SEO from post title, slug, and description.
 * Used in metadata keywords.
 */
export function getPostKeywords(post: BlogPost): string[] {
  const base = ["streaming", "adult", "videos", "blog", "StreamHub"];
  const fromTitle = post.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const fromSlug = post.slug
    .split("-")
    .filter((w) => w.length > 2);
  const fromDesc = post.description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const w of [...fromTitle, ...fromSlug, ...fromDesc, ...base]) {
    const key = w.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }
  return result.slice(0, 15);
}

/** Default OG image for blog posts when none specified. */
export const BLOG_OG_IMAGE_DEFAULT = "/streamhub.png";

/** All posts sorted by date (newest first) */
export function getAllPosts(): BlogPost[] {
  return [...loadPosts()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

const LINK_CLASS = "text-accent hover:text-accentHover underline";

/** Seeded PRNG for deterministic "random" link placement (SSG-friendly). */
function createSeededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return () => {
    h = (h * 1103515245 + 12345) | 0;
    return (h >>> 0) / 0xffffffff;
  };
}

/** Keywords that may be linked to videos, categories, or homepage. */
const KEYWORD_CONFIG: { word: string; targets: ("video" | "category" | "home")[] }[] = [
  { word: "videos", targets: ["video", "category", "home"] },
  { word: "video", targets: ["video", "category"] },
  { word: "content", targets: ["video", "category"] },
  { word: "streaming", targets: ["video", "home"] },
  { word: "categories", targets: ["category"] },
  { word: "category", targets: ["category"] },
  { word: "genre", targets: ["category"] },
  { word: "genres", targets: ["category"] },
  { word: "amateur", targets: ["video", "category"] },
  { word: "homepage", targets: ["home"] },
  { word: "home", targets: ["home"] },
  { word: "featured", targets: ["home", "video"] },
  { word: "picks", targets: ["video"] },
  { word: "couples", targets: ["video", "category"] },
];

const MAX_INJECTIONS = 6;

/**
 * Injects internal links into blog HTML content by randomly linking keywords to
 * video pages, category pages, or the homepage. Skips text already inside anchor tags.
 * Preserves existing HTML structure.
 */
export function injectInternalLinks(content: string, seed: string): string {
  const rand = createSeededRandom(seed);
  const videoSlugs = getRelatedVideos(seed, 12).map((v) => v.slug);
  const categorySlugs = getCategories().map((c) => c.slug);
  if (videoSlugs.length === 0 && categorySlugs.length === 0) return content;

  const targets = {
    video: () => `/video/${videoSlugs[Math.floor(rand() * videoSlugs.length)]}`,
    category: () => `/category/${categorySlugs[Math.floor(rand() * categorySlugs.length)]}`,
    home: () => "/",
  };

  const linkBlockRegex = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkBlockRegex.exec(content)) !== null) {
    parts.push(content.slice(lastIndex, match.index));
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }
  parts.push(content.slice(lastIndex));

  const injectIntoText = (text: string): string => {
    if (!text || text.trim().length < 10) return text;
    const candidates: { start: number; end: number; word: string; allowedTargets: ("video" | "category" | "home")[] }[] = [];

    for (const { word, targets: allowedTargets } of KEYWORD_CONFIG) {
      const t = allowedTargets.filter((tt) => {
        if (tt === "video" && videoSlugs.length === 0) return false;
        if (tt === "category" && categorySlugs.length === 0) return false;
        return true;
      });
      if (t.length === 0) continue;

      const regex = new RegExp(`\\b(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");
      let m: RegExpExecArray | null;
      while ((m = regex.exec(text)) !== null) {
        candidates.push({ start: m.index, end: m.index + m[1].length, word: m[1], allowedTargets: t });
      }
    }

    const selected = candidates
      .map((c) => ({ ...c, roll: rand() }))
      .filter((c) => c.roll < 0.4)
      .sort((a, b) => b.start - a.start);

    const toInject: typeof candidates = [];
    let minEnd = text.length + 1;
    for (const c of selected) {
      if (toInject.length >= MAX_INJECTIONS) break;
      if (c.end <= minEnd) {
        toInject.push(c);
        minEnd = c.start;
      }
    }

    let result = text;
    for (const { start, end, word, allowedTargets } of toInject) {
      const targetType = allowedTargets[Math.floor(rand() * allowedTargets.length)];
      const href = targets[targetType]();
      const link = `<a href="${href}" class="${LINK_CLASS}">${word}</a>`;
      result = result.slice(0, start) + link + result.slice(end);
    }
    return result;
  };

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) parts[i] = injectIntoText(parts[i]);
  }

  return parts.join("");
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = loadPosts().find((p) => p.slug === slug);
  if (!post) return undefined;
  return {
    ...post,
    content: injectInternalLinks(post.content, slug),
  };
}

export function searchPosts(q: string): BlogPost[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return getAllPosts();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.content.toLowerCase().includes(lower)
  );
}

const POSTS_PER_PAGE = 9;

export function getPaginatedPosts(
  searchQuery: string,
  page: number
): { posts: BlogPost[]; totalPages: number; totalCount: number } {
  const filtered = searchQuery.trim()
    ? searchPosts(searchQuery)
    : getAllPosts();
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const posts = filtered.slice(start, start + POSTS_PER_PAGE);
  return { posts, totalPages, totalCount };
}
