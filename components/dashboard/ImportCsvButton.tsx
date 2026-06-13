"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Plan } from "@/lib/planUtils";

const ImportCsvModal = dynamic(() => import("./ImportCsvModal"), { ssr: false });

export default function ImportCsvButton({
  walletId,
  plan,
  existingCount,
}: {
  walletId: string;
  plan: Plan;
  existingCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors flex items-center gap-1.5"
        title="Import activities from a CSV file"
      >
        <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 11l3 3m0 0l3-3m-3 3V4" />
        </svg>
        Import CSV
      </button>

      {open && (
        <ImportCsvModal
          walletId={walletId}
          plan={plan}
          existingCount={existingCount}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
