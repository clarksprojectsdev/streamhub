import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getFeaturedVideos, getCategories } from "@/lib/data";

const VIDEOS_PER_PAGE = 12;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const featuredVideos = getFeaturedVideos();
  const categories = getCategories();
  const totalPages = Math.ceil(featuredVideos.length / VIDEOS_PER_PAGE) || 1;

  const urls: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  for (let p = 2; p <= totalPages; p++) {
    urls.push({
      url: `${base}/?page=${p}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

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
