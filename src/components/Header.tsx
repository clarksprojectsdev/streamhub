import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity" aria-label="StreamHub home">
          <Image src="/streamhub.png" alt="StreamHub" width={140} height={36} className="h-9 w-auto object-contain rounded-[8px]" priority />
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
