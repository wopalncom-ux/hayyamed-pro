"use client";
import { useEffect, useState } from "react";

type Item = { type: string; text: string };
type Entry = { id: string; version: string; title: string; summary: string | null; items: Item[]; published_at: string };

const TYPE_COLORS: Record<string, string> = {
  feature:     "bg-[#dbeafe] text-[#1d4ed8]",
  improvement: "bg-[#dcfce7] text-[#15803d]",
  fix:         "bg-[#fef9c3] text-[#92400e]",
  security:    "bg-[#fee2e2] text-[#dc2626]",
};

const SEEN_KEY = "hmp_changelog_seen";

export default function WhatsNew() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen]       = useState(false);
  const [unread, setUnread]   = useState(0);

  useEffect(() => {
    fetch("/api/changelog")
      .then((r) => r.json())
      .then(({ data }: { data: Entry[] }) => {
        if (!data?.length) return;
        setEntries(data);
        try {
          const seen = localStorage.getItem(SEEN_KEY) ?? "";
          const unseenCount = data.filter((e) => !seen.includes(e.id)).length;
          setUnread(unseenCount);
        } catch { setUnread(0); }
      })
      .catch(() => {});
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    try {
      const ids = entries.map((e) => e.id).join(",");
      localStorage.setItem(SEEN_KEY, ids);
    } catch { /* ignore */ }
  };

  if (!entries.length) return null;

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative inline-flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors"
        title="What's New"
      >
        <span>What&apos;s New</span>
        {unread > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#1a56a0] text-white text-[9px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">What&apos;s New</h2>
                <p className="text-[10px] text-[#64748b]">Latest platform updates</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#94a3b8] hover:text-[#374151] text-xl">×</button>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-[#f8fafc]">
              {entries.map((e) => (
                <div key={e.id} className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#1a56a0] bg-[#eff6ff] px-2 py-0.5 rounded">{e.version}</span>
                    <h3 className="text-xs font-semibold text-[#0f172a]">{e.title}</h3>
                    <span className="ml-auto text-[9px] text-[#94a3b8] whitespace-nowrap">
                      {new Date(e.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  {e.summary && <p className="text-[11px] text-[#64748b] mb-2">{e.summary}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {(e.items as Item[]).slice(0, 5).map((item, i) => (
                      <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[item.type] ?? "bg-[#f1f5f9] text-[#374151]"}`}>
                        {item.text}
                      </span>
                    ))}
                    {e.items.length > 5 && (
                      <span className="text-[10px] text-[#94a3b8] px-1 py-0.5">+{e.items.length - 5} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
