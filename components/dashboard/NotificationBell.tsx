"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, BellOff, Mail, Shield, BookOpen, RefreshCw, Clock, GraduationCap, CreditCard, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type InboxItem = {
  id: string;
  label: string;
  icon: string;
  channel: string;
  status: string;
  created_at: string;
  sent_at: string | null;
};

function NotifIcon({ icon, channel }: { icon: string; channel: string }) {
  const cls = "w-3.5 h-3.5";
  if (icon === "id-card")        return <CreditCard className={cls} />;
  if (icon === "graduation-cap") return <GraduationCap className={cls} />;
  if (icon === "shield")         return <Shield className={cls} />;
  if (icon === "book")           return <BookOpen className={cls} />;
  if (icon === "refresh")        return <RefreshCw className={cls} />;
  if (icon === "clock")          return <Clock className={cls} />;
  if (channel === "email")       return <Mail className={cls} />;
  return <Bell className={cls} />;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function NotificationBell() {
  const { toast } = useToast();
  const [pushStatus, setPushStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPushStatus("unsupported");
    } else {
      setPushStatus(Notification.permission as "default" | "granted" | "denied");
    }
  }, []);

  const fetchInbox = useCallback(async () => {
    if (loaded) return;
    try {
      const res = await fetch("/api/notifications/inbox?limit=15");
      if (res.ok) {
        const data = await res.json();
        setItems(data.notifications ?? []);
      }
    } catch {}
    setLoaded(true);
  }, [loaded]);

  useEffect(() => {
    if (open) fetchInbox();
  }, [open, fetchInbox]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function enablePush() {
    if (loading || pushStatus === "unsupported") return;
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission as "granted" | "denied" | "default");
      if (permission === "denied") {
        toast("Notifications blocked — enable them in browser settings.", "info");
        return;
      }
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, p256dh: json.keys?.p256dh, auth: json.keys?.auth }),
      });

      if (res.ok) {
        toast("Push notifications enabled.", "success");
      } else {
        toast("Could not save notification preferences — try again.", "error");
      }
    } catch {
      toast("Could not enable notifications — try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (pushStatus === "unsupported") return null;

  const recentCount = items.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative p-1.5 rounded-lg text-[#64748b] hover:text-[#111] hover:bg-[#f1f5f9] transition-colors"
      >
        {pushStatus === "granted" ? (
          <Bell className="w-4 h-4 text-[#1a56a0]" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
        {recentCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#dc2626] text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {recentCount > 9 ? "9+" : recentCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
            <span className="text-sm font-semibold text-[#111]">Notifications</span>
            <div className="flex items-center gap-2">
              <a href="/dashboard/notifications" className="text-xs text-[#1a56a0] hover:underline">
                View all
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-0.5 rounded text-[#94a3b8] hover:text-[#374151]"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Push subscribe prompt */}
          {pushStatus !== "granted" && pushStatus !== "denied" && (
            <div className="px-4 py-3 bg-[#f0f7ff] border-b border-[#bfdbfe]">
              <p className="text-xs text-[#1e40af] mb-2">Enable push notifications to get real-time alerts.</p>
              <button
                type="button"
                onClick={enablePush}
                disabled={loading}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] disabled:opacity-50"
              >
                {loading ? "Enabling…" : "Enable notifications"}
              </button>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto divide-y divide-[#f8fafc]">
            {!loaded && (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-[#94a3b8]">Loading…</p>
              </div>
            )}
            {loaded && items.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-[#e2e8f0] mx-auto mb-2" />
                <p className="text-xs text-[#94a3b8]">No notifications yet.</p>
                <p className="text-[10px] text-[#94a3b8] mt-1">Reminders and alerts will appear here.</p>
              </div>
            )}
            {loaded && items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors">
                <div className="mt-0.5 w-7 h-7 rounded-full bg-[#f0f7ff] flex items-center justify-center flex-shrink-0 text-[#1a56a0]">
                  <NotifIcon icon={item.icon} channel={item.channel} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#111] leading-snug">{item.label}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5">{timeAgo(item.created_at)}</p>
                </div>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                  item.status === "sent"    ? "bg-[#dcfce7] text-[#15803d]" :
                  item.status === "pending" ? "bg-[#fef9c3] text-[#854d0e]" :
                                              "bg-[#fee2e2] text-[#dc2626]"
                }`}>
                  {item.channel}
                </span>
              </div>
            ))}
          </div>

          <div className="px-4 py-2.5 border-t border-[#f1f5f9] bg-[#f8fafc]">
            <a
              href="/dashboard/notifications"
              className="block text-center text-xs text-[#1a56a0] font-medium hover:underline"
            >
              Manage notification settings →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
