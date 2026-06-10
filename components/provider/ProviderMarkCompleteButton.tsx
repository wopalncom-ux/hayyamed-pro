"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  enrollmentId: string;
  professionalId: string;
}

export default function ProviderMarkCompleteButton({ enrollmentId }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handle() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/provider/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed");
    } else {
      setDone(true);
      router.refresh();
    }
  }

  if (done) {
    return (
      <span className="text-xs bg-[#dcfce7] text-[#16a34a] font-medium px-2.5 py-1 rounded-full">
        Marked complete
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={handle}
        disabled={loading}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#1a56a0] text-[#1a56a0] hover:bg-[#eff6ff] transition-colors disabled:opacity-60"
      >
        {loading ? "…" : "Mark Complete"}
      </button>
      {error && <p className="text-xs text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}
