"use client";

import { useState } from "react";
import type { PlanKey } from "@/lib/paddle";

export default function UpgradeButton({ plan, label = "Get Started" }: { plan: PlanKey; label?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full bg-[#1a56a0] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1547a0] disabled:opacity-60 transition-all"
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}
