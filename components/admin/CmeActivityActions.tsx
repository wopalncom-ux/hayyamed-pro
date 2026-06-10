"use client";

import { useState } from "react";
import { verifyCmeActivity, rejectCmeActivity } from "@/app/(admin)/admin/cme-activities/actions";

export default function CmeActivityActions({
  activityId,
  currentStatus,
}: {
  activityId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState<"verify" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(action: "verify" | "reject") {
    setLoading(action);
    setError(null);
    const fn = action === "verify" ? verifyCmeActivity : rejectCmeActivity;
    const result = await fn(activityId);
    setLoading(null);
    if (result?.error) { setError(result.error); return; }
    setStatus(action === "verify" ? "verified" : "rejected");
  }

  if (status !== "pending") {
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        status === "verified"
          ? "bg-[#dcfce7] text-[#16a34a]"
          : "bg-[#fef2f2] text-[#dc2626]"
      }`}>
        {status}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-500">{error}</span>}
      <button
        onClick={() => handle("reject")}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
      >
        {loading === "reject" ? "..." : "Reject"}
      </button>
      <button
        onClick={() => handle("verify")}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] disabled:opacity-50 transition-colors"
      >
        {loading === "verify" ? "..." : "Verify"}
      </button>
    </div>
  );
}
