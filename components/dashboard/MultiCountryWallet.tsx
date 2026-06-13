"use client";

import { useState, useTransition } from "react";
import { addCountryWallet, removeSecondaryWallet } from "@/app/(dashboard)/dashboard/settings/actions";

type Wallet = {
  id: string;
  country: string;
  profession: string;
  required_credits: number;
  completed_credits: number;
  compliance_status: string;
  cycle_end_date: string | null;
  is_primary: boolean;
  label: string | null;
};

const COUNTRIES = [
  { code: "QA", name: "Qatar (QCHP / DHP-AS)", credits: 80, cycle: 2 },
  { code: "SA", name: "Saudi Arabia (SCFHS)", credits: 60, cycle: 1 },
  { code: "AE-DU", name: "UAE — Dubai (DHA)", credits: 40, cycle: 2 },
  { code: "AE-AZ", name: "UAE — Abu Dhabi (DOH)", credits: 40, cycle: 2 },
  { code: "KW", name: "Kuwait (MOH)", credits: 30, cycle: 1 },
  { code: "BH", name: "Bahrain (NHRA)", credits: 40, cycle: 2 },
  { code: "OM", name: "Oman (OMSB)", credits: 40, cycle: 2 },
  { code: "GB", name: "United Kingdom (GMC / NMC)", credits: 50, cycle: 1 },
  { code: "IN", name: "India (NMC)", credits: 30, cycle: 5 },
  { code: "AU", name: "Australia (AHPRA)", credits: 40, cycle: 1 },
];

const STATUS_COLOR: Record<string, string> = {
  compliant: "text-[#16a34a]",
  at_risk: "text-[#d97706]",
  non_compliant: "text-[#dc2626]",
};

export default function MultiCountryWallet({
  wallets,
  primaryProfession,
}: {
  wallets: Wallet[];
  primaryProfession: string;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cycleStart, setCycleStart] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const existingCountries = new Set(wallets.map((w) => w.country));

  const countryDef = COUNTRIES.find((c) => c.name === selectedCountry);
  const cycleYears = countryDef?.cycle ?? 1;
  const cycleEnd = cycleStart
    ? new Date(new Date(cycleStart).setFullYear(new Date(cycleStart).getFullYear() + cycleYears))
        .toISOString()
        .split("T")[0]
    : "";

  function handleAdd() {
    if (!countryDef || !cycleStart || !cycleEnd) return;
    setError(null);
    startTransition(async () => {
      const res = await addCountryWallet({
        country: selectedCountry,
        profession: primaryProfession,
        specialty: null,
        required_credits: countryDef.credits,
        cycle_start_date: cycleStart,
        cycle_end_date: cycleEnd,
      });
      if (res.error === "upgrade_required") {
        setShowAdd(false);
        setShowUpgradePrompt(true);
      } else if (res.error) {
        setError(res.error);
      } else {
        setShowAdd(false);
        setSelectedCountry("");
      }
    });
  }

  function handleRemove(walletId: string) {
    startTransition(async () => {
      await removeSecondaryWallet(walletId);
    });
  }

  const secondary = wallets.filter((w) => !w.is_primary);
  const available = COUNTRIES.filter((c) => !existingCountries.has(c.name));

  return (
    <div>
      {secondary.length > 0 && (
        <div className="space-y-3 mb-4">
          {secondary.map((w) => {
            const pct = Math.min(Math.round((w.completed_credits / w.required_credits) * 100), 100);
            return (
              <div key={w.id} className="flex items-center justify-between py-3 border border-[#e2e8f0] rounded-lg px-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#111]">{w.label ?? w.country}</p>
                    <span className={`text-xs font-medium ${STATUS_COLOR[w.compliance_status] ?? "text-[#64748b]"}`}>
                      {w.compliance_status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {w.completed_credits}/{w.required_credits} credits ({pct}%)
                    {w.cycle_end_date && ` · Renewal ${w.cycle_end_date}`}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(w.id)}
                  disabled={isPending}
                  className="text-xs text-[#dc2626] hover:text-[#b91c1c] disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {secondary.length === 0 && !showAdd && (
        <p className="text-sm text-[#64748b] mb-4">No secondary countries added.</p>
      )}

      {showAdd ? (
        <div className="border border-[#e2e8f0] rounded-lg p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1">Country / Authority</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30"
            >
              <option value="">Select country…</option>
              {available.map((c) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          {countryDef && (
            <p className="text-xs text-[#64748b]">
              Requires <strong>{countryDef.credits} credits</strong> every {countryDef.cycle} year{countryDef.cycle > 1 ? "s" : ""}.
            </p>
          )}
          <div>
            <label className="text-xs font-medium text-[#374151] block mb-1">Cycle start date</label>
            <input
              type="date"
              value={cycleStart}
              onChange={(e) => setCycleStart(e.target.value)}
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30"
            />
          </div>
          {cycleEnd && (
            <p className="text-xs text-[#64748b]">Renewal deadline: <strong>{cycleEnd}</strong></p>
          )}
          {error && <p className="text-xs text-[#dc2626]">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!selectedCountry || !cycleStart || isPending}
              className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1547a0] transition-colors disabled:opacity-50"
            >
              {isPending ? "Adding…" : "Add country"}
            </button>
            <button
              onClick={() => { setShowAdd(false); setError(null); }}
              className="text-sm text-[#64748b] px-3 py-2 rounded-lg hover:text-[#111] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : available.length > 0 ? (
        <>
          <button
            onClick={() => { setShowUpgradePrompt(false); setShowAdd(true); }}
            className="text-sm text-[#1a56a0] hover:underline font-medium"
          >
            + Add another country
          </button>

          {showUpgradePrompt && (
            <div className="mt-4 bg-gradient-to-br from-[#eff6ff] to-[#f0fdf4] border border-[#bfdbfe] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111] mb-0.5">Pro required for multiple countries</p>
                  <p className="text-xs text-[#64748b] mb-3">
                    Track compliance across Qatar, UAE, Saudi Arabia and more with a Pro plan.
                    Free accounts are limited to one country.
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href="/pricing?source=multi_country_wallet"
                      className="text-xs font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
                    >
                      Upgrade to Pro →
                    </a>
                    <button
                      onClick={() => setShowUpgradePrompt(false)}
                      className="text-xs text-[#64748b] hover:text-[#111] transition-colors"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-[#64748b]">All supported countries are already tracked.</p>
      )}
    </div>
  );
}
