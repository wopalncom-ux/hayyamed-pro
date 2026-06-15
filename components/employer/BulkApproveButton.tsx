"use client";

import { useState } from "react";
import { approveAllLinkRequests } from "@/app/(employer)/employer/actions";

interface Props {
  organizationId: string;
  pendingCount: number;
}

export function BulkApproveButton({ organizationId, pendingCount }: Props) {
  const [state, setState] = useState<"idle" | "confirming" | "loading">("idle");
  const [result, setResult] = useState<{ approved?: number; skipped?: number; error?: string | null } | null>(null);

  async function handleConfirm() {
    setState("loading");
    const res = await approveAllLinkRequests(organizationId);
    setResult(res);
    setState("idle");
  }

  if (result) {
    return (
      <div className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${result.error ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#dcfce7] text-[#16a34a]"}`}>
        {result.error
          ? result.error
          : `Approved ${result.approved} request${result.approved !== 1 ? "s" : ""}${result.skipped ? ` (${result.skipped} skipped — limit reached)` : ""}`}
        <button onClick={() => setResult(null)} className="ml-1 opacity-60 hover:opacity-100 text-lg leading-none">&times;</button>
      </div>
    );
  }

  if (state === "confirming") {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="text-sm text-[#64748b]">Approve all {pendingCount} requests?</span>
        <button
          onClick={handleConfirm}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors"
        >
          Yes, approve all
        </button>
        <button
          onClick={() => setState("idle")}
          className="text-sm px-3 py-1.5 rounded-lg bg-[#f1f5f9] text-[#374151] hover:bg-[#e2e8f0] transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setState("confirming")}
      disabled={state === "loading"}
      className="text-sm font-medium px-3 py-1.5 rounded-lg border border-[#16a34a] text-[#16a34a] hover:bg-[#f0fdf4] transition-colors disabled:opacity-50"
    >
      Approve all ({pendingCount})
    </button>
  );
}
