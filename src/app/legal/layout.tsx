import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-muted hover:text-white transition-colors"
      >
        ← Back to Home
      </Link>
      <div className="[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_p]:mt-3 [&_p]:text-zinc-300 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:text-zinc-300 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
        {children}
      </div>
    </div>
  );
}
