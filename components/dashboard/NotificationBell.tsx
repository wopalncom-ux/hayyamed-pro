"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";

export default function NotificationBell() {
  const [status, setStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as "default" | "granted" | "denied");
  }, []);

  async function subscribe() {
    if (loading || status === "unsupported") return;
    setLoading(true);

    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as "granted" | "denied" | "default");
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      const json = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
        }),
      });
    } finally {
      setLoading(false);
    }
  }

  if (status === "unsupported") return null;

  return (
    <button
      onClick={subscribe}
      disabled={loading || status === "denied"}
      title={
        status === "granted" ? "Notifications enabled" :
        status === "denied" ? "Notifications blocked in browser settings" :
        "Enable notifications"
      }
      className="p-1.5 rounded-lg text-[#64748b] hover:text-[#111] hover:bg-[#f1f5f9] transition-colors disabled:opacity-40"
    >
      {status === "granted" ? (
        <Bell className="w-4 h-4 text-[#1a56a0]" />
      ) : (
        <BellOff className="w-4 h-4" />
      )}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
