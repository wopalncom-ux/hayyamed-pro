"use client";

import { useState } from "react";
import { approveVerifiedRequest, rejectAdminRequest } from "@/app/(admin)/admin/link-requests/actions";

export default function VerifiedRequestActions({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(action: "approve" | "reject") {
    setLoading(action);
    setError(null);
    const fn = action === "approve" ? approveVerifiedRequest : rejectAdminRequest;
    const result = await fn(requestId);
    setLoading(null);
    if (result?.error) { setError(result.error); return; }
    setDone(action === "approve" ? "approved" : "rejected");
  }

  if (done) {
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        done === "approved" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fef2f2] text-[#dc2626]"
      }`}>
        {done}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-500 mr-1">{error}</span>}
      <button
        onClick={() => handle("reject")}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
      >
        {loading === "reject" ? "..." : "Reject"}
      </button>
      <button
        onClick={() => handle("approve")}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
      >
        {loading === "approve" ? "..." : "Approve"}
      </button>
    </div>
  );
}
