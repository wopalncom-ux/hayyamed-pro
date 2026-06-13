"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { track } from "@/lib/analytics";

export default function UpgradeSuccessToast({ type }: { type?: string }) {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (type === "trial") {
      toast("Your 14-day Pro trial is active — enjoy full access!", "success");
      track("subscription_activated", { plan: "trialing" });
    } else {
      toast("Welcome to Pro — all features are now unlocked!", "success");
      track("subscription_activated", { plan: "pro" });
    }
    // Clean up URL without triggering a full navigation
    const url = new URL(window.location.href);
    url.searchParams.delete("upgrade");
    router.replace(url.pathname + (url.search !== "?" ? url.search : ""), { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
