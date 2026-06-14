"use client";

import { useState, Suspense, lazy } from "react";

const CancelSubscriptionModal = lazy(() => import("./CancelSubscriptionModal"));

export default function CancelSubscriptionButton({
  currentPeriodEnd,
}: {
  currentPeriodEnd: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#64748b] hover:text-[#dc2626] transition-colors underline"
      >
        Cancel or pause
      </button>
      {open && (
        <Suspense fallback={null}>
          <CancelSubscriptionModal
            currentPeriodEnd={currentPeriodEnd}
            onClose={() => setOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
