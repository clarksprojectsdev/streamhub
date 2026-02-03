import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-white hover:text-accent transition-colors shrink-0">
          StreamHub
        </Link>
        <SearchBar />
        <nav className="flex items-center gap-6 shrink-0" aria-label="Main navigation">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Categories
          </Link>
        </nav>
      </div>
    </header>
  );
}
