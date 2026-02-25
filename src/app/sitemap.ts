import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getFeaturedVideos, getCategories } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const featuredVideos = getFeaturedVideos();
  const categories = getCategories();

  const urls: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  getAllPosts().forEach((post) => {
    urls.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  });

  categories.forEach((cat) => {
    urls.push({
      url: `${base}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  featuredVideos.forEach((video) => {
    urls.push({
      url: `${base}/video/${video.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  ["dmca", "2257", "privacy", "terms"].forEach((path) => {
    urls.push({
      url: `${base}/legal/${path}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    });
  });

  return urls;
}
