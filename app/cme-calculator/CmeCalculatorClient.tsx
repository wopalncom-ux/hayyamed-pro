"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── Rules engine (mirrors DB country_compliance_rules) ───────────────────────
type ProfessionKey = "physician" | "nurse" | "pharmacist" | "dentist" | "allied";
type CountryKey = "qchp" | "scfhs" | "dha" | "doh" | "moh_kuwait" | "nhra" | "omsb";

interface CountryRule {
  name: string;
  authority: string;
  flag: string;
  terminology: "CME" | "CPD";
  cycleMonths: number;
  href: string;
  professions: Record<ProfessionKey, number>;
}

const RULES: Record<CountryKey, CountryRule> = {
  qchp: {
    name: "Qatar",
    authority: "QCHP",
    flag: "🇶🇦",
    terminology: "CPD",
    cycleMonths: 24,
    href: "/qchp",
    professions: { physician: 80, nurse: 80, pharmacist: 80, dentist: 80, allied: 80 },
  },
  scfhs: {
    name: "Saudi Arabia",
    authority: "SCFHS",
    flag: "🇸🇦",
    terminology: "CME",
    cycleMonths: 12,
    href: "/scfhs",
    professions: { physician: 60, nurse: 30, pharmacist: 60, dentist: 60, allied: 30 },
  },
  dha: {
    name: "UAE — Dubai",
    authority: "DHA",
    flag: "🇦🇪",
    terminology: "CME",
    cycleMonths: 24,
    href: "/dha",
    professions: { physician: 40, nurse: 40, pharmacist: 40, dentist: 40, allied: 40 },
  },
  doh: {
    name: "UAE — Abu Dhabi",
    authority: "DOH",
    flag: "🇦🇪",
    terminology: "CPD",
    cycleMonths: 24,
    href: "/doh",
    professions: { physician: 50, nurse: 40, pharmacist: 40, dentist: 40, allied: 30 },
  },
  moh_kuwait: {
    name: "Kuwait",
    authority: "MOH",
    flag: "🇰🇼",
    terminology: "CME",
    cycleMonths: 12,
    href: "/moh-kuwait",
    professions: { physician: 30, nurse: 30, pharmacist: 30, dentist: 30, allied: 30 },
  },
  nhra: {
    name: "Bahrain",
    authority: "NHRA",
    flag: "🇧🇭",
    terminology: "CPD",
    cycleMonths: 24,
    href: "/nhra",
    professions: { physician: 40, nurse: 40, pharmacist: 40, dentist: 40, allied: 40 },
  },
  omsb: {
    name: "Oman",
    authority: "OMSB",
    flag: "🇴🇲",
    terminology: "CME",
    cycleMonths: 24,
    href: "/omsb",
    professions: { physician: 40, nurse: 30, pharmacist: 40, dentist: 40, allied: 40 },
  },
};

const PROFESSION_LABELS: Record<ProfessionKey, string> = {
  physician: "Physician / Doctor",
  nurse: "Nurse / Midwife",
  pharmacist: "Pharmacist",
  dentist: "Dentist",
  allied: "Allied Health Professional",
};

function getStatus(pct: number, weeksLeft: number | null): "compliant" | "on_track" | "at_risk" | "urgent" {
  if (pct >= 100) return "compliant";
  if (weeksLeft !== null && weeksLeft <= 12) return "urgent";
  if (pct >= 60) return "on_track";
  return "at_risk";
}

