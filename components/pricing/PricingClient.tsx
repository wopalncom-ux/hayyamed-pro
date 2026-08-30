"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { track } from "@/lib/analytics";
import UpgradeButton from "./UpgradeButton";
import QPayCheckout from "@/components/payments/QPayCheckout";
import type { EmployerTierKey } from "@/lib/paddle";
import type { Plan } from "@/lib/planUtils";

// ── Static pricing data (mirrors DB defaults in migration 016) ────────────

const PRO = {
  monthly: 6,
  annual:  61.20,
  annualDiscountPct: 15,
};

const EMPLOYER_TIERS: {
  key: EmployerTierKey;
  label: string;
  maxStaff: number;
  monthly: number;
  annual: number;
  highlight?: boolean;
}[] = [
  { key: "clinic",     label: "Clinic",     maxStaff: 10,  monthly: 50,   annual: 510   },
  { key: "growth",     label: "Growth",     maxStaff: 25,  monthly: 100,  annual: 1020, highlight: true },
  { key: "department", label: "Department", maxStaff: 50,  monthly: 180,  annual: 1836  },
  { key: "hospital",   label: "Hospital",   maxStaff: 200, monthly: 350,  annual: 3570  },
];

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${dark ? "text-blue-200" : "text-[#16a34a]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Toggle({ annual, onChange }: { annual: boolean; onChange: (v: boolean) => void }) {
  const t = useTranslations("pricing");
  return (
    <div className="inline-flex items-center gap-3 bg-[#f1f5f9] rounded-full p-1">
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !annual ? "bg-white text-[#111] shadow-sm" : "text-[#374151]"
        }`}
      >
        {t("toggle_monthly")}
      </button>
      <button
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
          annual ? "bg-white text-[#111] shadow-sm" : "text-[#374151]"
        }`}
      >
        {t("toggle_annual")}
        <span className="bg-[#15803d] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {t("toggle_save")}
        </span>
      </button>
    </div>
  );
}

