import Link from "next/link";
import type { CategoryItem } from "@/lib/data";

interface CategorySuggestionProps {
  category: CategoryItem;
}

/** Compact category link for sidebar – no large thumbnail. */
export default function CategorySuggestion({ category }: CategorySuggestionProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="flex items-center gap-3 rounded-lg border border-white/10 bg-surfaceElevated px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-accent/50 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
    >
      <img
        src={category.thumbnail}
        alt=""
        width={48}
        height={27}
        loading="lazy"
        className="shrink-0 rounded object-cover"
      />
      <span className="min-w-0 truncate">{category.name}</span>
      <span className="shrink-0 text-xs text-zinc-500">{category.videoCount}</span>
    </Link>
  );
}
