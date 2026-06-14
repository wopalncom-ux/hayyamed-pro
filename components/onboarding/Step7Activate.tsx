"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { completeOnboarding } from "@/app/(onboarding)/onboarding/actions";
import { track } from "@/lib/analytics";
import { playSound } from "@/lib/sounds";

export default function Step7Activate({ profile, trialDays = 14 }: { profile: Record<string, unknown> | null; userId?: string; authorities?: unknown[]; trialDays?: number }) {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const [loading, setLoading] = useState(false);
  const [actualTrialDays, setActualTrialDays] = useState(trialDays);

  async function handleActivate() {
    setLoading(true);
    const result = await completeOnboarding();
    const pct = "pct" in result ? result.pct : 0;
    if ("trialDays" in result) setActualTrialDays(result.trialDays);
    track("onboarding_step_completed", { step: 7, step_name: "activate", profile_completion_pct: pct });
    track("onboarding_completed", { profile_completion_pct: pct });
    playSound("complete");
    router.push("/dashboard?upgrade=trial");
    router.refresh();
  }

  const trialEndDate = new Date(Date.now() + actualTrialDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#111] mb-2">{t("step7_heading")}</h2>
        <p className="text-sm text-[#64748b]">
          {t("step7_subtitle")}
        </p>
      </div>

      {/* 14-day Pro Trial activation card */}
      <div className="bg-gradient-to-br from-[#1a56a0] to-[#1547a0] rounded-xl p-5 mb-5 text-white">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">{t("step7_trial_heading", { days: actualTrialDays })}</p>
            <p className="text-blue-200 text-xs mt-0.5">{t("step7_trial_sub", { date: trialEndDate })}</p>
          </div>
        </div>
        <ul className="space-y-1.5 pl-11">
          {[t("step7_trial_f1"), t("step7_trial_f2"), t("step7_trial_f3"), t("step7_trial_f4")].map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-blue-100">
              <svg className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Profile summary */}
      <div className="space-y-3 mb-5">
        <SummaryItem label={t("step7_profile")} value={String(profile?.full_name ?? "—")} />
        <SummaryItem label={t("step7_profession")} value={String(profile?.profession ?? "—")} />
        <SummaryItem label={t("step7_specialty")} value={String(profile?.specialty ?? "—")} />
        <SummaryItem label={t("step7_license")} value={String(profile?.license_number ?? "—")} />
        <SummaryItem label={t("step7_authority")} value={String(profile?.licensing_authority ?? "—")} />
      </div>

      {/* What's Next action cards */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">{t("step7_next_heading")}</p>
        <div className="grid grid-cols-1 gap-2">
          {[
            { href: "/dashboard/cme", bg: "bg-[#dbeafe]", iconColor: "text-[#1a56a0]", label: t("step7_next1_label"), sub: t("step7_next1_sub"), icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> },
            { href: "/dashboard/cme", bg: "bg-[#dcfce7]", iconColor: "text-[#16a34a]", label: t("step7_next2_label"), sub: t("step7_next2_sub"), icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
            { href: "/dashboard/licenses", bg: "bg-[#fef9c3]", iconColor: "text-[#d97706]", label: t("step7_next3_label"), sub: t("step7_next3_sub"), icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
            { href: "/dashboard/ai", bg: "bg-[#f3e8ff]", iconColor: "text-[#7c3aed]", label: t("step7_next4_label"), sub: t("step7_next4_sub"), icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
          ].map((step) => (
            <a
              key={step.label}
              href={step.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#1a56a0]/30 hover:bg-[#f8fafc] transition-all group"
            >
              <div className={`w-9 h-9 ${step.bg} rounded-lg flex items-center justify-center flex-shrink-0 ${step.iconColor}`}>
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111] group-hover:text-[#1a56a0] transition-colors">{step.label}</p>
                <p className="text-xs text-[#64748b] mt-0.5">{step.sub}</p>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8] flex-shrink-0 group-hover:text-[#1a56a0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Compliance disclaimer */}
      <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] mb-5">
        {t("step7_disclaimer")}
      </div>

      <button
        onClick={handleActivate}
        disabled={loading}
        className="w-full bg-[#1a56a0] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
      >
        {loading ? t("step7_cta_loading") : t("step7_cta")}
      </button>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#f0f4f8]">
      <span className="text-sm text-[#64748b]">{label}</span>
      <span className="text-sm font-medium text-[#111]">{value}</span>
    </div>
  );
}
