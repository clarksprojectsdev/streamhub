import type { Metadata } from "next";
import { categories } from "@/lib/data";
import { getBaseUrl } from "@/lib/site";
import CategoryCard from "@/components/CategoryCard";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse streaming content by category. Placeholder adult affiliate site.",
  alternates: { canonical: `${getBaseUrl()}/categories` },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Categories
        </h1>
        <p className="mt-2 text-muted">
          Explore content by category. All thumbnails and titles are placeholders.
        </p>
      </section>

      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
}
