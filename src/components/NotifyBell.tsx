"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID?.trim();

interface OneSignalInstance {
  init: (opts: { appId: string; allowLocalhostAsSecureOrigin?: boolean; promptOptions?: object }) => void;
  Notifications: { requestPermission: () => Promise<boolean>; permission: boolean };
  User?: { PushSubscription?: { optedIn: boolean; addEventListener?: (event: string, cb: (e: { current?: { optedIn: boolean } }) => void) => void } };
}

function getOneSignal(): OneSignalInstance | undefined {
  return (window as unknown as { OneSignal?: OneSignalInstance }).OneSignal;
}

export default function NotifyBell() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const scriptLoaded = useRef(false);

  const ensureLoaded = useCallback((): Promise<OneSignalInstance> => {
    return new Promise((resolve) => {
      const O = getOneSignal();
      if (O) {
        resolve(O);
        return;
      }
      const win = window as unknown as { OneSignalDeferred?: Array<(os: OneSignalInstance) => void> };
      win.OneSignalDeferred = win.OneSignalDeferred || [];
      win.OneSignalDeferred.push((os) => resolve(os));
      if (!scriptLoaded.current) {
        scriptLoaded.current = true;
        const script = document.createElement("script");
        script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
        script.defer = true;
        document.head.appendChild(script);
      }
    });
  }, []);

  const handleSubscribe = useCallback(async () => {
    if (!APP_ID || loading || subscribed) return;
    setLoading(true);
    try {
      const O = await ensureLoaded();
      const granted = await O.Notifications.requestPermission();
      setSubscribed(granted);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [loading, subscribed, ensureLoaded]);

  useEffect(() => {
    if (!APP_ID) return;
    const win = window as unknown as { OneSignalDeferred?: Array<(os: OneSignalInstance) => void> };
    win.OneSignalDeferred = win.OneSignalDeferred || [];
    win.OneSignalDeferred.push((OneSignal) => {
      OneSignal.init({
        appId: APP_ID,
        allowLocalhostAsSecureOrigin: true,
        promptOptions: { autoPrompt: false },
      });
      OneSignal.User?.PushSubscription?.addEventListener?.("change", (e) => {
        if (e.current?.optedIn) setSubscribed(true);
      });
      if (OneSignal.User?.PushSubscription?.optedIn) setSubscribed(true);
    });
    if (!document.querySelector('script[src*="OneSignalSDK.page.js"]')) {
      scriptLoaded.current = true;
      const script = document.createElement("script");
      script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  if (!APP_ID) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading || subscribed}
        className="flex items-center justify-center rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-60"
        aria-label={subscribed ? "Notifications enabled" : "Enable push notifications"}
        title={subscribed ? "You're subscribed" : "Get notified: new videos, blog posts, trending picks"}
      >
        {subscribed ? (
          <CheckIcon className="h-5 w-5" />
        ) : loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        ) : (
          <BellIcon className="h-5 w-5" />
        )}
      </button>
    </>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 6H3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
