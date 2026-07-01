"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Never run the service worker in local dev: it caches /_next/static chunks
    // cache-first, and dev chunk names are stable, so a crashed/edited build gets
    // "frozen" and served stale even through a hard refresh. In dev, proactively
    // unregister any previously-installed SW and clear its caches instead.
    const host = window.location.hostname;
    const isLocalDev = host === "localhost" || host === "127.0.0.1" || host === "::1";

    if (isLocalDev) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);

  return null;
}
