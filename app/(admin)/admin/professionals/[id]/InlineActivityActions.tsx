"use client";

import { useState, useTransition } from "react";
import { verifyCmeActivity, rejectCmeActivity } from "@/app/(admin)/admin/cme-activities/actions";

export function InlineActivityActions({
  activityId,
  onAction,
}: {
  activityId: string;
  onAction: (id: string, newStatus: "verified" | "rejected") => void;
}) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [verifying, startVerify] = useTransition();
  const [rejecting, startReject] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    setError(null);
    startVerify(async () => {
      const res = await verifyCmeActivity(activityId);
      if (res.error) { setError(res.error); return; }
      onAction(activityId, "verified");
    });
  };

  const handleReject = () => {
    if (!reason.trim()) { setError("Rejection reason is required"); return; }
    setError(null);
    startReject(async () => {
      const res = await rejectCmeActivity(activityId, reason.trim());
      if (res.error) { setError(res.error); return; }
      onAction(activityId, "rejected");
    });
  };

  if (!showReject) {
    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          disabled={verifying}
          onClick={handleVerify}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] transition-colors disabled:opacity-50"
        >
          {verifying ? "…" : "Verify"}
        </button>
        <button
          type="button"
          onClick={() => setShowReject(true)}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] transition-colors"
        >
          Reject
        </button>
        {error && <span className="text-[10px] text-[#dc2626] ml-1">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 min-w-[200px]">
      <input
        type="text"
        autoFocus
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Rejection reason…"
        className="w-full text-xs px-2 py-1 border border-[#fca5a5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#dc2626] mb-1.5"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={rejecting}
          onClick={handleReject}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#dc2626] text-white hover:bg-[#b91c1c] disabled:opacity-50"
        >
          {rejecting ? "…" : "Confirm reject"}
        </button>
        <button
          type="button"
          onClick={() => { setShowReject(false); setReason(""); setError(null); }}
          className="text-xs text-[#64748b] hover:text-[#374151]"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-[10px] text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}
