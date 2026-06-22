"use client";
import { useEffect, useState } from "react";

type Announcement = {
  id: string; title: string; message: string; type: string;
  dismissible: boolean; cta_label: string | null; cta_url: string | null;
};

const STYLES: Record<string, { bg: string; border: string; text: string; icon: string; btn: string }> = {
  info:    { bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-900",  icon: "ℹ️",  btn: "bg-blue-600 hover:bg-blue-700 text-white" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900", icon: "⚠️",  btn: "bg-amber-600 hover:bg-amber-700 text-white" },
  success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-900", icon: "✅",  btn: "bg-green-600 hover:bg-green-700 text-white" },
  error:   { bg: "bg-red-50",   border: "border-red-200",   text: "text-red-900",   icon: "🚨",  btn: "bg-red-600 hover:bg-red-700 text-white" },
};

const DISMISSED_KEY = "hmp_dismissed_announcements";

function getDismissed(): string[] {
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]"); } catch { return []; }
}
function dismiss(id: string) {
  const prev = getDismissed();
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...prev.filter((x) => x !== id), id]));
}

export default function AnnouncementBanner() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    const dismissed = getDismissed();
    fetch("/api/announcements")
      .then((r) => r.json())
      .then(({ data }) => setItems((data ?? []).filter((a: Announcement) => !dismissed.includes(a.id))))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 space-y-2">
      {items.map((a) => {
        const s = STYLES[a.type] ?? STYLES.info;
        return (
          <div key={a.id} className={`flex gap-3 items-start px-4 py-3 rounded-xl border ${s.bg} ${s.border}`}>
            <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${s.text}`}>{a.title}</p>
              <p className={`text-xs mt-0.5 ${s.text} opacity-80`}>{a.message}</p>
              {a.cta_label && a.cta_url && (
                <a href={a.cta_url}
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded-lg font-medium transition-colors ${s.btn}`}>
                  {a.cta_label}
                </a>
              )}
            </div>
            {a.dismissible && (
              <button
                onClick={() => { dismiss(a.id); setItems((prev) => prev.filter((i) => i.id !== a.id)); }}
                className={`text-lg leading-none flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity ${s.text}`}
                aria-label="Dismiss">×</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
