"use client";
import { useState, useEffect, useCallback } from "react";

type Segment = { id: string; label: string; description: string; hasFilter: boolean; filterLabel?: string; filterPlaceholder?: string };

const SEGMENTS: Segment[] = [
  { id: "all",                   label: "All Users",             description: "Every user who completed onboarding",   hasFilter: false },
  { id: "pro",                   label: "Pro / Employer / Uni",  description: "Active or trialing paid subscribers",    hasFilter: false },
  { id: "free",                  label: "Free Users",            description: "Onboarded users with no active plan",   hasFilter: false },
  { id: "churn_risk",            label: "Churn Risk",            description: "No CME submitted in the last 30 days",  hasFilter: false },
  { id: "incomplete_onboarding", label: "Stuck in Onboarding",  description: "Signed up but never finished setup",     hasFilter: false },
  { id: "country",               label: "By Country",            description: "Filter by country of residence",        hasFilter: true, filterLabel: "Country", filterPlaceholder: "e.g. Qatar" },
  { id: "profession",            label: "By Profession",         description: "Filter by medical profession",          hasFilter: true, filterLabel: "Profession", filterPlaceholder: "e.g. Physician" },
];

export default function PushComposePage() {
  const [segment, setSegment]   = useState("all");
  const [filter, setFilter]     = useState("");
  const [title, setTitle]       = useState("");
  const [body, setBody]         = useState("");
  const [url, setUrl]           = useState("/dashboard");
  const [preview, setPreview]   = useState<{ target_count: number; push_enabled: number } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sending, setSending]   = useState(false);
  const [result, setResult]     = useState<{ queued: number; target_count: number; message: string } | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const activeSegment = SEGMENTS.find((s) => s.id === segment)!;

  const loadPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const p = new URLSearchParams({ segment });
      if (filter) p.set("filter", filter);
      const res = await fetch(`/api/admin/push-compose?${p}`);
      const json = await res.json();
      setPreview(json);
    } catch { /* ignore */ }
    setPreviewLoading(false);
  }, [segment, filter]);

  useEffect(() => {
    const t = setTimeout(loadPreview, 400);
    return () => clearTimeout(t);
  }, [loadPreview]);

  const handleSend = async () => {
    if (!title || !body || !confirmed) return;
    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/push-compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url, segment, filter }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResult(json);
      setConfirmed(false);
    } catch (e) { setError((e as Error).message); }
    setSending(false);
  };

  const charWarning = body.length > 100;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Push Notification Composer</h1>
        <p className="text-[#64748b] mt-1">
          Compose and broadcast push notifications to targeted user segments. Queued to notification_queue for dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Compose form */}
        <div className="lg:col-span-3 space-y-5">
          {/* Segment selector */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Target Segment</h2>
            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSegment(s.id); setFilter(""); setPreview(null); setResult(null); }}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                    segment === s.id
                      ? "border-[#1a56a0] bg-[#eff6ff] text-[#1a56a0]"
                      : "border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0]/30"
                  }`}
                >
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">{s.description}</p>
                </button>
              ))}
            </div>

            {activeSegment.hasFilter && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-[#374151] mb-1">{activeSegment.filterLabel}</label>
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={activeSegment.filterPlaceholder}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56a0]"
                />
              </div>
            )}

            {/* Audience preview */}
            <div className={`mt-4 px-4 py-3 rounded-xl text-xs ${
              previewLoading ? "bg-[#f8fafc]" :
              preview && preview.push_enabled === 0 ? "bg-amber-50 border border-amber-200" :
              preview ? "bg-[#dcfce7] border border-[#bbf7d0]" : "bg-[#f8fafc]"
            }`}>
              {previewLoading ? (
                <span className="text-[#64748b]">Calculating audience…</span>
              ) : preview ? (
                <span className={preview.push_enabled > 0 ? "text-[#15803d]" : "text-[#92400e]"}>
                  <strong>{preview.push_enabled}</strong> users will receive this push
                  {" "}({preview.target_count} match segment · {preview.push_enabled} have push enabled)
                </span>
              ) : (
                <span className="text-[#94a3b8]">Audience size will appear here</span>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Message</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Title <span className="text-[#94a3b8]">({title.length}/50)</span></label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                  placeholder="e.g. Your CME deadline is approaching"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Body <span className={charWarning ? "text-[#d97706]" : "text-[#94a3b8]"}>({body.length}/120)</span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value.slice(0, 120))}
                  placeholder="e.g. You need 15 more CME credits before renewal. Log activities now."
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none resize-none ${charWarning ? "border-[#d97706]" : "border-[#e2e8f0] focus:border-[#1a56a0]"}`}
                />
                {charWarning && <p className="text-[10px] text-[#d97706] mt-1">Keep under 100 chars for best readability across devices.</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Click URL (opens in app)</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/dashboard"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:border-[#1a56a0]"
                />
              </div>
            </div>
          </div>

          {/* Confirm + Send */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            {result ? (
              <div className="p-4 bg-[#dcfce7] border border-[#bbf7d0] rounded-xl">
                <p className="text-sm font-semibold text-[#15803d]">✓ Broadcast Queued</p>
                <p className="text-xs text-[#16a34a] mt-1">{result.message}</p>
                <button onClick={() => { setResult(null); setTitle(""); setBody(""); setUrl("/dashboard"); }}
                  className="mt-3 text-xs text-[#15803d] underline">Send another</button>
              </div>
            ) : (
              <>
                {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">{error}</div>}
                <label className="flex items-start gap-2 cursor-pointer mb-4">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 accent-[#1a56a0]" />
                  <span className="text-xs text-[#374151]">
                    I confirm this notification will be sent to <strong>{preview?.push_enabled ?? "…"} users</strong>. This action is logged in the audit trail.
                  </span>
                </label>
                <button
                  onClick={handleSend}
                  disabled={!title || !body || !confirmed || sending || (preview?.push_enabled === 0)}
                  className="w-full py-3 bg-[#1a56a0] text-white text-sm font-semibold rounded-xl hover:bg-[#1547a0] disabled:opacity-40 transition-colors"
                >
                  {sending ? "Queuing…" : `Send to ${preview?.push_enabled ?? "…"} Users`}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Phone preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Preview</h2>

            {/* iOS style */}
            <div className="bg-[#1c1c1e] rounded-3xl p-4 mb-4 shadow-2xl">
              <div className="text-[10px] text-[#8e8e93] text-center mb-3">iPhone · Lock Screen</div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-[6px] bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[8px] font-bold">H</span>
                  </div>
                  <span className="text-white text-[10px] font-semibold">HAYYA MED PRO</span>
                  <span className="text-[#8e8e93] text-[10px] ml-auto">now</span>
                </div>
                <p className="text-white text-xs font-semibold leading-tight">{title || "Notification title"}</p>
                <p className="text-[#ebebf5]/70 text-[11px] leading-tight mt-0.5">{body || "Notification body text will appear here"}</p>
              </div>
            </div>

            {/* Android style */}
            <div className="bg-[#121212] rounded-3xl p-4 shadow-2xl">
              <div className="text-[10px] text-[#5f6368] text-center mb-3">Android · Notification Shade</div>
              <div className="bg-[#2d2d2d] rounded-xl p-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">H</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[#e8eaed] text-[10px] font-medium">Hayya Med Pro</span>
                      <span className="text-[#5f6368] text-[9px]">now</span>
                    </div>
                    <p className="text-[#e8eaed] text-xs font-semibold mt-0.5 leading-tight">{title || "Notification title"}</p>
                    <p className="text-[#9aa0a6] text-[11px] leading-tight mt-0.5">{body || "Notification body text"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs text-[#64748b] space-y-1">
              <p><strong className="text-[#374151]">Click action:</strong> {url || "/dashboard"}</p>
              <p><strong className="text-[#374151]">Delivery:</strong> Via notification_queue → web push dispatcher</p>
              <p><strong className="text-[#374151]">Logged:</strong> Yes — audit_logs + send count</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
