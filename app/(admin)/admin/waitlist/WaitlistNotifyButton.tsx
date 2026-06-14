"use client";

import { useState } from "react";

export default function WaitlistNotifyButton({ pending }: { pending: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<{ sent: number; failed: number; message: string } | null>(null);

  async function handleNotify() {
    if (!confirm(`Send launch emails to all ${pending} unnotified waitlist signups? This cannot be undone.`)) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/waitlist/notify", { method: "POST" });
      const data = await res.json();
      setResult(data);
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
      setResult(null);
    }
  }

  if (status === "done" && result) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#16a34a] font-medium">
          Sent {result.sent} emails{result.failed > 0 ? ` (${result.failed} failed)` : ""}
        </span>
        <button
          onClick={() => { setStatus("idle"); setResult(null); }}
          className="text-xs text-[#64748b] hover:underline"
        >
          Reset
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#dc2626] font-medium">Send failed</span>
        <button onClick={() => setStatus("idle")} className="text-xs text-[#64748b] hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <button
      onClick={handleNotify}
      disabled={status === "loading"}
      className="text-sm font-medium text-white bg-[#16a34a] hover:bg-[#15803d] px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
    >
      {status === "loading" ? "Sending…" : `Send launch emails (${pending})`}
    </button>
  );
}
