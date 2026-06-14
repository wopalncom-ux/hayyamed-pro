"use client";

import { useState } from "react";

export default function CopyVerificationLinkButton() {
  const [state, setState] = useState<"idle" | "loading" | "copied" | "error">("idle");

  async function handleCopy() {
    setState("loading");
    try {
      const res = await fetch("/api/certificates/verification-link");
      const data = await res.json();
      if (!res.ok) throw new Error();
      await navigator.clipboard.writeText(data.url);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={state === "loading"}
      className="flex-shrink-0 flex items-center gap-1.5 text-sm border border-[#e2e8f0] bg-white text-[#374151] px-4 py-2 rounded-lg font-medium hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors disabled:opacity-50"
    >
      {state === "loading" && (
        <svg className="w-4 h-4 animate-spin text-[#64748b]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {state === "copied" && (
        <svg className="w-4 h-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {state === "error" && (
        <svg className="w-4 h-4 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {state === "idle" && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )}
      <span className={state === "copied" ? "text-[#16a34a]" : state === "error" ? "text-[#dc2626]" : ""}>
        {state === "loading" ? "Generating…" : state === "copied" ? "Copied!" : state === "error" ? "Failed — try again" : "Copy verification link"}
      </span>
    </button>
  );
}
