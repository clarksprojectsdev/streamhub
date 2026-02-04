import Link from "next/link";
import Image from "next/image";
import type { VideoItem } from "@/lib/data";

function isValidImageUrl(s: string | undefined): boolean {
  return Boolean(s && (s.startsWith("http://") || s.startsWith("https://")));
}

const PLACEHOLDER_THUMB = "https://picsum.photos/640/360?random=placeholder";

interface VideoCardProps {
  video: VideoItem;
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbSrc = isValidImageUrl(video.thumbnail) ? video.thumbnail : PLACEHOLDER_THUMB;
  return (
    <Link
      href={`/video/${video.slug}`}
      className="group block rounded-lg overflow-hidden bg-surfaceElevated ring-1 ring-white/5 transition-all duration-200 hover:scale-[1.02] hover:ring-white/10 hover:shadow-lg hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
      aria-label={`Watch ${video.title}, ${video.views} views, ${video.duration}`}
    >
      <article>
        <div className="relative aspect-video bg-zinc-800">
          <Image
            src={thumbSrc}
            alt=""
            fill
            className="object-cover transition duration-200 group-hover:brightness-110 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
            {video.duration}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-white line-clamp-2 group-hover:text-accent transition-colors">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            {video.views} views · {video.duration} · {video.category}
          </p>
        </div>
      </article>
    </Link>
  );
}
