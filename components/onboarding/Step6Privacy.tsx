"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

const PRIVACY_FIELDS = [
  { id: "employer_can_view_cme_summary", tKey: "cme_summary", defaultOn: true },
  { id: "employer_can_view_license_expiry", tKey: "license_expiry", defaultOn: true },
  { id: "employer_can_view_profile_details", tKey: "profile", defaultOn: true },
  { id: "employer_can_view_detailed_cme_activities", tKey: "detailed", defaultOn: false },
  { id: "employer_can_view_certificates", tKey: "certs", defaultOn: false },
];

export default function Step6Privacy({
  profile: _profile,
  userId,
  initialSettings,
}: {
  profile?: Record<string, unknown> | null;
  userId: string;
  authorities?: unknown[];
  initialSettings?: Record<string, boolean> | null;
}) {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const [settings, setSettings] = useState<Record<string, boolean>>(
    initialSettings
      ? Object.fromEntries(PRIVACY_FIELDS.map(f => [f.id, initialSettings[f.id] ?? f.defaultOn]))
      : Object.fromEntries(PRIVACY_FIELDS.map(f => [f.id, f.defaultOn]))
  );
  const [aiConsent, setAiConsent] = useState<boolean>(
    (initialSettings as Record<string, boolean> | null)?.ai_data_consent ?? false
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: privError } = await supabase.from("profile_privacy_settings").upsert({
      professional_id: userId,
      ...settings,
      ai_data_consent: aiConsent,
      ai_data_consent_at: aiConsent ? new Date().toISOString() : null,
    }, { onConflict: "professional_id" });

    if (privError) { setError(privError.message); setLoading(false); return; }

    await supabase.from("professional_profiles").update({ onboarding_step: 7 }).eq("auth_id", userId);
    track("onboarding_step_completed", { step: 6, step_name: "privacy", employer_visible: Object.values(settings).filter(Boolean).length });
    router.push("/onboarding/7");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-1">{t("step6.heading")}</h2>
      <p className="text-sm text-[#64748b] mb-4">{t("step6.subtitle")}</p>

      <div className="space-y-3">
        {PRIVACY_FIELDS.map(field => (
          <div key={field.id} className="flex items-start gap-3 p-4 border border-[#e2e8f0] rounded-lg">
            <input
              type="checkbox"
              id={field.id}
              checked={settings[field.id]}
              onChange={(e) => setSettings(s => ({ ...s, [field.id]: e.target.checked }))}
              className="mt-0.5 w-4 h-4 rounded border-[#e2e8f0] text-[#1a56a0] focus:ring-[#1a56a0]"
            />
            <div>
              <label htmlFor={field.id} className="text-sm font-medium text-[#111] cursor-pointer">
                {t(`step6.${field.tKey}_label`)}
              </label>
              <p className="text-xs text-[#64748b] mt-0.5">{t(`step6.${field.tKey}_desc`)}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#64748b]">{t("step6.employer_note")}</p>

      {/* AI Consent — PDPL/GDPR Art. 6(1)(a) */}
      <div className="mt-2 p-4 border border-[#e2e8f0] rounded-lg bg-[#f8fafc]">
        <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">{t("step6.ai_section")}</p>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="ai_data_consent"
            checked={aiConsent}
            onChange={(e) => setAiConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-[#e2e8f0] text-[#1a56a0] focus:ring-[#1a56a0]"
          />
          <div>
            <label htmlFor="ai_data_consent" className="text-sm font-medium text-[#111] cursor-pointer">
              {t("step6.ai_label")}
            </label>
            <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{t("step6.ai_desc")}</p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/5")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          {t("back")}
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {loading ? t("saving") : t("continue")}
        </button>
      </div>
    </form>
  );
}
