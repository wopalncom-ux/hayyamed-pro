"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function NotificationsEnableButton() {
  const { toast } = useToast();
  const [status, setStatus] = useState<"default" | "granted" | "denied" | "unsupported" | "loading">("loading");

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as "default" | "granted" | "denied");
  }, []);

  async function handleEnable() {
    if (status === "unsupported" || status === "loading") return;
    setStatus("loading");

    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setStatus("denied");
        toast("Notifications blocked. Enable them in your browser settings.", "info");
        return;
      }
      if (permission !== "granted") {
        setStatus("default");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
        }),
      });

      if (res.ok) {
        setStatus("granted");
        toast("Push notifications enabled for CME deadlines and license expiry alerts.", "success");
      } else {
        setStatus("default");
        toast("Could not save notification preferences. Please try again.", "error");
      }
    } catch {
      setStatus("default");
      toast("Could not enable notifications. Please try again.", "error");
    }
  }

  if (status === "loading") {
    return <div className="h-10 w-40 bg-[#f1f5f9] rounded-lg animate-pulse" />;
  }

  if (status === "unsupported") {
    return (
      <p className="text-sm text-[#94a3b8]">
        Push notifications are not supported in this browser.
      </p>
    );
  }

  if (status === "granted") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#16a34a] bg-[#dcfce7] px-3 py-1.5 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Push notifications enabled
        </span>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div>
        <p className="text-sm text-[#dc2626] mb-1">Push notifications are blocked in your browser.</p>
        <p className="text-xs text-[#64748b]">
          To enable them, click the lock icon in your browser&apos;s address bar and allow notifications for this site.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnable}
      className="inline-flex items-center gap-2 bg-[#1a56a0] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Enable push notifications
    </button>
  );
}
