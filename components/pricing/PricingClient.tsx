"use client";

import { useState, useEffect } from "react";
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

const FREE_FEATURES = [
  "Up to 10 CME activities",
  "Compliance status dashboard",
  "1 license tracked",
  "Employer link requests",
  "QCHP / GCC authority support",
];

const PRO_FEATURES = [
  "Unlimited CME activities",
  "PDF compliance reports (QCHP-ready)",
  "AI compliance chatbot (Claude)",
  "AI gap analysis & recommendations",
  "Certificate storage & verification",
  "Email reminders & license alerts",
  "License expiry warnings (30 & 7 days)",
  "Priority support",
];

const EMPLOYER_BASE_FEATURES = [
  "Employer admin: Pro plan FREE",
  "Team compliance dashboard",
  "Bulk staff compliance reports",
  "Staff link management & approvals",
  "Department grouping & analytics",
  "Dedicated account manager",
];

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${dark ? "text-blue-200" : "text-[#16a34a]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Toggle({ annual, onChange }: { annual: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="inline-flex items-center gap-3 bg-[#f1f5f9] rounded-full p-1">
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !annual ? "bg-white text-[#111] shadow-sm" : "text-[#64748b]"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
          annual ? "bg-white text-[#111] shadow-sm" : "text-[#64748b]"
        }`}
      >
        Annual
        <span className="bg-[#16a34a] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Save 15%
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
    ? `≈ $${(PRO.annual / 12).toFixed(2)}/month · Billed annually`
    : "Billed monthly · Save 15% annually";

  const isProOrTrial = userPlan === "pro" || userPlan === "trialing";
  const isEmployer = userPlan === "employer";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-[#1a56a0] font-bold text-lg">Hayya Med Pro</a>
          {userPlan ? (
            <a href="/dashboard" className="text-sm text-[#1a56a0] font-medium hover:underline">← Back to Dashboard</a>
          ) : (
            <a href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">Sign in</a>
          )}
        </div>
      </header>

      {/* Trial status banner for logged-in trial users */}
      {userPlan === "trialing" && trialDaysLeft !== null && trialDaysLeft > 0 && (
        <div className={`border-b px-6 py-3 text-center text-sm ${trialDaysLeft <= 3 ? "bg-[#fff7ed] border-[#fed7aa] text-[#92400e]" : "bg-[#f0f7ff] border-[#bfdbfe] text-[#1e3a5f]"}`}>
          {trialDaysLeft <= 3 ? "⚠️ " : ""}
          Your 14-day Pro trial has <strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}</strong> remaining.
          {trialDaysLeft <= 3 && " Upgrade now to keep uninterrupted access."}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Heading + toggle */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[#64748b] max-w-xl mx-auto mb-8">
            Start free. Upgrade for PDF compliance reports, AI chatbot, and automated reminders.
          </p>
          <Toggle annual={annual} onChange={setAnnual} />
        </div>

        {/* Individual plans */}
        <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">Individual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-7 flex flex-col">
            <p className="text-sm font-medium text-[#64748b] mb-1">Free</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-[#111]">$0</span>
            </div>
            <p className="text-xs text-[#94a3b8] mb-6">Forever free · No credit card required</p>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                  <Check />{f}
                </li>
              ))}
            </ul>
            {userPlan === "free" ? (
              <div className="block w-full text-center border border-[#1a56a0] text-[#1a56a0] py-3 rounded-xl font-semibold text-sm bg-[#f0f7ff]">
                ✓ Your current plan
              </div>
            ) : userPlan ? null : (
              <a
                href="/register"
                className="block w-full text-center border border-[#e2e8f0] text-[#374151] py-3 rounded-xl font-semibold text-sm hover:bg-[#f8fafc] transition-colors"
              >
                Get started free
              </a>
            )}
          </div>

          {/* Pro */}
          <div className="bg-[#1a56a0] rounded-2xl p-7 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Most popular
            </div>
            <p className="text-sm font-medium text-blue-200 mb-1">Pro</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-white">${proPrice}</span>
              <span className="text-blue-200 mb-1">{proSuffix}</span>
            </div>
            <p className="text-xs text-blue-300 mb-6">{proSub}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <Check dark />
                  {f}
                </li>
              ))}
            </ul>
            {isProOrTrial ? (
              <div className="block w-full text-center bg-white/20 border border-white/30 text-white py-3 rounded-xl font-semibold text-sm">
                {userPlan === "trialing" ? `✓ Active — ${trialDaysLeft}d trial remaining` : "✓ Your current plan"}
              </div>
            ) : isEmployer ? (
              <div className="block w-full text-center bg-white/10 border border-white/20 text-blue-200 py-3 rounded-xl font-semibold text-sm">
                Included in your Employer plan
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
                    Pay with QPay (QAR)
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

        {/* Employer plans */}
        <h2 id="employer" className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2 scroll-mt-8">Employer</h2>
        <p className="text-sm text-[#64748b] mb-6">
          Employer admin&apos;s own Pro features are included free in every employer plan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {EMPLOYER_TIERS.map((tier) => {
            const price  = annual ? tier.annual  : tier.monthly;
            const suffix = annual ? "/year"       : "/month";
            const subLine = annual
              ? `≈ $${Math.round(tier.annual / 12)}/month`
              : `Save 15% annually`;

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
                    Recommended
                  </span>
                )}
                <p className={`text-sm font-semibold mb-0.5 ${tier.highlight ? "text-blue-100" : "text-[#64748b]"}`}>
                  {tier.label}
                </p>
                <p className={`text-xs mb-3 ${tier.highlight ? "text-blue-200" : "text-[#94a3b8]"}`}>
                  Up to {tier.maxStaff} staff
                </p>
                <div className={`text-3xl font-bold mb-0.5 ${tier.highlight ? "text-white" : "text-[#111]"}`}>
                  ${price}
                </div>
                <p className={`text-xs mb-5 ${tier.highlight ? "text-blue-300" : "text-[#94a3b8]"}`}>
                  {suffix} · {subLine}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {EMPLOYER_BASE_FEATURES.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${tier.highlight ? "text-blue-100" : "text-[#374151]"}`}>
                      <Check dark={tier.highlight} />{f}
                    </li>
                  ))}
                </ul>
                {isEmployer ? (
                  <div className={`block w-full text-center py-3 rounded-xl font-semibold text-sm border ${tier.highlight ? "bg-white/20 border-white/30 text-white" : "bg-[#f0f7ff] border-[#1a56a0] text-[#1a56a0]"}`}>
                    ✓ Active plan
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
            <p className="font-semibold text-[#111] mb-1">Hospital Group / Government — Enterprise</p>
            <p className="text-sm text-[#64748b]">Unlimited staff · HRIS API · White-label option · Dedicated SLA · Signed DPA</p>
          </div>
          <a
            href="/contact"
            className="flex-shrink-0 bg-[#f1f5f9] text-[#1a56a0] px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#e2e8f0] transition-colors"
          >
            Contact us
          </a>
        </div>

        {/* Guarantee + trust signals */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#111] mb-1">14-day money-back guarantee</p>
              <p className="text-xs text-[#64748b]">Not satisfied? Get a full refund within 14 days, no questions asked.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#111] mb-1">Your data is always yours</p>
              <p className="text-xs text-[#64748b]">All CME history and certificates are retained on any plan — including Free.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#fff7ed] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#111] mb-1">Cancel anytime</p>
              <p className="text-xs text-[#64748b]">No lock-in contracts. Cancel from settings in 30 seconds.</p>
            </div>
          </div>
        </div>

        {/* Visible FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#111] mb-6 text-center">Frequently asked questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Start tracking your CME compliance today</h2>
          <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
            Free forever for individuals. Upgrade for PDF reports, AI compliance tools, and automated reminders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!userPlan && (
              <a
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#f0f7ff] transition-colors"
              >
                Start free — no credit card →
              </a>
            )}
            {(!userPlan || userPlan === "free") && (
              <a
                href="/pricing?start=pro"
                className="border border-[rgba(255,255,255,0.3)] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                See Pro features →
              </a>
            )}
            {userPlan && userPlan !== "free" && (
              <a
                href="/dashboard"
                className="bg-white text-[#1a56a0] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#f0f7ff] transition-colors"
              >
                Go to dashboard →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "Is there a free trial?",
    a: "Yes. Every new account automatically receives a 14-day Pro trial after completing onboarding — no credit card required. Your data is kept on any plan.",
  },
  {
    q: "Which licensing authorities does Hayya Med Pro support?",
    a: "QCHP (Qatar), SCFHS (Saudi Arabia), DHA and DOH (UAE), NHRA (Bahrain), OMSB (Oman), MOH Kuwait, GMC/NMC (UK), AHPRA (Australia), and NMC (India). More are added regularly.",
  },
  {
    q: "What is included in the Pro plan?",
    a: "Unlimited CME activity tracking, downloadable PDF compliance report, AI-powered gap analysis (powered by Claude), compliance chatbot, certificate storage, license expiry alerts, multi-country tracking, and priority support.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. Cancel any time from Dashboard → Settings → Manage Billing. Your Pro access continues until the end of the billing period, then your account moves to the Free plan. Your CME data is always preserved.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major credit and debit cards via Paddle. Cards issued in Qatar, UAE, Saudi Arabia, and other GCC countries are fully supported.",
  },
  {
    q: "Is my health data secure?",
    a: "Yes. Data is stored on Supabase (PostgreSQL with row-level security), hosted in GCP (me-central1, Doha, Qatar). No personal data is ever sent to AI models. All files use signed URLs with 1-hour expiry.",
  },
] as const;

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
