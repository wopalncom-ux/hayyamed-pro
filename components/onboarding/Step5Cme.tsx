"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";
import { playSound } from "@/lib/sounds";

type CmeRules = {
  total_credits_required: number;
  cycle_years: number;
  credit_terminology: string;
} | null;

// Build relative date options from today and cycleYears
function buildDateOptions(cycleYears: number): { label: string; sub: string; date: string }[] {
  const now = new Date();
  const fmt = (d: Date) => {
    const m = d.toLocaleString("en-GB", { month: "long", year: "numeric" });
    return m;
  };
  const iso = (d: Date) => d.toISOString().split("T")[0];

  const options = [
    { label: "Starting today", sub: fmt(now), date: iso(now) },
  ];

  const steps = [6, 12, 18, 24]; // months back
  for (const months of steps) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - months);
    const label = months < 12
      ? `${months} months ago`
      : months === 12 ? "1 year ago"
      : months === 18 ? "1.5 years ago"
      : "2 years ago";
    options.push({ label, sub: fmt(d), date: iso(d) });
  }

  // Only show options whose resulting end date hasn't already passed
  return options.filter((o) => {
    const end = new Date(o.date);
    end.setFullYear(end.getFullYear() + cycleYears);
    return end.getTime() > now.getTime();
  });
}

function addYears(dateStr: string, years: number): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().split("T")[0];
}

export default function Step5Cme({
  profile,
  userId,
  cmeRules,
}: {
  profile: Record<string, unknown> | null;
  userId: string;
  authorities?: unknown[];
  cmeRules?: CmeRules;
}) {
  const router = useRouter();
  const profession = String(profile?.profession ?? "");

  const requiredCredits = cmeRules?.total_credits_required ?? 50;
  const cycleYears = cmeRules?.cycle_years ?? 2;
  const terminology = cmeRules?.credit_terminology ?? "CME";
  const country = String(profile?.country_of_residence ?? "Qatar");

  const dateOptions = buildDateOptions(cycleYears);
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].date);

  const cycleEndDate = addYears(selectedDate, cycleYears);

  const [form, setForm] = useState({
    country,
    profession,
    specialty: String(profile?.specialty ?? ""),
    required_credits: requiredCredits,
    renewal_cycle_years: cycleYears,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function selectDate(date: string) {
    setSelectedDate(date);
    playSound("validate");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: walletError } = await supabase.from("cme_wallets").insert({
      professional_id: userId,
      ...form,
      cycle_start_date: selectedDate,
      cycle_end_date: cycleEndDate,
      completed_credits: 0,
      compliance_status: "non_compliant",
      is_primary: true,
    });

    if (walletError && walletError.code !== "23505") {
      setError(walletError.message);
      setLoading(false);
      return;
    }

    await supabase.from("professional_profiles").update({ onboarding_step: 6 }).eq("auth_id", userId);
    track("onboarding_step_completed", {
      step: 5,
      step_name: "cme_setup",
      required_credits: form.required_credits,
      cycle_years: form.renewal_cycle_years,
    });
    playSound("submit");
    router.push("/onboarding/6");
  }

  const deadlineDate = new Date(cycleEndDate).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-2">
        <div className="w-12 h-12 bg-[#dbeafe] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#111] mb-1">CME Setup</h2>
        <p className="text-sm text-[#64748b]">When did your current renewal cycle begin?</p>
      </div>

      {/* Rules context */}
      <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl px-4 py-3 text-sm text-[#1e3a5f]">
        <span className="font-semibold">{form.required_credits} {terminology} credits</span> required every{" "}
        <span className="font-semibold">{form.renewal_cycle_years} year{form.renewal_cycle_years !== 1 ? "s" : ""}</span>{" "}
        for {profession || "your profession"} in {country}
      </div>

      {/* Cycle start date — tap-able relative cards */}
      <div>
        <p className="text-sm font-medium text-[#374151] mb-2">Choose the closest option:</p>
        <div className="grid grid-cols-1 gap-2">
          {dateOptions.map((opt) => (
            <button
              key={opt.date}
              type="button"
              onClick={() => selectDate(opt.date)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                selectedDate === opt.date
                  ? "border-[#1a56a0] bg-[#f0f7ff] shadow-sm"
                  : "border-[#e2e8f0] bg-white hover:border-[#1a56a0]/40 hover:bg-[#f8fafc]"
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${selectedDate === opt.date ? "text-[#1a56a0]" : "text-[#111]"}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-[#64748b] mt-0.5">{opt.sub}</p>
              </div>
              {selectedDate === opt.date && (
                <svg className="w-5 h-5 text-[#1a56a0] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Live deadline preview */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3 text-sm text-[#15803d]">
        Your renewal deadline will be <span className="font-semibold">{deadlineDate}</span>
      </div>

      {/* Advanced: override credits/cycle if needed */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-[#64748b] hover:text-[#1a56a0] list-none flex items-center gap-1 select-none">
          <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Advanced: override credits or cycle length
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Required credits</label>
            <input
              type="number"
              value={form.required_credits}
              onChange={(e) => setForm(f => ({ ...f, required_credits: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Cycle years</label>
            <input
              type="number"
              value={form.renewal_cycle_years}
              onChange={(e) => setForm(f => ({ ...f, renewal_cycle_years: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
              min={1}
              max={5}
            />
          </div>
        </div>
      </details>

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.push("/onboarding/4")}
          className="px-4 py-2.5 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc] transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving…" : "Continue →"}
        </button>
      </div>
    </form>
  );
}
