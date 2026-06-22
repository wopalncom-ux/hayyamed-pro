"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

const NATIONALITIES = [
  "Qatari", "Saudi", "Emirati", "Kuwaiti", "Bahraini", "Omani",
  "Jordanian", "Egyptian", "Lebanese", "Syrian", "Palestinian",
  "Indian", "Pakistani", "Filipino", "Sri Lankan",
  "British", "American", "Canadian", "Australian", "Other",
];

const COUNTRIES_OF_RESIDENCE = [
  { code: "QA", name: "Qatar" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "EG", name: "Egypt" },
  { code: "JO", name: "Jordan" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "OTHER", name: "Other" },
];

export default function Step2Personal({ profile, userId }: { profile: Record<string, unknown> | null; userId: string; authorities?: unknown[] }) {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const [form, setForm] = useState({
    full_name: String(profile?.full_name ?? ""),
    date_of_birth: String(profile?.date_of_birth ?? ""),
    nationality: String(profile?.nationality ?? ""),
    country_of_residence: String(profile?.country_of_residence ?? "Qatar"),
    mobile: String(profile?.mobile ?? ""),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.full_name.trim()) { setError(t("step2.full_name_required")); return; }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("professional_profiles")
      .update({ ...form, onboarding_step: 3 })
      .eq("auth_id", userId);

    if (error) { setError(error.message); setLoading(false); return; }
    track("onboarding_step_completed", { step: 2, step_name: "personal" });
    router.push("/onboarding/3");
  }

  const inputCls = "w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-2">{t("step2.heading")}</h2>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-[#374151] mb-1">
          {t("step2.full_name")} <span className="text-[#dc2626]">*</span>
        </label>
        <input
          id="full_name"
          type="text"
          value={form.full_name}
          onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
          placeholder="Dr. First Last"
          required
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-[#374151] mb-1">{t("step2.dob")}</label>
        <input
          id="date_of_birth"
          type="date"
          value={form.date_of_birth}
          onChange={(e) => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-[#374151] mb-1">{t("step2.nationality")}</label>
        <select
          id="nationality"
          value={form.nationality}
          onChange={(e) => setForm(f => ({ ...f, nationality: e.target.value }))}
          className={inputCls}
        >
          <option value="">{t("step2.select_nationality")}</option>
          {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="country_of_residence" className="block text-sm font-medium text-[#374151] mb-1">
          {t("step2.residence")} <span className="text-[#dc2626]">*</span>
        </label>
        <select
          id="country_of_residence"
          value={form.country_of_residence}
          onChange={(e) => setForm(f => ({ ...f, country_of_residence: e.target.value }))}
          required
          className={inputCls}
        >
          <option value="">{t("step2.select_country")}</option>
          {COUNTRIES_OF_RESIDENCE.map(c => (
            <option key={c.code} value={c.name}>{c.name}</option>
          ))}
        </select>
        <p className="text-xs text-[#64748b] mt-1">{t("step2.residence_hint")}</p>
      </div>

      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-[#374151] mb-1">{t("step2.mobile")}</label>
        <input
          id="mobile"
          type="tel"
          value={form.mobile}
          onChange={(e) => setForm(f => ({ ...f, mobile: e.target.value }))}
          placeholder={t("step2.mobile_placeholder")}
          className={inputCls}
        />
      </div>

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/1")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          {t("back")}
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {loading ? t("saving") : t("continue_arrow")}
        </button>
      </div>
    </form>
  );
}
