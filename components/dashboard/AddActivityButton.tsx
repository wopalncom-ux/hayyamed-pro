"use client";

import { useState } from "react";
import AddActivityModal from "./AddActivityModal";
import type { Plan } from "@/lib/planUtils";

interface CategoryCapData { max: number | null; earned: number }

export default function AddActivityButton({
  walletId,
  plan = "free",
  countryCode = "QA",
  categoryCapData = {},
}: {
  walletId: string;
  plan?: Plan;
  countryCode?: string;
  categoryCapData?: Record<string, CategoryCapData>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
      >
        + Log Activity
      </button>
      {open && (
        <AddActivityModal
          walletId={walletId}
          plan={plan}
          countryCode={countryCode}
          categoryCapData={categoryCapData}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
