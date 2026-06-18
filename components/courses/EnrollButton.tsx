"use client";

import { useState } from "react";

interface Props {
  courseId: string;
  isAuthenticated: boolean;
  initialEnrolled: boolean;
  deadlinePassed: boolean;
  isFull: boolean;
  isFree: boolean;
  priceUsd: number | null;
}

export default function EnrollButton({
  courseId,
  isAuthenticated,
  initialEnrolled,
  deadlinePassed,
  isFull,
  isFree,
  priceUsd,
}: Props) {
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <a
        href={`/register?from=/courses/${courseId}`}
        className="block w-full text-center bg-[#1a56a0] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#154890] transition-colors"
      >
        Register free to enroll
      </a>
    );
  }

  if (enrolled) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-full flex items-center justify-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] text-sm font-semibold px-6 py-3 rounded-xl">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Enrolled
        </div>
        <a
          href="/dashboard/marketplace"
          className="text-xs text-[#1a56a0] hover:underline"
        >
          View in your dashboard →
        </a>
      </div>
    );
  }

  if (deadlinePassed) {
    return (
      <div className="w-full flex items-center justify-center bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-sm font-semibold px-6 py-3 rounded-xl">
        Enrollment closed
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="w-full flex items-center justify-center bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-sm font-semibold px-6 py-3 rounded-xl">
        Course full
      </div>
    );
  }

  async function handleEnroll() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        if (res.status === 409) {
          setEnrolled(true);
          return;
        }
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      setEnrolled(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full bg-[#1a56a0] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#154890] transition-colors disabled:opacity-60"
      >
        {loading ? "Enrolling…" : isFree ? "Enroll free" : priceUsd ? `Enroll — $${priceUsd}` : "Enroll now"}
      </button>
      {error && <p className="text-xs text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
}
