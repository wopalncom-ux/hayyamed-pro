"use client";

import { useState } from "react";
import { verifyCmeActivity, rejectCmeActivity } from "@/app/(admin)/admin/cme-activities/actions";
import { track } from "@/lib/analytics";

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
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");

  async function handleVerify() {
    setLoading("verify");
    setError(null);
    const result = await verifyCmeActivity(activityId);
    setLoading(null);
    if (result?.error) { setError(result.error); return; }
    track("cme_activity_verified");
    setStatus("verified");
  }

  async function handleRejectConfirm() {
    setLoading("reject");
    setError(null);
    const result = await rejectCmeActivity(activityId, reason);
    setLoading(null);
    if (result?.error) { setError(result.error); return; }
    setStatus("rejected");
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

  if (showRejectForm) {
    return (
      <div className="flex flex-col gap-2 min-w-[240px]">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection (optional — sent to professional)"
          rows={2}
          className="text-xs w-full px-2.5 py-2 border border-[#e2e8f0] rounded-lg resize-none focus:outline-none focus:border-[#1a56a0]"
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
        <div className="flex gap-2">
          <button
            onClick={() => { setShowRejectForm(false); setReason(""); setError(null); }}
            disabled={!!loading}
            className="flex-1 text-xs px-2 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRejectConfirm}
            disabled={!!loading}
            className="flex-1 text-xs px-2 py-1.5 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] disabled:opacity-50"
          >
            {loading === "reject" ? "..." : "Confirm Reject"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-500">{error}</span>}
      <button
        onClick={() => setShowRejectForm(true)}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
      >
        Reject
      </button>
      <button
        onClick={handleVerify}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] disabled:opacity-50 transition-colors"
      >
        {loading === "verify" ? "..." : "Verify"}
      </button>
    </div>
  );
}
