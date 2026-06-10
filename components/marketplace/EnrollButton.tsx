"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
  enrolled: boolean;
  completed: boolean;
}

export default function EnrollButton({ courseId, enrolled, completed }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleEnroll() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/marketplace/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Enrollment failed");
    } else {
      router.refresh();
    }
  }

  if (completed) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs bg-[#dcfce7] text-[#16a34a] font-medium px-3 py-1.5 rounded-lg">
          Completed
        </span>
        <a
          href="/dashboard/marketplace/my-courses"
          className="text-xs text-[#1a56a0] hover:underline"
        >
          View my courses →
        </a>
      </div>
    );
  }

  if (enrolled) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs bg-[#eff6ff] text-[#1a56a0] font-medium px-3 py-1.5 rounded-lg border border-blue-100">
          Enrolled
        </span>
        <a
          href="/dashboard/marketplace/my-courses"
          className="text-xs text-[#1a56a0] hover:underline"
        >
          View my courses →
        </a>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="bg-[#1a56a0] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors disabled:opacity-60"
      >
        {loading ? "Enrolling…" : "Enroll Now"}
      </button>
      {error && <p className="text-xs text-[#dc2626] mt-1.5">{error}</p>}
    </div>
  );
}
