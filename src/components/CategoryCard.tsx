import Link from "next/link";
import Image from "next/image";
import type { CategoryItem } from "@/lib/data";

interface CategoryCardProps {
  category: CategoryItem;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block rounded-lg overflow-hidden bg-surfaceElevated transition transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
    >
      <div className="relative aspect-video bg-zinc-800">
        <Image
          src={category.thumbnail}
          alt=""
          fill
          className="object-cover transition group-hover:brightness-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white group-hover:text-accent transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-zinc-300">{category.videoCount} videos</p>
        </div>
      </div>
    </Link>
  );
}