const STATUS_CONFIG = {
  compliant: { label: "Compliant ✓", color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0", btnColor: "#1a56a0" },
  on_track:  { label: "On Track",    color: "#1a56a0", bg: "#dbeafe", border: "#bfdbfe", btnColor: "#1a56a0" },
  at_risk:   { label: "At Risk",     color: "#d97706", bg: "#fef3c7", border: "#fde68a", btnColor: "#d97706" },
  urgent:    { label: "Urgent — Act Now", color: "#dc2626", bg: "#fee2e2", border: "#fecaca", btnColor: "#dc2626" },
};

function ComplianceRing({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.min(pct, 100);
  return (
    <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="52" fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * 326.7} 326.7`}
          style={{ transition: "stroke-dasharray 0.4s ease" }}
        />
      </svg>
      <span className="text-2xl font-extrabold text-[#111]" aria-label={`${Math.round(clamped)} percent complete`}>
        {Math.round(clamped)}%
      </span>
    </div>
  );
}

const TABLE_ROWS = [
  { authority: "QCHP",  country: "Qatar",         flag: "🇶🇦", credits: "80",         cycle: "2 years", terminology: "CPD" },
  { authority: "SCFHS", country: "Saudi Arabia",   flag: "🇸🇦", credits: "30–60 / yr", cycle: "1 year",  terminology: "CME" },
  { authority: "DHA",   country: "UAE — Dubai",    flag: "🇦🇪", credits: "40",         cycle: "2 years", terminology: "CME" },
  { authority: "DOH",   country: "UAE — Abu Dhabi",flag: "🇦🇪", credits: "30–50",      cycle: "2 years", terminology: "CPD" },
  { authority: "MOH",   country: "Kuwait",         flag: "🇰🇼", credits: "30 / yr",    cycle: "1 year",  terminology: "CME" },
  { authority: "NHRA",  country: "Bahrain",        flag: "🇧🇭", credits: "40",         cycle: "2 years", terminology: "CPD" },
  { authority: "OMSB",  country: "Oman",           flag: "🇴🇲", credits: "30–40",      cycle: "2 years", terminology: "CME" },
];

export default function CmeCalculatorClient() {
  const [country, setCountry] = useState<CountryKey | "">("");
  const [profession, setProfession] = useState<ProfessionKey | "">("");
  const [credits, setCredits] = useState<string>("");
  const [cycleStart, setCycleStart] = useState<string>("");

  const rule = country ? RULES[country] : null;
  const required = rule && profession ? rule.professions[profession] : null;
  const earned = parseFloat(credits) || 0;

  const result = useMemo(() => {
    if (!rule || required === null || credits === "") return null;
    const pct = Math.min((earned / required) * 100, 100);
    const remaining = Math.max(required - earned, 0);
    let weeksLeft: number | null = null;
    let renewalDate: string | null = null;
    if (cycleStart) {
      const start = new Date(cycleStart);
      const end = new Date(start);
      end.setMonth(end.getMonth() + rule.cycleMonths);
      const msLeft = end.getTime() - Date.now();
      weeksLeft = Math.max(Math.floor(msLeft / 604800000), 0);
      renewalDate = end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }
    return { pct, remaining, weeksLeft, renewalDate, status: getStatus(pct, weeksLeft) };
  }, [rule, required, earned, credits, cycleStart]);

  const statusCfg = result ? STATUS_CONFIG[result.status] : null;

  return (
    <>
      {/* Calculator card */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <h2 className="text-lg font-bold text-[#111] mb-1">Calculate your CME / CPD requirement</h2>
            <p className="text-sm text-[#64748b]">Fill in your details to see your compliance gap instantly.</p>
          </div>

          <div>
            <label htmlFor="calc-country" className="block text-xs font-semibold text-[#374151] mb-1.5">
              Licensing authority / country <span className="text-[#dc2626]" aria-hidden="true">*</span>
            </label>
            <select
              id="calc-country"
              value={country}
              onChange={(e) => setCountry(e.target.value as CountryKey | "")}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a56a0] bg-white text-[#111]"
            >
              <option value="">Select your country…</option>
              {(Object.entries(RULES) as [CountryKey, CountryRule][]).map(([key, r]) => (
                <option key={key} value={key}>{r.flag} {r.name} — {r.authority}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="calc-profession" className="block text-xs font-semibold text-[#374151] mb-1.5">
              Profession <span className="text-[#dc2626]" aria-hidden="true">*</span>
            </label>
            <select
              id="calc-profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value as ProfessionKey | "")}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a56a0] bg-white text-[#111]"
            >
              <option value="">Select your profession…</option>
              {(Object.entries(PROFESSION_LABELS) as [ProfessionKey, string][]).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="calc-credits" className="block text-xs font-semibold text-[#374151] mb-1.5">
              {rule ? `${rule.terminology} credits earned so far` : "Credits earned so far"}{" "}
              <span className="text-[#dc2626]" aria-hidden="true">*</span>
            </label>
            <input
              id="calc-credits"
              type="number"
              min="0"
              max="999"
              step="0.5"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder={required !== null ? `0 – ${required}` : "e.g. 25"}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a56a0] text-[#111] placeholder:text-[#64748b]"
            />
            {rule && required !== null && (
              <p className="text-[11px] text-[#64748b] mt-1">
                {rule.authority} requires <strong>{required} {rule.terminology}</strong> per {rule.cycleMonths === 12 ? "1-year" : "2-year"} cycle
              </p>
            )}
          </div>

          <div>
            <label htmlFor="calc-start" className="block text-xs font-semibold text-[#374151] mb-1.5">
              Cycle start date{" "}
              <span className="text-[#64748b] font-normal">(optional — for deadline)</span>
            </label>
            <input
              id="calc-start"
              type="date"
              value={cycleStart}
              onChange={(e) => setCycleStart(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a56a0] text-[#111]"
            />
            {rule && (
              <p className="text-[11px] text-[#64748b] mt-1">
                Renewal date = start date + {rule.cycleMonths} months
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {result && statusCfg && rule && required !== null ? (
          <div
            className="border-t border-[#e2e8f0] p-6 sm:p-8"
            style={{ background: statusCfg.bg }}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <ComplianceRing pct={result.pct} color={statusCfg.color} />
                <div
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ color: statusCfg.color, background: "#fff", border: `1.5px solid ${statusCfg.border}` }}
                >
                  {statusCfg.label}
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: String(earned),              label: "credits earned" },
                    { value: result.remaining === 0 ? "✓ Done" : String(result.remaining), label: result.remaining === 0 ? "requirement met" : "credits still needed", highlight: result.remaining > 0 },
                    { value: String(required),             label: "required total" },
                    { value: result.weeksLeft !== null ? String(result.weeksLeft) : "—", label: result.weeksLeft !== null ? "weeks until renewal" : "add start date", urgent: (result.weeksLeft ?? 999) < 12 },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/80 rounded-xl border border-[#e2e8f0] p-3 text-center">
                      <div
                        className="text-2xl font-extrabold"
                        style={{ color: s.urgent ? "#dc2626" : s.highlight ? statusCfg.color : "#111" }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs text-[#64748b] mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {result.renewalDate && (
                  <p className="text-xs text-[#64748b]">
                    Renewal deadline: <strong className="text-[#111]">{result.renewalDate}</strong>
                  </p>
                )}

                {result.remaining > 0 && result.weeksLeft !== null && result.weeksLeft > 0 && (
                  <p className="text-xs text-[#374151] bg-white/70 rounded-lg px-3 py-2 border border-[#e2e8f0]">
                    Approximately{" "}
                    <strong>{(result.remaining / result.weeksLeft).toFixed(1)} {rule.terminology} credits per week</strong>{" "}
                    needed to meet your renewal deadline.
                  </p>
                )}

                <Link
                  href="/register"
                  className="block w-full text-center text-sm font-bold text-white py-3 px-4 rounded-xl transition-colors"
                  style={{ background: statusCfg.btnColor }}
                >
                  Track this automatically — free →
                </Link>
                <Link
                  href={rule.href}
                  className="block text-center text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors"
                >
                  Full {rule.authority} {rule.terminology} guide →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-[#e2e8f0] px-6 py-8 text-center text-sm text-[#64748b]">
            Select your country, profession, and current credits above to see your compliance gap.
          </div>
        )}
      </div>

      {/* Comparison table */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-[#111] mb-5">GCC CME requirements at a glance</h2>
        <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {["Authority", "Country", "Credits required", "Cycle", "Terminology"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((r, i) => (
                <tr key={r.authority} className={i < TABLE_ROWS.length - 1 ? "border-b border-[#f1f5f9]" : ""}>
                  <td className="px-4 py-3 font-semibold text-[#1a56a0]">{r.authority}</td>
                  <td className="px-4 py-3 text-[#374151]">{r.flag} {r.country}</td>
                  <td className="px-4 py-3 text-[#374151]">{r.credits}</td>
                  <td className="px-4 py-3 text-[#374151]">{r.cycle}</td>
                  <td className="px-4 py-3 text-[#64748b]">{r.terminology}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#64748b] mt-3">SCFHS and DOH/OMSB vary by profession. Use the calculator above for your exact requirement.</p>
      </section>

      {/* Why track automatically */}
      <section className="bg-white border border-[#e2e8f0] rounded-2xl mt-10 px-6 py-12">
        <h2 className="text-xl font-bold text-[#111] text-center mb-8">Why track automatically instead of calculating manually?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "📊", title: "Progress updates automatically", body: "Every verified CME activity updates your compliance wallet in real time. No manual recalculations." },
            { icon: "⏰", title: "Renewal alerts before deadlines", body: "Email alerts at 30 and 7 days before your renewal deadline — so you are never caught short." },
            { icon: "📄", title: "PDF compliance report for submission", body: "Generate a QCHP-ready or SCFHS-ready PDF compliance report for your portfolio in one click. Pro feature." },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-3xl mb-3" aria-hidden="true">{f.icon}</div>
              <h3 className="font-semibold text-[#111] mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1547a0] text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors"
          >
            Start tracking free — no credit card
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-xs text-[#64748b] mt-3">14-day Pro trial included · Free forever after</p>
        </div>
      </section>
    </>
  );
}
