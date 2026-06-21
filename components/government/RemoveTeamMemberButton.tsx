"use client";

import { useState, useTransition } from "react";
import { removeTeamMember } from "@/app/(government)/government/actions";

export default function RemoveTeamMemberButton({
  memberId,
  organizationId,
}: {
  memberId: string;
  organizationId: string;
}) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#fef2f2] hover:text-[#dc2626] hover:border-[#fecaca] transition-colors"
      >
        Remove
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-[#dc2626]">{error}</span>}
      <span className="text-xs text-[#374151]">Remove?</span>
      <button
        onClick={() => setConfirm(false)}
        className="text-xs px-2 py-1 border border-[#e2e8f0] rounded text-[#64748b] hover:bg-[#f8fafc] transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          startTransition(async () => {
            setError(null);
            const result = await removeTeamMember(memberId, organizationId);
            if (result?.error) setError(result.error);
          });
        }}
        disabled={isPending}
        className="text-xs px-2 py-1 bg-[#dc2626] text-white rounded hover:bg-[#b91c1c] disabled:opacity-50 transition-colors"
      >
        {isPending ? "…" : "Confirm"}
      </button>
    </div>
  );
}
