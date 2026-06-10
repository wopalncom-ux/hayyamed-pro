"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkCourseCompleteButton({ enrollmentId }: { enrollmentId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleComplete() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/marketplace/complete", {
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
      <span className="text-xs bg-[#dcfce7] text-[#16a34a] font-medium px-3 py-1.5 rounded-lg">
        Credits issued!
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={handleComplete}
        disabled={loading}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#1a56a0] text-[#1a56a0] hover:bg-[#eff6ff] transition-colors disabled:opacity-60"
      >
        {loading ? "Processing…" : "Mark Complete"}
      </button>
      {error && <p className="text-xs text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}
