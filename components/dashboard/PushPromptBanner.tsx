"use client";

import { useState, useEffect } from "react";

const DISMISS_KEY = "hmp_push_prompt_dismissed";
const SNOOZE_KEY  = "hmp_push_prompt_snoozed_until";
const SNOOZE_MS   = 7 * 24 * 60 * 60 * 1000; // 7 days

function urlBase64ToUint8Array(b64: string) {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function PushPromptBanner({ activityCount }: { activityCount: number }) {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "denied">("idle");

  useEffect(() => {
    // Conditions to show:
    // 1. Push API supported
    // 2. Permission not yet decided (default)
    // 3. User has at least 1 activity (moment of value)
    // 4. Not permanently dismissed or currently snoozed
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission !== "default") return;
    if (activityCount < 1) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const snoozedUntil = parseInt(localStorage.getItem(SNOOZE_KEY) ?? "0", 10);
    if (snoozedUntil > Date.now()) return;

    setVisible(true);
  }, [activityCount]);

  if (!visible) return null;

  async function handleEnable() {
    setState("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setState("denied");
        return;
      }
      if (permission !== "granted") {
        setVisible(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      const json = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, p256dh: json.keys?.p256dh, auth: json.keys?.auth }),
      });

      setState("done");
      setTimeout(() => setVisible(false), 2500);
    } catch {
      setState("idle");
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  function snooze() {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
    setVisible(false);
  }

  if (state === "done") {
    return (
      <div className="mb-6 flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-5 py-3.5">
        <div className="w-8 h-8 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[#15803d]">
          Push notifications enabled — you&apos;ll be alerted before CME deadlines and license expiry.
        </p>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="mb-6 flex items-start gap-3 bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-5 py-3.5">
        <svg className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#92400e]">Notifications blocked by your browser</p>
          <p className="text-xs text-[#78350f] mt-0.5">
            To enable them, click the lock icon in your browser address bar and allow notifications for hayyamed.pro.
          </p>
        </div>
        <button onClick={dismiss} className="text-xs text-[#92400e] hover:text-[#78350f] transition-colors flex-shrink-0">
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-[#f0f6ff] border border-[#bfdbfe] rounded-xl px-5 py-4">
      {/* Bell icon */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
          <svg className="w-4.5 h-4.5 text-white" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1e3a5f]">Never miss a CME deadline</p>
          <p className="text-xs text-[#374151] mt-0.5">
            Get browser alerts before your cycle ends, when licenses are expiring, and when activities are verified.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleEnable}
          disabled={state === "loading"}
          className="text-xs font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
        >
          {state === "loading" ? "Enabling…" : "Enable alerts"}
        </button>
        <button onClick={snooze} className="text-xs text-[#64748b] hover:text-[#374151] transition-colors">
          Later
        </button>
        <button onClick={dismiss} className="text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors">
          Never
        </button>
      </div>
    </div>
  );
}
