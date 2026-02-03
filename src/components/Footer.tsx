import Link from "next/link";

const SITE_NAME = "Site Name Placeholder";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/10 bg-surfaceElevated"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 18+ Warning */}
        <p className="text-center text-sm font-medium text-zinc-300 sm:text-left">
          <span className="text-accent" aria-hidden="true">18+</span>
          {" "}
          This site is intended for adults only. You must be 18 years of age or older (or the age of majority in your jurisdiction) to access this website.
        </p>

        {/* Affiliate disclaimer */}
        <p className="mt-4 text-center text-xs text-zinc-500 sm:text-left">
          This website does not host or produce content. All videos and media are provided by third-party affiliate partners. We link to external sources only.
        </p>

        {/* Main footer row: site link + legal nav */}
        <div className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-white hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
          >
            {SITE_NAME}
          </Link>
          <nav aria-label="Legal and site links">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/dmca"
                  className="text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
                >
                  DMCA
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/2257"
                  className="text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surfaceElevated rounded"
                >
                  2257 Compliance Statement
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-sm text-zinc-500 sm:text-left">
          © {currentYear} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
