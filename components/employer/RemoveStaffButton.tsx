"use client";

import { useState } from "react";
import { removeStaffLink } from "@/app/(employer)/employer/actions";

export default function RemoveStaffButton({
  linkId,
  staffName,
}: {
  linkId: string;
  staffName: string;
}) {
  const [phase, setPhase] = useState<"idle" | "confirm" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setPhase("loading");
    setError(null);
    const result = await removeStaffLink(linkId);
    if (result?.error) {
      setError(result.error);
      setPhase("confirm");
    } else {
      setPhase("done");
    }
  }

  if (phase === "done") {
    return <span className="text-xs text-[#64748b]">Removed</span>;
  }

  if (phase === "confirm" || phase === "loading") {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-[#374151]">
          Remove <span className="font-semibold">{staffName}</span> from your roster?
        </p>
        {error && <p className="text-xs text-[#dc2626]">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={() => { setPhase("idle"); setError(null); }}
            disabled={phase === "loading"}
            className="text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={phase === "loading"}
            className="text-xs px-2.5 py-1.5 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] disabled:opacity-50 transition-colors"
          >
            {phase === "loading" ? "Removing…" : "Confirm Remove"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setPhase("confirm")}
      className="text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
    >
      Remove
    </button>
  );
}
