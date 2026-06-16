"use client";

import { useState, useTransition } from "react";
import { suspendAccount, unsuspendAccount } from "@/app/(admin)/admin/professionals/actions";

export default function SuspendAccountButton({
  authId,
  isSuspended,
  suspendedReason,
}: {
  authId: string;
  isSuspended: boolean;
  suspendedReason: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSuspend() {
    if (!reason.trim()) { setError("Reason is required"); return; }
    setError(null);
    startTransition(async () => {
      const res = await suspendAccount(authId, reason);
      if (res?.error) { setError(res.error); return; }
      setOpen(false);
      setReason("");
    });
  }

  function handleUnsuspend() {
    setError(null);
    startTransition(async () => {
      const res = await unsuspendAccount(authId);
      if (res?.error) setError(res.error);
    });
  }

  if (isSuspended) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#dc2626] font-medium">
          Suspended{suspendedReason ? `: ${suspendedReason}` : ""}
        </span>
        {error && <p className="text-xs text-[#dc2626]">{error}</p>}
        <button
          disabled={isPending}
          onClick={handleUnsuspend}
          className="text-sm px-3 py-1.5 rounded bg-[#16a34a] text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? "Unsuspending…" : "Unsuspend account"}
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-3 py-1.5 rounded border border-[#dc2626] text-[#dc2626] hover:bg-red-50"
      >
        Suspend account
      </button>
    );
  }

  return (
    <div className="border border-[#fecaca] rounded-xl p-4 bg-[#fff5f5] space-y-3 min-w-[280px]">
      <p className="text-sm font-semibold text-[#dc2626]">Suspend this account?</p>
      <p className="text-xs text-[#64748b]">
        All active sessions will be immediately invalidated. The user will not be able to sign in until unsuspended.
      </p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for suspension (required)"
        rows={2}
        className="w-full text-sm px-3 py-2 border border-[#e2e8f0] rounded-lg resize-none focus:outline-none focus:border-[#dc2626]"
      />
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
      <div className="flex gap-2">
        <button
          disabled={isPending}
          onClick={() => { setOpen(false); setReason(""); setError(null); }}
          className="flex-1 text-sm px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          disabled={isPending || !reason.trim()}
          onClick={handleSuspend}
          className="flex-1 text-sm px-3 py-1.5 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Suspending…" : "Suspend"}
        </button>
      </div>
    </div>
  );
}
