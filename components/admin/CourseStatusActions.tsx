"use client";

import { useState } from "react";
import { activateCourse, draftCourse, closeCourse } from "@/app/(admin)/admin/courses/actions";

export default function CourseStatusActions({
  courseId,
  status,
}: {
  courseId: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reason, setReason] = useState("");

  async function run(action: () => Promise<void>) {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
      setShowRejectInput(false);
      setReason("");
    }
  }

  if (showRejectInput) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="text-xs border border-[#e2e8f0] rounded px-2 py-1 w-40 focus:outline-none focus:ring-1 focus:ring-[#1a56a0]"
        />
        <button
          onClick={() => run(() => draftCourse(courseId, reason))}
          disabled={loading}
          className="text-xs bg-[#d97706] text-white px-3 py-1 rounded font-medium hover:bg-[#b45309] transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Confirm"}
        </button>
        <button
          onClick={() => setShowRejectInput(false)}
          className="text-xs text-[#64748b] hover:text-[#111] px-2 py-1"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {status !== "active" && (
        <button
          onClick={() => run(() => activateCourse(courseId))}
          disabled={loading}
          className="text-xs bg-[#16a34a] text-white px-3 py-1 rounded font-medium hover:bg-[#15803d] transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Activate"}
        </button>
      )}
      {status === "active" && (
        <button
          onClick={() => setShowRejectInput(true)}
          disabled={loading}
          className="text-xs bg-[#fff7ed] text-[#d97706] border border-[#fed7aa] px-3 py-1 rounded font-medium hover:bg-[#ffedd5] transition-colors disabled:opacity-50"
        >
          Return to Draft
        </button>
      )}
      {status !== "closed" && status !== "draft" && (
        <button
          onClick={() => run(() => closeCourse(courseId))}
          disabled={loading}
          className="text-xs bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-3 py-1 rounded font-medium hover:bg-[#fee2e2] transition-colors disabled:opacity-50"
        >
          Close
        </button>
      )}
      {status === "draft" && (
        <button
          onClick={() => run(() => closeCourse(courseId))}
          disabled={loading}
          className="text-xs text-[#64748b] border border-[#e2e8f0] px-3 py-1 rounded font-medium hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
