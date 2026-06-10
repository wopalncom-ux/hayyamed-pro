"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Authority {
  id: string;
  abbreviation: string;
  authority_name: string;
}

interface Rule {
  id: string;
  country_code: string;
  profession_code: string;
  cycle_years: number;
  total_credits_required: number;
  credit_terminology: string;
  online_credits_max_pct: number;
  mandatory_credits_min: number;
  self_reported_allowed: boolean;
  grace_period_days: number;
  employer_report_required: boolean;
  employer_report_format: string | null;
  notes: string | null;
  effective_from: string;
  effective_to: string | null;
  authority_id: string | null;
}

interface Props {
  rule: Rule;
  authorities: Authority[];
}

const CREDIT_TYPES = ["CME", "CPD", "PDU", "CE"];

export default function CountryRuleForm({ rule, authorities }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    authority_id: rule.authority_id ?? "",
    cycle_years: rule.cycle_years,
    total_credits_required: rule.total_credits_required,
    credit_terminology: rule.credit_terminology,
    online_credits_max_pct: rule.online_credits_max_pct,
    mandatory_credits_min: rule.mandatory_credits_min,
    self_reported_allowed: rule.self_reported_allowed,
    grace_period_days: rule.grace_period_days,
    employer_report_required: rule.employer_report_required,
    employer_report_format: rule.employer_report_format ?? "",
    notes: rule.notes ?? "",
    effective_from: rule.effective_from,
    effective_to: rule.effective_to ?? "",
  });

  function setField(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const res = await fetch(`/api/admin/country-rules/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        authority_id: form.authority_id || null,
        employer_report_format: form.employer_report_format || null,
        notes: form.notes || null,
        effective_to: form.effective_to || null,
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Save failed");
    } else {
      setSaved(true);
      router.refresh();
    }
  }

  const inputClass = "w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors";
  const labelClass = "block text-xs font-medium text-[#374151] mb-1";

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
      {/* Header row — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#f8fafc] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-sm font-semibold text-[#111]">
              {rule.profession_code === "all" ? "All Professions (Default)" : rule.profession_code}
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              {rule.total_credits_required} {rule.credit_terminology} · {rule.cycle_years}yr cycle · {rule.online_credits_max_pct}% online max
              {rule.mandatory_credits_min > 0 && ` · ${rule.mandatory_credits_min} mandatory min`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-[#16a34a] font-medium">Saved</span>}
          <span className="text-xs text-[#94a3b8]">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <form onSubmit={handleSave} className="px-6 pb-6 border-t border-[#f1f5f9]">
          <div className="pt-5 space-y-4">
            {/* Credits + cycle */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Total Credits *</label>
                <input type="number" min="1" className={inputClass} value={form.total_credits_required}
                  onChange={(e) => setField("total_credits_required", Number(e.target.value))} />
              </div>
              <div>
                <label className={labelClass}>Credit Type</label>
                <select className={inputClass} value={form.credit_terminology}
                  onChange={(e) => setField("credit_terminology", e.target.value)}>
                  {CREDIT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Cycle (years) *</label>
                <input type="number" min="1" max="10" className={inputClass} value={form.cycle_years}
                  onChange={(e) => setField("cycle_years", Number(e.target.value))} />
              </div>
              <div>
                <label className={labelClass}>Grace Period (days)</label>
                <input type="number" min="0" className={inputClass} value={form.grace_period_days}
                  onChange={(e) => setField("grace_period_days", Number(e.target.value))} />
              </div>
            </div>

            {/* Online + mandatory */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Online Credits Max (%)</label>
                <input type="number" min="0" max="100" className={inputClass} value={form.online_credits_max_pct}
                  onChange={(e) => setField("online_credits_max_pct", Number(e.target.value))} />
              </div>
              <div>
                <label className={labelClass}>Mandatory Min Credits</label>
                <input type="number" min="0" className={inputClass} value={form.mandatory_credits_min}
                  onChange={(e) => setField("mandatory_credits_min", Number(e.target.value))} />
              </div>
            </div>

            {/* Authority */}
            <div>
              <label className={labelClass}>Licensing Authority</label>
              <select className={inputClass} value={form.authority_id}
                onChange={(e) => setField("authority_id", e.target.value)}>
                <option value="">— None —</option>
                {authorities.map((a) => (
                  <option key={a.id} value={a.id}>{a.abbreviation} — {a.authority_name}</option>
                ))}
              </select>
            </div>

            {/* Booleans */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer">
                <input type="checkbox" checked={form.self_reported_allowed}
                  onChange={(e) => setField("self_reported_allowed", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#1a56a0]" />
                Self-reported activities allowed
              </label>
              <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer">
                <input type="checkbox" checked={form.employer_report_required}
                  onChange={(e) => setField("employer_report_required", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#1a56a0]" />
                Employer report required
              </label>
            </div>

            {form.employer_report_required && (
              <div>
                <label className={labelClass}>Employer Report Format</label>
                <input className={inputClass} placeholder="e.g. SCFHS Annual Report" value={form.employer_report_format}
                  onChange={(e) => setField("employer_report_format", e.target.value)} />
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Effective From</label>
                <input type="date" className={inputClass} value={form.effective_from}
                  onChange={(e) => setField("effective_from", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Effective To</label>
                <input type="date" className={inputClass} value={form.effective_to}
                  onChange={(e) => setField("effective_to", e.target.value)} placeholder="Leave blank = no expiry" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>Notes</label>
              <textarea className={`${inputClass} resize-none`} rows={2} value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Internal notes about this rule…" />
            </div>

            {error && (
              <p className="text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1a56a0] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#1547a0] transition-colors disabled:opacity-60"
              >
                {loading ? "Saving…" : "Save Rule"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
