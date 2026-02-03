"use client";

import { useState, useRef, useEffect } from "react";
import { featuredVideos } from "@/lib/data";
import VideoCard from "@/components/VideoCard";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? featuredVideos.filter((v) =>
        v.title.toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md mx-4">
      <label htmlFor="header-search" className="sr-only">
        Search videos by title
      </label>
      <input
        id="header-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search videos..."
        className="w-full rounded-lg border border-white/10 bg-surfaceElevated px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        aria-expanded={showDropdown}
        aria-controls="search-results"
        aria-autocomplete="list"
      />
      {showDropdown && (
        <div
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-lg border border-white/10 bg-surfaceElevated shadow-xl ring-1 ring-black/20"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">
              No results found
            </p>
          ) : (
            <ul className="grid gap-2 p-2 sm:grid-cols-2" role="list">
              {filtered.map((video) => (
                <li key={video.id} role="option">
                  <VideoCard video={video} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
