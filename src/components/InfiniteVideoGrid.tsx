"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { VideoItem } from "@/lib/data";
import VideoCard from "@/components/VideoCard";

const PAGE_SIZE = 12;

interface InfiniteVideoGridProps {
  initialVideos: VideoItem[];
  initialPage?: number;
  initialHasMore?: boolean;
}

export default function InfiniteVideoGrid({
  initialVideos,
  initialPage = 1,
  initialHasMore = true,
}: InfiniteVideoGridProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?page=${page + 1}&limit=${PAGE_SIZE}`);
      const data = (await res.json()) as {
        videos: VideoItem[];
        hasMore: boolean;
        total: number;
      };
      setVideos((prev) => [...prev, ...data.videos]);
      setPage((p) => p + 1);
      setHasMore(data.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {videos.map((video) => (
          <li key={video.id}>
            <VideoCard video={video} />
          </li>
        ))}
      </ul>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="flex min-h-[80px] items-center justify-center"
      >
        {loading && (
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"
            aria-label="Loading more videos"
          />
        )}
      </div>
    </>
  );
}
