"use client";

import { trackShareClick } from "@/lib/analytics";

interface ShareButtonsProps {
  url: string;
  title: string;
  contentType: "video" | "blog";
  contentId: string;
}

function buildRedditUrl(url: string, title: string): string {
  const params = new URLSearchParams({ url, title });
  return `https://www.reddit.com/submit?${params.toString()}`;
}

function buildTwitterUrl(url: string, text: string): string {
  const truncated = text.length > 200 ? `${text.slice(0, 197)}...` : text;
  const params = new URLSearchParams({ url, text: truncated });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export default function ShareButtons({
  url,
  title,
  contentType,
  contentId,
}: ShareButtonsProps) {
  const handleShare = (platform: "reddit" | "twitter", shareUrl: string) => {
    trackShareClick(platform, contentType, contentId);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const redditUrl = buildRedditUrl(url, title);
  const twitterUrl = buildTwitterUrl(url, title);

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Share on social media"
    >
      <button
        type="button"
        onClick={() => handleShare("reddit", redditUrl)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#FF4500]/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#FF4500]/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface sm:px-4"
        aria-label="Share on Reddit"
      >
        <RedditIcon className="h-5 w-5" />
        <span>Reddit</span>
      </button>
      <button
        type="button"
        onClick={() => handleShare("twitter", twitterUrl)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#1DA1F2]/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1DA1F2]/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface sm:px-4"
        aria-label="Share on X (Twitter)"
      >
        <XIcon className="h-5 w-5" />
        <span>X</span>
      </button>
    </div>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .816-.532 1.504-1.271 1.696C16.571 14.41 14.526 15 12 15c-2.527 0-4.572-.59-6.244-1.563C5.23 13.246 4.698 12.558 4.698 11.742a1.754 1.754 0 0 1 1.754-1.754c.477 0 .899.182 1.207.49 1.195-.856 2.85-1.418 4.674-1.488l-.8-3.747-2.597.547a1.25 1.25 0 0 1-2.498-.056c0-.687.561-1.248 1.25-1.248.346 0 .657.142.886.389 2.885-.833 6.194-.833 9.079 0 .229-.246.54-.389.887-.389zm-6.01 6.636c-.76 0-1.375.616-1.375 1.375 0 .718.579 1.305 1.297 1.366.028.004.055.004.083.004.76 0 1.375-.616 1.375-1.375a1.384 1.384 0 0 0-.285-.836 1.384 1.384 0 0 0-.801-.523zm4.02 0c-.034 0-.067.002-.101.003-.218-.06-.718-.648-.718-1.369 0-.759.615-1.375 1.375-1.375.76 0 1.375.616 1.375 1.375 0 .724-.51 1.313-.734 1.37-.031-.002-.063-.004-.094-.004zm-2.01 2.041c-2.063 0-3.884 1.012-5.024 2.566-.094.128-.094.298-.094.468 0 1.684 3.417 3.05 7.625 3.05 4.208 0 7.625-1.366 7.625-3.05 0-.17 0-.34-.094-.468-1.14-1.554-2.961-2.566-5.024-2.566h-.014z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
