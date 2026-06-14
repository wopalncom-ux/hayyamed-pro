"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[#dcfce7] border border-[#86efac] rounded-xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-[#16a34a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-medium text-[#15803d]">
          You&rsquo;re on the list. We&rsquo;ll email you the moment we launch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#111] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a56a0] bg-white"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading" || !email.trim()}
        className="bg-[#1a56a0] hover:bg-[#154890] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? "Joining…" : "Notify me"}
      </button>
      {status === "error" && (
        <p className="text-xs text-[#dc2626] mt-1 sm:col-span-2">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
