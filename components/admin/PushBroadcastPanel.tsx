"use client";

import { useState } from "react";
import { Bell, Send } from "lucide-react";

type Segment = "all" | "pro" | "at_risk";

const SEGMENT_LABELS: Record<Segment, string> = {
  all: "All users with push enabled",
  pro: "Pro & Employer subscribers only",
  at_risk: "At-risk & non-compliant users",
};

interface BroadcastResult {
  sent: number;
  failed: number;
  total: number;
  segment: Segment;
}

export default function PushBroadcastPanel() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/dashboard");
  const [segment, setSegment] = useState<Segment>("all");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BroadcastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!title.trim() || !body.trim()) {
      setError("Title and message are required");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/push-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), url: url.trim() || "/dashboard", segment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Broadcast failed");
      setResult(data);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Broadcast failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-[#1a56a0]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#111]">Push Notification Broadcast</h2>
          <p className="text-xs text-[#64748b]">Send a push notification to a segment of users who have enabled push</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Segment selector */}
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Audience segment</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(["all", "pro", "at_risk"] as Segment[]).map((s) => (
              <button
                key={s}
                onClick={() => setSegment(s)}
                className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-colors ${
                  segment === s
                    ? "border-[#1a56a0] bg-[#eff6ff] text-[#1a56a0] font-medium"
                    : "border-[#e2e8f0] bg-white text-[#374151] hover:bg-[#f8fafc]"
                }`}
              >
                <span className="font-semibold capitalize">{s === "at_risk" ? "At-risk" : s.charAt(0).toUpperCase() + s.slice(1)}</span>
                <br />
                <span className="text-[#64748b] font-normal">{SEGMENT_LABELS[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="push-title" className="block text-xs font-medium text-[#374151] mb-1.5">
            Title <span className="text-[#94a3b8]">(max 100 chars)</span>
          </label>
          <input
            id="push-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="e.g. Your license expires in 30 days"
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
          />
          <p className="text-xs text-[#94a3b8] mt-1 text-right">{title.length}/100</p>
        </div>

        {/* Body */}
        <div>
          <label htmlFor="push-body" className="block text-xs font-medium text-[#374151] mb-1.5">
            Message <span className="text-[#94a3b8]">(max 250 chars)</span>
          </label>
          <textarea
            id="push-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={250}
            rows={3}
            placeholder="e.g. Review your CME status now to avoid compliance issues at renewal."
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent resize-none"
          />
          <p className="text-xs text-[#94a3b8] mt-1 text-right">{body.length}/250</p>
        </div>

        {/* URL */}
        <div>
          <label htmlFor="push-url" className="block text-xs font-medium text-[#374151] mb-1.5">
            Link URL <span className="text-[#94a3b8]">(where tapping opens)</span>
          </label>
          <input
            id="push-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/dashboard/cme"
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3 text-sm text-[#dc2626]">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-3 text-sm text-[#166534]">
            <p className="font-semibold">Broadcast sent</p>
            <p className="text-xs mt-1 text-[#16a34a]">
              {result.sent} delivered · {result.failed} failed · {result.total} total subscriptions in segment
            </p>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={loading || !title.trim() || !body.trim()}
          className="inline-flex items-center gap-2 bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          {loading ? "Sending…" : "Send push notification"}
        </button>
      </div>
    </div>
  );
}
