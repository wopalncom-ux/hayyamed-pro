"use client";

import { useState } from "react";
import AddActivityModal from "./AddActivityModal";
import type { Plan } from "@/lib/planUtils";

export default function AddActivityButton({ walletId, plan = "free" }: { walletId: string; plan?: Plan }) {
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
        <AddActivityModal walletId={walletId} plan={plan} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
