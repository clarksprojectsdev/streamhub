"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "age_verified";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true";
    setVerified(!!stored);
    setHasChecked(true);
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setVerified(true);
    router.push("/");
  };

  if (!hasChecked) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface" aria-hidden="true" />
    );
  }

  if (verified) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface px-6 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-description"
    >
      <div className="mx-auto max-w-md text-center">
        <h1 id="age-gate-title" className="text-2xl font-bold text-white sm:text-3xl">
          18+ Only
        </h1>
        <p id="age-gate-description" className="mt-4 text-zinc-300">
          This website contains adult content intended for viewers who are 18 years of age or older.
          By entering, you confirm that you are of legal age in your jurisdiction and agree to view
          adult material.
        </p>
        <p className="mt-2 text-sm text-muted">
          You must be 18 or older to access this site. If you are not of legal age, please leave now.
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="mt-8 w-full rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface sm:w-auto sm:min-w-[240px]"
        >
          I am 18+ and agree
        </button>
      </div>
    </div>
  );
}
