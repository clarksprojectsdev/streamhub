import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact us for legal, DMCA, or general inquiries.",
  alternates: { canonical: `${getBaseUrl()}/contact` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-400 hover:text-white transition-colors"
      >
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-white">Contact</h1>
      <p className="mt-4 text-zinc-300 leading-relaxed">
        For legal inquiries, DMCA takedown notices, or general questions, you can reach us at:
      </p>
      <p className="mt-4">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-accent hover:text-accentHover transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
      <p className="mt-6 text-sm text-zinc-500">
        We do not host or produce content. For issues related to third-party linked content,
        please contact the respective providers.
      </p>
    </div>
  );
}
