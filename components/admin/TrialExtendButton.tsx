"use client";

import { useState, useTransition } from "react";
import { extendTrial } from "@/app/(admin)/admin/professionals/actions";

export default function TrialExtendButton({ authId, currentTrialEnd }: {
  authId: string;
  currentTrialEnd: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(7);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const isActive = currentTrialEnd && new Date(currentTrialEnd) > new Date();

  function handleExtend() {
    startTransition(async () => {
      const result = await extendTrial(authId, days);
      if (result.error) setError(result.error);
      else { setDone(true); setTimeout(() => { setOpen(false); setDone(false); }, 1200); }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#1a56a0] hover:underline whitespace-nowrap"
        title={isActive ? `Trial ends ${new Date(currentTrialEnd!).toLocaleDateString()}` : "No active trial"}
      >
        {isActive ? `Trial ${Math.ceil((new Date(currentTrialEnd!).getTime() - Date.now()) / 86400000)}d` : "Add trial"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        className="text-xs border border-[#e2e8f0] rounded px-1.5 py-1 bg-white"
        disabled={isPending}
      >
        {[7, 14, 30].map((d) => (
          <option key={d} value={d}>+{d}d</option>
        ))}
      </select>
      <button
        onClick={handleExtend}
        disabled={isPending}
        className="text-xs font-semibold text-[#16a34a] hover:underline disabled:opacity-50"
      >
        {isPending ? "…" : done ? "Done ✓" : "Extend"}
      </button>
      <button
        onClick={() => { setOpen(false); setError(null); }}
        className="text-xs text-[#94a3b8] hover:text-[#64748b]"
      >
        ✕
      </button>
      {error && <span className="text-[10px] text-[#dc2626]">{error}</span>}
    </div>
  );
}
