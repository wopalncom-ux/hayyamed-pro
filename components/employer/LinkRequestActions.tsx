"use client";

import { useState } from "react";
import { approveLinkRequest, rejectLinkRequest } from "@/app/(employer)/employer/actions";

export default function LinkRequestActions({
  requestId,
  organizationId,
}: {
  requestId: string;
  organizationId: string;
}) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(action: "approve" | "reject") {
    setLoading(action);
    setError(null);
    const fn = action === "approve" ? approveLinkRequest : rejectLinkRequest;
    const result = await fn(requestId, organizationId);
    if (result?.error) {
      setError(result.error);
      setLoading(null);
    } else {
      setDone(true);
      setLoading(null);
    }
  }

  if (done) {
    return <span className="text-xs text-[#64748b]">Updated</span>;
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
        onClick={() => handle("approve")}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
      >
        {loading === "approve" ? "..." : "Approve"}
      </button>
    </div>
  );
}
