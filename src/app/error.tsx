"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4">
      <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
      <p className="mt-2 text-center text-sm text-zinc-400">
        An error occurred. You can try again or return home.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-surfaceElevated px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/10"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentHover"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
