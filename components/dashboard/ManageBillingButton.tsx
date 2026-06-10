"use client";

import { useState } from "react";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/paddle/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm text-[#1a56a0] border border-[#1a56a0]/30 px-4 py-2 rounded-lg hover:bg-[#1a56a0]/5 disabled:opacity-50 transition-colors"
    >
      {loading ? "Opening…" : "Manage billing →"}
    </button>
  );
}
