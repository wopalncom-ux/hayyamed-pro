"use client";

import { useState } from "react";

interface CountryRule {
  country_code: string;
  country_name: string;
  total_credits_required: number;
  credit_terminology: string;
  cycle_years: number;
  online_credits_max_pct: number | null;
  mandatory_credits_min: number | null;
}

const PROFESSIONS = [
  "Physician",
  "Nurse",
  "Pharmacist",
  "Dentist",
  "Allied Health Professional",
  "Paramedic",
];

const FLAG: Record<string, string> = {
  QA: "🇶🇦",
  SA: "🇸🇦",
  AE: "🇦🇪",
  KW: "🇰🇼",
  BH: "🇧🇭",
  OM: "🇴🇲",
};

export default function CompareToolClient({ rules }: { rules: CountryRule[] }) {
  const [selectedProfession, setSelectedProfession] = useState("Physician");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    rules.slice(0, 4).map((r) => r.country_code)
  );

  function toggleCountry(code: string) {
    setSelectedCountries((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < 6
        ? [...prev, code]
        : prev
    );
  }

  const filtered = rules.filter((r) => selectedCountries.includes(r.country_code));

  return (
    <div>
      {/* Profession selector */}
      <div className="mb-6">
        <label htmlFor="profession-select" className="block text-sm font-semibold text-[#111] mb-2">
          Your profession
        </label>
        <select
          id="profession-select"
          value={selectedProfession}
          onChange={(e) => setSelectedProfession(e.target.value)}
          className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a56a0] bg-white"
        >
          {PROFESSIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <p className="text-xs text-[#64748b] mt-1">
          Note: Requirements shown are the standard cycle totals. Profession-specific minimums may apply — verify with your authority.
        </p>
      </div>

      {/* Country toggle chips */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#111] mb-2">
          Select countries to compare <span className="font-normal text-[#64748b]">(up to 6)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {rules.map((r) => (
            <button
              key={r.country_code}
              onClick={() => toggleCountry(r.country_code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCountries.includes(r.country_code)
                  ? "bg-[#1a56a0] text-white border-[#1a56a0]"
                  : "bg-white text-[#374151] border-[#e2e8f0] hover:border-[#1a56a0]"
              }`}
            >
              <span>{FLAG[r.country_code] ?? "🌍"}</span>
              {r.country_name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      {filtered.length === 0 ? (
        <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-8 text-center">
          <p className="text-sm text-[#64748b]">Select at least one country above to see requirements.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide w-44">
                  Requirement
                </th>
                {filtered.map((r) => (
                  <th key={r.country_code} className="text-center px-4 py-3">
                    <div className="text-lg">{FLAG[r.country_code] ?? "🌍"}</div>
                    <div className="text-xs font-semibold text-[#111] mt-0.5">{r.country_name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              <TableRow
                label="Credits required"
                values={filtered.map((r) => (
                  <div key={r.country_code} className="text-center">
                    <span className="text-xl font-bold text-[#1a56a0]">{r.total_credits_required}</span>
                    <span className="text-xs text-[#64748b] block">{r.credit_terminology}</span>
                  </div>
                ))}
              />
              <TableRow
                label="Renewal cycle"
                values={filtered.map((r) => (
                  <div key={r.country_code} className="text-center font-medium text-[#111]">
                    {r.cycle_years} {r.cycle_years === 1 ? "year" : "years"}
                  </div>
                ))}
              />
              <TableRow
                label="Credits/year (avg)"
                values={filtered.map((r) => (
                  <div key={r.country_code} className="text-center font-medium text-[#374151]">
                    {Math.round(r.total_credits_required / r.cycle_years)}
                  </div>
                ))}
              />
              <TableRow
                label="Online credit cap"
                values={filtered.map((r) => (
                  <div key={r.country_code} className="text-center">
                    {r.online_credits_max_pct != null ? (
                      <span className="font-medium text-[#374151]">Max {r.online_credits_max_pct}%</span>
                    ) : (
                      <span className="text-[#64748b]">No limit</span>
                    )}
                  </div>
                ))}
              />
              <TableRow
                label="Mandatory minimum"
                values={filtered.map((r) => (
                  <div key={r.country_code} className="text-center">
                    {r.mandatory_credits_min ? (
                      <span className="font-medium text-[#374151]">{r.mandatory_credits_min} cr</span>
                    ) : (
                      <span className="text-[#64748b]">None</span>
                    )}
                  </div>
                ))}
              />
              <TableRow
                label="Terminology"
                values={filtered.map((r) => (
                  <div key={r.country_code} className="text-center text-xs font-medium text-[#64748b]">
                    {r.credit_terminology}
                  </div>
                ))}
              />
            </tbody>
          </table>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 bg-[#0f1f3d] rounded-2xl p-6 text-center">
        <h3 className="text-white text-lg font-bold mb-2">Track your {selectedProfession} CME across all countries</h3>
        <p className="text-[#64748b] text-sm mb-4">
          Hayya Med Pro automatically calculates your compliance gap for every GCC authority you hold a license in.
          Free to start — no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#0f1f3d] text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#f0f4f8] transition-colors"
          >
            Create free account →
          </a>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center text-sm text-[#64748b] hover:text-white transition-colors"
          >
            See Pro features
          </a>
        </div>
      </div>
    </div>
  );
}

function TableRow({ label, values }: { label: string; values: React.ReactNode[] }) {
  return (
    <tr>
      <td className="px-4 py-3.5 text-xs font-semibold text-[#64748b] align-middle">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3.5 align-middle">{v}</td>
      ))}
    </tr>
  );
}
