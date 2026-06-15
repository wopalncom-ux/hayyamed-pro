"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddActivityModal from "./AddActivityModal";
import type { Plan } from "@/lib/planUtils";

export default function CmeDashboardQuickAddButton({
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
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors flex-shrink-0"
        aria-label="Log a CME activity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Log CME
      </button>
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
