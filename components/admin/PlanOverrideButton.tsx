"use client";

import { useState, useTransition } from "react";
import { overrideUserPlan } from "@/app/(admin)/admin/professionals/actions";

const PLANS = ["free", "pro", "employer"] as const;
type Plan = (typeof PLANS)[number];

const EMPLOYER_TIERS = ["clinic", "growth", "department", "hospital"] as const;

interface Props {
  authId: string;
  currentPlan: string | null;
}

export default function PlanOverrideButton({ authId, currentPlan }: Props) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<Plan>((currentPlan as Plan) ?? "free");
  const [tier, setTier] = useState("clinic");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleSubmit() {
    startTransition(async () => {
      await overrideUserPlan(authId, plan, plan === "employer" ? tier : null);
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); }, 1200);
    });
  }

  const planColor: Record<string, string> = {
    free:     "bg-[#f1f5f9] text-[#64748b]",
    pro:      "bg-[#e8f0fe] text-[#1a56a0]",
    employer: "bg-[#fff7ed] text-[#d97706]",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${planColor[currentPlan ?? "free"] ?? planColor.free}`}
      >
        {currentPlan ?? "free"}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="absolute right-0 top-8 z-50 bg-white rounded-xl border border-[#e2e8f0] shadow-xl shadow-black/10 p-4 w-56">
            <p className="text-xs font-semibold text-[#111] mb-3">Override Plan</p>

            <label className="block text-[10px] text-[#64748b] uppercase tracking-wide mb-1">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as Plan)}
              className="w-full text-xs border border-[#e2e8f0] rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
            >
              {PLANS.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>

            {plan === "employer" && (
              <>
                <label className="block text-[10px] text-[#64748b] uppercase tracking-wide mb-1">Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full text-xs border border-[#e2e8f0] rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
                >
                  {EMPLOYER_TIERS.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={isPending || done}
              className={`w-full text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                done
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : "bg-[#1a56a0] text-white hover:bg-[#1547a0] disabled:opacity-60"
              }`}
            >
              {done ? "Saved ✓" : isPending ? "Saving…" : "Save override"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
