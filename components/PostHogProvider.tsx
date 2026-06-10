"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics } from "@/lib/analytics";
import posthog from "posthog-js";

// Tracks SPA route changes as page views
function PageView() {
  const pathname = usePathname();
  const initialized = useRef(false);

  // Init once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initAnalytics();
  }, []);

  // Track every pathname change
  useEffect(() => {
    if (typeof window === "undefined") return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
      {children}
    </>
  );
}
