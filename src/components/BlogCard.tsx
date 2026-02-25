import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-lg overflow-hidden bg-surfaceElevated ring-1 ring-white/5 transition-all duration-200 hover:scale-[1.02] hover:ring-white/10 hover:shadow-lg hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
      aria-label={`Read ${post.title}`}
    >
      <article className="p-5">
        <time
          dateTime={post.publishedAt}
          className="text-xs text-zinc-500"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h2 className="mt-2 font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
          {post.description}
        </p>
      </article>
    </Link>
  );
}
