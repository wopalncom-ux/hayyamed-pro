"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CREDIT_TYPES = ["CME", "CPD", "PDU", "CE"];

const PROFESSION_SUGGESTIONS = [
  "all", "physician", "nurse", "pharmacist", "dentist", "allied_health",
  "midwife", "physiotherapist", "radiographer", "lab_technician",
  "optometrist", "dietitian", "psychologist", "occupational_therapist",
];

interface Props {
  countryCode: string;
}

export default function AddProfessionRuleForm({ countryCode }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    profession_code: "",
    cycle_years: 2,
    total_credits_required: 40,
    credit_terminology: "CME",
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
    if (!form.profession_code.trim()) {
      setError("Profession code is required");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/country-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country_code: countryCode, ...form }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create rule");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  const inputClass =
    "w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors";
  const labelClass = "block text-xs font-medium text-[#374151] mb-1";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-[#1a56a0] border border-[#1a56a0]/30 bg-[#eff6ff] px-3.5 py-2 rounded-lg hover:bg-[#dbeafe] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add profession rule
      </button>
    );
  }

  return (
    <div className="bg-[#eff6ff]/50 border border-[#1a56a0]/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#111]">New profession rule — {countryCode}</h3>
        <button
          onClick={() => { setOpen(false); setError(null); }}
          className="text-[#64748b] hover:text-[#111] text-xs"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Profession code */}
          <div className="sm:col-span-1">
            <label className={labelClass}>Profession code *</label>
            <input
              list="prof-suggestions"
              className={inputClass}
              placeholder="e.g. physician, nurse, all"
              value={form.profession_code}
              onChange={(e) => set("profession_code", e.target.value)}
              required
            />
            <datalist id="prof-suggestions">
              {PROFESSION_SUGGESTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
            <p className="text-[10px] text-[#94a3b8] mt-1">Use "all" to apply to every profession</p>
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

          {/* Grace period */}
          <div>
            <label className={labelClass}>Grace period (days)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.grace_period_days}
              onChange={(e) => set("grace_period_days", Number(e.target.value))}
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

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 mb-4">
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

        {/* Notes */}
        <div className="mb-4">
          <label className={labelClass}>Notes (optional)</label>
          <input
            className={inputClass}
            placeholder="Source citation, special conditions…"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-[#dc2626] mb-3">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
          >
            {loading ? "Creating…" : "Create rule"}
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
