"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { saveLead } from "@/lib/email-capture";

const SESSION_DISMISSED_KEY = "streamhub_popup_dismissed";
const SESSION_SUBMITTED_KEY = "streamhub_popup_submitted";
const DELAY_MS = 30_000;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function EmailCapturePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<"popup_30s" | "exit_intent">("popup_30s");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitIntentFired = useRef(false);
  const submittedThisSession = useRef(false);

  const canShow = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (submittedThisSession.current) return false;
    if (sessionStorage.getItem(SESSION_SUBMITTED_KEY)) return false;
    if (sessionStorage.getItem(SESSION_DISMISSED_KEY)) return false;
    return true;
  }, []);

  const show = useCallback(
    (s: "popup_30s" | "exit_intent") => {
      if (!canShow()) return;
      setSource(s);
      setOpen(true);
    },
    [canShow],
  );

  const hide = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(SESSION_DISMISSED_KEY, "1");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const val = email.trim();
      if (!val) {
        setErrorMsg("Please enter your email");
        return;
      }
      if (!isValidEmail(val)) {
        setErrorMsg("Please enter a valid email");
        return;
      }
      setStatus("loading");
      setErrorMsg("");
      try {
        await saveLead(val, { source, page: pathname ?? undefined });
        submittedThisSession.current = true;
        sessionStorage.setItem(SESSION_SUBMITTED_KEY, "1");
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMsg("Something went wrong. Try again.");
      }
    },
    [email, source, pathname],
  );

  // 30-second timer
  useEffect(() => {
    if (!canShow()) return;
    timerRef.current = setTimeout(() => show("popup_30s"), DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [canShow, show]);

  // Exit intent (desktop: mouse leaves top)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (exitIntentFired.current || !canShow()) return;
      // Mouse moving toward top of viewport (leaving page)
      if (e.clientY <= 10) {
        exitIntentFired.current = true;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        show("exit_intent");
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canShow, show]);

  // Lock body scroll when open (mobile)
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={hide}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-desc"
        className="fixed left-1/2 top-1/2 z-[101] w-[min(90vw,400px)] max-h-[90dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-white/10 bg-surfaceElevated p-6 shadow-xl ring-1 ring-white/5"
      >
        <button
          type="button"
          onClick={hide}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
              <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="popup-title" className="text-xl font-semibold text-white">
              You&apos;re in!
            </h2>
            <p id="popup-desc" className="mt-2 text-sm text-zinc-400">
              We&apos;ll send you exclusive content and updates.
            </p>
          </div>
        ) : (
          <>
            <h2 id="popup-title" className="pr-8 text-xl font-semibold text-white">
              Unlock more content
            </h2>
            <p id="popup-desc" className="mt-2 text-sm text-zinc-400">
              Join thousands getting exclusive videos and early access. One email, no spam.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="popup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="popup-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-60"
                />
              </div>
              {errorMsg && (
                <p className="text-sm text-red-400" role="alert">
                  {errorMsg}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="min-h-[44px] flex-1 rounded-lg bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accentHover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-60 active:scale-[0.98]"
                >
                  {status === "loading" ? "Saving…" : "Unlock"}
                </button>
                <button
                  type="button"
                  onClick={hide}
                  className="min-h-[44px] rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  No thanks
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
