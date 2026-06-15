"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddActivityModal from "./AddActivityModal";
import type { Plan } from "@/lib/planUtils";

export default function CmeFirstActivityPrompt({
  walletId,
  plan,
  countryCode,
}: {
  walletId: string;
  plan: Plan;
  countryCode: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleClose() {
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="rounded-xl border border-[#bfdbfe] bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-base">
              ✦
            </div>
            <div>
              <p className="text-sm font-bold text-[#1e3a5f]">
                Log your first CME activity
              </p>
              <p className="text-xs text-[#3b6594] mt-0.5">
                Start tracking credits toward your renewal requirement.
                Your first activity activates your compliance timeline.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#1a56a0] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Log activity
          </button>
        </div>
      </div>
      {open && (
        <AddActivityModal
          walletId={walletId}
          plan={plan}
          countryCode={countryCode}
          onClose={handleClose}
        />
      )}
    </>
  );
}
