"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CME_DEFAULTS: Record<string, { required: number; cycle: number }> = {
  "Doctor (MD/MBBS)": { required: 50, cycle: 3 },
  "Dentist": { required: 50, cycle: 3 },
  "Pharmacist": { required: 30, cycle: 2 },
  "Nurse": { required: 20, cycle: 2 },
  "Physiotherapist": { required: 30, cycle: 2 },
  default: { required: 30, cycle: 2 },
};

export default function Step5Cme({ profile, userId }: { profile: Record<string, unknown> | null; userId: string }) {
  const router = useRouter();
  const profession = String(profile?.profession ?? "");
  const defaults = CME_DEFAULTS[profession] ?? CME_DEFAULTS.default;

  const today = new Date();
  const cycleStart = today.toISOString().split("T")[0];
  const cycleEnd = new Date(today.setFullYear(today.getFullYear() + defaults.cycle)).toISOString().split("T")[0];

  const [form, setForm] = useState({
    country: String(profile?.country_of_residence ?? "Qatar"),
    profession: profession,
    specialty: String(profile?.specialty ?? ""),
    required_credits: defaults.required,
    renewal_cycle_years: defaults.cycle,
    cycle_start_date: cycleStart,
    cycle_end_date: cycleEnd,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: walletError } = await supabase.from("cme_wallets").insert({
      professional_id: userId,
      ...form,
      completed_credits: 0,
      compliance_status: "non_compliant",
    });

    if (walletError && walletError.code !== "23505") {
      setError(walletError.message);
      setLoading(false);
      return;
    }

    await supabase.from("professional_profiles").update({ onboarding_step: 6 }).eq("auth_id", userId);
    router.push("/onboarding/6");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-1">CME Setup</h2>
      <p className="text-sm text-[#64748b] mb-4">
        We&apos;ve pre-filled defaults based on your profession. Adjust if needed.
      </p>

      <div className="bg-[#f0f4f8] rounded-lg px-4 py-3 text-sm text-[#374151]">
        <span className="font-medium">{form.required_credits} credits</span> required every{" "}
        <span className="font-medium">{form.renewal_cycle_years} years</span> for {profession || "your profession"} in {form.country}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Required credits</label>
          <input
            type="number"
            value={form.required_credits}
            onChange={(e) => setForm(f => ({ ...f, required_credits: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Renewal cycle (years)</label>
          <input
            type="number"
            value={form.renewal_cycle_years}
            onChange={(e) => setForm(f => ({ ...f, renewal_cycle_years: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
            min={1}
            max={5}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Cycle start date</label>
          <input
            type="date"
            value={form.cycle_start_date}
            onChange={(e) => setForm(f => ({ ...f, cycle_start_date: e.target.value }))}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Cycle end date</label>
          <input
            type="date"
            value={form.cycle_end_date}
            onChange={(e) => setForm(f => ({ ...f, cycle_end_date: e.target.value }))}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
          />
        </div>
      </div>

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/4")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          Back
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
