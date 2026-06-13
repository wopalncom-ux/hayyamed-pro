"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CREDIT_TYPES = ["CME", "CPD", "PDU", "CE"];

export default function AddCountryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    country_code: "",
    profession_code: "all",
    credit_terminology: "CME",
    cycle_years: 2,
    total_credits_required: 40,
    online_credits_max_pct: 50,
    mandatory_credits_min: 0,
    self_reported_allowed: true,
    grace_period_days: 30,
    employer_report_required: false,
    notes: "",
    effective_from: new Date().toISOString().slice(0, 10),
  });

  function set(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/country-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create country");
      return;
    }

    setOpen(false);
    // Navigate to the new country's detail page
    router.push(`/admin/country-rules/${encodeURIComponent(form.country_code.trim().toUpperCase())}`);
    router.refresh();
  }

  const inputClass =
    "w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors";
  const labelClass = "block text-xs font-medium text-[#374151] mb-1";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add new country
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#1a56a0]/20 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#111]">Add new country</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Creates the first compliance rule for this country. Add more profession rules from the country detail page.
          </p>
        </div>
        <button
          onClick={() => { setOpen(false); setError(null); }}
          className="text-[#64748b] hover:text-[#111]"
          aria-label="Cancel"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Country code */}
          <div>
            <label className={labelClass}>Country code *</label>
            <input
              className={inputClass}
              placeholder="e.g. GB, IN, AU, AE-DU"
              value={form.country_code}
              onChange={(e) => set("country_code", e.target.value.toUpperCase())}
              maxLength={6}
              required
            />
            <p className="text-[10px] text-[#94a3b8] mt-1">ISO 3166-1 alpha-2 or sub-code</p>
          </div>

          {/* Profession code */}
          <div>
            <label className={labelClass}>Default profession</label>
            <input
              className={inputClass}
              placeholder="all"
              value={form.profession_code}
              onChange={(e) => set("profession_code", e.target.value)}
            />
            <p className="text-[10px] text-[#94a3b8] mt-1">Usually "all" for first rule</p>
          </div>

          {/* Credit terminology */}
          <div>
            <label className={labelClass}>Credit type</label>
            <select
              className={inputClass}
              value={form.credit_terminology}
              onChange={(e) => set("credit_terminology", e.target.value)}
            >
              {CREDIT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Cycle years */}
          <div>
            <label className={labelClass}>Renewal cycle (years)</label>
            <input
              type="number"
              min={1}
              max={5}
              className={inputClass}
              value={form.cycle_years}
              onChange={(e) => set("cycle_years", Number(e.target.value))}
            />
          </div>

          {/* Total credits */}
          <div>
            <label className={labelClass}>Total credits required</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={form.total_credits_required}
              onChange={(e) => set("total_credits_required", Number(e.target.value))}
            />
          </div>

          {/* Online max % */}
          <div>
            <label className={labelClass}>Online max %</label>
            <input
              type="number"
              min={0}
              max={100}
              className={inputClass}
              value={form.online_credits_max_pct}
              onChange={(e) => set("online_credits_max_pct", Number(e.target.value))}
            />
          </div>

          {/* Mandatory min */}
          <div>
            <label className={labelClass}>Mandatory min credits</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.mandatory_credits_min}
              onChange={(e) => set("mandatory_credits_min", Number(e.target.value))}
            />
          </div>

          {/* Effective from */}
          <div>
            <label className={labelClass}>Effective from</label>
            <input
              type="date"
              className={inputClass}
              value={form.effective_from}
              onChange={(e) => set("effective_from", e.target.value)}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className={labelClass}>Authority / source notes (optional)</label>
          <input
            className={inputClass}
            placeholder="e.g. UK GMC/NMC CPD framework — 50 CPD credits per year"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 mb-5">
          <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer">
            <input
              type="checkbox"
              checked={form.self_reported_allowed}
              onChange={(e) => set("self_reported_allowed", e.target.checked)}
              className="w-4 h-4 accent-[#1a56a0]"
            />
            Self-reported credits allowed
          </label>
          <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer">
            <input
              type="checkbox"
              checked={form.employer_report_required}
              onChange={(e) => set("employer_report_required", e.target.checked)}
              className="w-4 h-4 accent-[#1a56a0]"
            />
            Employer report required
          </label>
        </div>

        {error && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-2.5 text-sm text-[#dc2626] mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
          >
            {loading ? "Creating…" : "Create country & open detail page →"}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(null); }}
            className="text-sm text-[#64748b] hover:text-[#111]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