export default function PricingClient({
  userPlan = null,
  trialDaysLeft = null,
  qpayEnabled = false,
}: {
  userPlan?: Plan | null;
  trialDaysLeft?: number | null;
  qpayEnabled?: boolean;
}) {
  const t = useTranslations("pricing");
  const [annual, setAnnual] = useState(true);
  const [showQPay, setShowQPay] = useState(false);

  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("source") ?? "direct";
    track("pricing_page_viewed", { source, plan: userPlan ?? "none" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proPrice = annual ? PRO.annual : PRO.monthly;
  const proSuffix = annual ? "/year" : "/month";
  const proSub = annual
    ? t("pro_billed_annual", { perMonth: (PRO.annual / 12).toFixed(2) })
    : t("pro_billed_monthly");

  const isProOrTrial = userPlan === "pro" || userPlan === "trialing";
  const isEmployer = userPlan === "employer";

  const freeFeatures = [
    t("free_f1"), t("free_f2"), t("free_f3"), t("free_f4"), t("free_f5"),
  ];

  const proFeatures = [
    t("pro_f1"), t("pro_f2"), t("pro_f3"), t("pro_f4"),
    t("pro_f5"), t("pro_f6"), t("pro_f7"), t("pro_f8"),
  ];

  const employerBaseFeatures = [
    t("employer_f1"), t("employer_f2"), t("employer_f3"),
    t("employer_f4"), t("employer_f5"), t("employer_f6"),
  ];

  const faqItems = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
    { q: t("faq_q6"), a: t("faq_a6") },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-[#1a56a0] font-bold text-lg">Hayya Med Pro</a>
          {userPlan ? (
            <a href="/dashboard" className="text-sm text-[#1a56a0] font-medium hover:underline">{t("back_dashboard")}</a>
          ) : (
            <a href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">{t("sign_in")}</a>
          )}
        </div>
      </header>

      {/* Trial status banner */}
      {userPlan === "trialing" && trialDaysLeft !== null && trialDaysLeft > 0 && (
        <div className={`border-b px-6 py-3 text-center text-sm ${trialDaysLeft <= 3 ? "bg-[#fff7ed] border-[#fed7aa] text-[#92400e]" : "bg-[#f0f7ff] border-[#bfdbfe] text-[#1e3a5f]"}`}>
          {trialDaysLeft <= 3 ? "⚠️ " : ""}
          {t("trial_banner", { days: trialDaysLeft, s: trialDaysLeft !== 1 ? "s" : "" })}
          {trialDaysLeft <= 3 && ` ${t("trial_urgent")}`}
        </div>
      )}

      <div id="main-content" role="main" className="max-w-6xl mx-auto px-6 py-16">
        {/* Heading + toggle */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-[#64748b] max-w-xl mx-auto mb-8">
            {t("subtitle")}
          </p>
          <Toggle annual={annual} onChange={setAnnual} />
        </div>

        {/* Individual plans */}
        <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">{t("section_individual")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-7 flex flex-col">
            <p className="text-sm font-medium text-[#64748b] mb-1">{t("free_name")}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-[#111]">$0</span>
            </div>
            <p className="text-xs text-[#64748b] mb-6">{t("free_tagline")}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                  <Check />{f}
                </li>
              ))}
            </ul>
            {userPlan === "free" ? (
              <div className="block w-full text-center border border-[#1a56a0] text-[#1a56a0] py-3 rounded-xl font-semibold text-sm bg-[#f0f7ff]">
                {t("free_current")}
              </div>
            ) : userPlan ? null : (
              <a
                href="/register"
                className="block w-full text-center border border-[#e2e8f0] text-[#374151] py-3 rounded-xl font-semibold text-sm hover:bg-[#f8fafc] transition-colors"
              >
                {t("free_cta")}
              </a>
            )}
          </div>

          {/* Pro */}
          <div className="bg-[#1a56a0] rounded-2xl p-7 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {t("pro_popular")}
            </div>
            <p className="text-sm font-medium text-blue-200 mb-1">{t("pro_name")}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-white">${proPrice}</span>
              <span className="text-blue-200 mb-1">{proSuffix}</span>
            </div>
            <p className="text-xs text-blue-100 mb-6">{proSub}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <Check dark />
                  {f}
                </li>
              ))}
            </ul>
            {isProOrTrial ? (
              <div className="block w-full text-center bg-white/20 border border-white/30 text-white py-3 rounded-xl font-semibold text-sm">
                {userPlan === "trialing" ? t("pro_trial", { days: trialDaysLeft ?? 0 }) : t("pro_current")}
              </div>
            ) : isEmployer ? (
              <div className="block w-full text-center bg-white/10 border border-white/20 text-blue-200 py-3 rounded-xl font-semibold text-sm">
                {t("pro_employer_included")}
              </div>
            ) : (
              <div className="space-y-2">
                <UpgradeButton
                  plan="pro"
                  billingInterval={annual ? "annual" : "monthly"}
                  label={`Upgrade to Pro — $${proPrice}${proSuffix}`}
                  variant="white"
                />
                {qpayEnabled && !showQPay && (
                  <button
                    type="button"
                    onClick={() => { setShowQPay(true); track("qpay_checkout_opened", { plan: "pro" }); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 border border-white/25 text-white text-xs font-semibold rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span>🇶🇦</span>
                    {t("pro_qpay")}
                  </button>
                )}
                {qpayEnabled && showQPay && (
                  <QPayCheckout
                    plan="pro"
                    billingInterval={annual ? "annual" : "monthly"}
                    onClose={() => setShowQPay(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feature comparison matrix */}
        <div className="mb-14 overflow-x-auto">
          <h2 className="text-xl font-bold text-[#111] mb-6 text-center">Full feature comparison</h2>
          <table className="w-full min-w-[600px] border-collapse bg-white rounded-2xl overflow-hidden border border-[#e2e8f0]">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#111] w-1/2">Feature</th>
                <th className="text-center px-4 py-4 text-sm font-semibold text-[#64748b] w-1/6">Free</th>
                <th className="text-center px-4 py-4 text-sm font-semibold text-[#1a56a0] w-1/6 bg-[#eff6ff]">Pro</th>
                <th className="text-center px-4 py-4 text-sm font-semibold text-[#111] w-1/6">Employer</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["CME activity tracking", "Up to 10", "Unlimited", "Unlimited"],
                ["Compliance dashboard", true, true, true],
                ["License wallet", "1 license", "Unlimited", "Unlimited"],
                ["GCC authority support (QCHP, DHA, SCFHS…)", true, true, true],
                ["Employer linking", true, true, true],
                ["PDF compliance reports", false, true, true],
                ["AI compliance chatbot", false, true, true],
                ["AI gap analysis & recommendations", false, true, true],
                ["Certificate storage (signed URLs)", false, true, true],
                ["Email & license expiry reminders", false, true, true],
                ["CSV import / export", false, true, true],
                ["Calendar (.ics) export", false, true, true],
                ["Team compliance dashboard", false, false, true],
                ["Staff link management & approvals", false, false, true],
                ["Department grouping & analytics", false, false, true],
                ["Bulk staff PDF export", false, false, true],
                ["Dedicated account manager", false, false, "Growth+"],
              ].map(([feature, free, pro, employer], i) => (
                <tr key={i} className={`border-b border-[#f1f5f9] ${i % 2 === 1 ? "bg-[#fafbfc]" : ""}`}>
                  <td className="px-6 py-3 text-sm text-[#374151]">{feature}</td>
                  <td className="text-center px-4 py-3">
                    <ComparisonCell value={free} />
                  </td>
                  <td className="text-center px-4 py-3 bg-[#eff6ff]/40">
                    <ComparisonCell value={pro} />
                  </td>
                  <td className="text-center px-4 py-3">
                    <ComparisonCell value={employer} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Employer plans */}
        <h2 id="employer" className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2 scroll-mt-8">{t("section_employer")}</h2>
        <p className="text-sm text-[#64748b] mb-6">
          {t("employer_admin_note")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {EMPLOYER_TIERS.map((tier) => {
            const price  = annual ? tier.annual  : tier.monthly;
            const suffix = annual ? "/year"       : "/month";
            const subLine = annual
              ? `≈ $${Math.round(tier.annual / 12)}/month`
              : t("employer_save_annual");

            return (
              <div
                key={tier.key}
                className={`rounded-2xl border p-6 flex flex-col ${
                  tier.highlight
                    ? "bg-[#1a56a0] border-[#1a56a0] text-white"
                    : "bg-white border-[#e2e8f0]"
                }`}
              >
                {tier.highlight && (
                  <span className="self-start mb-2 bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {t("employer_recommended")}
                  </span>
                )}
                <p className={`text-sm font-semibold mb-0.5 ${tier.highlight ? "text-blue-100" : "text-[#64748b]"}`}>
                  {tier.label}
                </p>
                <p className={`text-xs mb-3 ${tier.highlight ? "text-blue-200" : "text-[#64748b]"}`}>
                  {t("employer_staff", { n: tier.maxStaff })}
                </p>
                <div className={`text-3xl font-bold mb-0.5 ${tier.highlight ? "text-white" : "text-[#111]"}`}>
                  ${price}
                </div>
                <p className={`text-xs mb-5 ${tier.highlight ? "text-blue-100" : "text-[#64748b]"}`}>
                  {suffix} · {subLine}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {employerBaseFeatures.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${tier.highlight ? "text-blue-100" : "text-[#374151]"}`}>
                      <Check dark={tier.highlight} />{f}
                    </li>
                  ))}
                </ul>
                {isEmployer ? (
                  <div className={`block w-full text-center py-3 rounded-xl font-semibold text-sm border ${tier.highlight ? "bg-white/20 border-white/30 text-white" : "bg-[#f0f7ff] border-[#1a56a0] text-[#1a56a0]"}`}>
                    {t("employer_active")}
                  </div>
                ) : (
                  <UpgradeButton
                    plan="employer"
                    billingInterval={annual ? "annual" : "monthly"}
                    employerTier={tier.key}
                    label={`Get ${tier.label}`}
                    variant={tier.highlight ? "white" : "primary"}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Enterprise */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-7 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <p className="font-semibold text-[#111] mb-1">{t("enterprise_title")}</p>
            <p className="text-sm text-[#64748b]">{t("enterprise_subtitle")}</p>
          </div>
          <a
            href="/contact"
            className="flex-shrink-0 bg-[#f1f5f9] text-[#1a56a0] px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#e2e8f0] transition-colors"
          >
            {t("enterprise_cta")}
          </a>
        </div>

        {/* Trust signals */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#111] mb-1">{t("trust_refund_title")}</p>
              <p className="text-xs text-[#64748b]">{t("trust_refund_desc")}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#111] mb-1">{t("trust_data_title")}</p>
              <p className="text-xs text-[#64748b]">{t("trust_data_desc")}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#fff7ed] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#111] mb-1">{t("trust_cancel_title")}</p>
              <p className="text-xs text-[#64748b]">{t("trust_cancel_desc")}</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#111] mb-6 text-center">{t("faq_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{t("cta_title")}</h2>
          <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
            {t("cta_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!userPlan && (
              <a
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#f0f7ff] transition-colors"
              >
                {t("cta_start_free")}
              </a>
            )}
            {(!userPlan || userPlan === "free") && (
              <a
                href="/pricing?start=pro"
                className="border border-[rgba(255,255,255,0.3)] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                {t("cta_see_pro")}
              </a>
            )}
            {userPlan && userPlan !== "free" && (
              <a
                href="/dashboard"
                className="bg-white text-[#1a56a0] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#f0f7ff] transition-colors"
              >
                {t("cta_dashboard")}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonCell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <svg className="w-4 h-4 text-[#16a34a] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  if (value === false)
    return <span className="text-[#cbd5e1] text-lg leading-none">—</span>;
  return <span className="text-xs font-medium text-[#374151]">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-[#111] pr-4">{q}</span>
        <svg
          className={`w-4 h-4 text-[#64748b] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-[#64748b] border-t border-[#f1f5f9] pt-3 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}
