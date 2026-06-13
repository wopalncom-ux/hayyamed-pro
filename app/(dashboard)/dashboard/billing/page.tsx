import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserPlan, isPro } from "@/lib/subscription";
import { EMPLOYER_TIERS, PRO_PLAN } from "@/lib/paddle";
import type { EmployerTierKey } from "@/lib/paddle";

export const metadata = { title: "Billing — Hayya Med Pro" };

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  employer: "Employer",
  trialing: "Pro Trial",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [plan, subRes, profileRes] = await Promise.all([
    getUserPlan(user.id),
    admin.from("subscriptions")
      .select("plan, status, billing_interval, employer_tier, current_period_end, cancel_at_period_end, paddle_customer_id")
      .eq("professional_id", user.id)
      .maybeSingle(),
    admin.from("professional_profiles").select("pro_trial_ends_at, full_name").eq("auth_id", user.id).maybeSingle(),
  ]);

  const sub = subRes.data;
  const profile = profileRes.data;

  const isOnTrial = plan === "trialing";
  const trialEndsAt = profile?.pro_trial_ends_at ?? null;
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;

  const planLabel = PLAN_LABELS[plan] ?? plan;
  const billingInterval = sub?.billing_interval ?? null;
  const employerTier = sub?.employer_tier as EmployerTierKey | null;
  const periodEnd = sub?.current_period_end ?? null;
  const cancelAtPeriodEnd = sub?.cancel_at_period_end ?? false;
  const hasPaddleCustomer = !!sub?.paddle_customer_id;

  // Price references
  const proMonthlyPrice = PRO_PLAN.monthly.price;
  const proAnnualPrice = PRO_PLAN.annual.price;
  const employerPrice = employerTier && EMPLOYER_TIERS[employerTier]
    ? (billingInterval === "monthly"
        ? EMPLOYER_TIERS[employerTier].monthly.price
        : EMPLOYER_TIERS[employerTier].annual.price)
    : null;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Billing & Subscription</h1>
        <p className="text-sm text-[#64748b] mt-1">Manage your plan, payment method, and billing history.</p>
      </div>

      {sp.error === "portal_unavailable" && (
        <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3 text-sm text-[#dc2626]">
          The billing portal is temporarily unavailable. Please try again or contact{" "}
          <a href="mailto:support@hayyamed.pro" className="underline">support@hayyamed.pro</a>.
        </div>
      )}
      {sp.error === "no_subscription" && (
        <div className="mb-5 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-sm text-[#92400e]">
          No active subscription found. If you recently upgraded, please wait a few seconds and refresh.
        </div>
      )}

      {/* Current plan card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1">Current plan</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#111]">{planLabel}</span>
              {isPro(plan) && !isOnTrial && (
                <span className="text-xs font-semibold bg-[#e8f0fe] text-[#1a56a0] px-2 py-0.5 rounded-full">Active</span>
              )}
              {isOnTrial && (
                <span className="text-xs font-semibold bg-[#fef9c3] text-[#d97706] px-2 py-0.5 rounded-full">
                  {trialDaysLeft}d remaining
                </span>
              )}
              {plan === "free" && (
                <span className="text-xs font-semibold bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded-full">Free tier</span>
              )}
              {cancelAtPeriodEnd && (
                <span className="text-xs font-semibold bg-[#fef2f2] text-[#dc2626] px-2 py-0.5 rounded-full">Cancels {formatDate(periodEnd)}</span>
              )}
            </div>
            {employerTier && EMPLOYER_TIERS[employerTier] && (
              <p className="text-sm text-[#64748b] mt-0.5">
                {EMPLOYER_TIERS[employerTier].label} tier · up to {EMPLOYER_TIERS[employerTier].maxStaff} staff
              </p>
            )}
          </div>

          {/* Price block */}
          {sub && plan !== "free" && !isOnTrial && (
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-[#111]">
                {plan === "employer" && employerPrice !== null
                  ? `$${employerPrice}`
                  : billingInterval === "monthly"
                  ? `$${proMonthlyPrice}`
                  : `$${proAnnualPrice}`}
              </p>
              <p className="text-xs text-[#64748b]">
                {billingInterval === "monthly" ? "per month" : "per year"}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-[#f1f5f9]">
          <div>
            <p className="text-xs text-[#64748b] mb-0.5">Billing cycle</p>
            <p className="text-sm font-medium text-[#111]">
              {billingInterval === "monthly" ? "Monthly"
               : billingInterval === "annual" ? "Annual (save 15%)"
               : isOnTrial ? "Trial — no charge"
               : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#64748b] mb-0.5">{cancelAtPeriodEnd ? "Access until" : "Next renewal"}</p>
            <p className="text-sm font-medium text-[#111]">
              {isOnTrial ? formatDate(trialEndsAt)
               : periodEnd ? formatDate(periodEnd)
               : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#64748b] mb-0.5">Payment</p>
            <p className="text-sm font-medium text-[#111]">
              {hasPaddleCustomer ? "Card on file" : "—"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#f1f5f9]">
          {hasPaddleCustomer && (
            <a
              href="/api/paddle/portal"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm font-medium text-[#374151] hover:bg-[#f8fafc] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Manage billing
            </a>
          )}
          {!cancelAtPeriodEnd && hasPaddleCustomer && (
            <a
              href="/api/paddle/portal"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
            >
              Cancel subscription
            </a>
          )}
          {(plan === "free" || isOnTrial) && (
            <a
              href="/pricing?source=billing_page"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a56a0] text-sm font-semibold text-white hover:bg-[#1547a0] transition-colors"
            >
              {isOnTrial ? `Upgrade before trial ends (${trialDaysLeft}d left)` : "Upgrade to Pro"}
            </a>
          )}
        </div>
      </div>

      {/* Plan comparison — shown to free + trialing users */}
      {(plan === "free" || isOnTrial) && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-4">
          <h2 className="text-base font-semibold text-[#111] mb-4">What you get with Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "⬇", text: "PDF compliance report (QCHP-ready)" },
              { icon: "✦", text: "AI gap analysis & recommendations" },
              { icon: "💬", text: "AI compliance chatbot (Claude)" },
              { icon: "∞", text: "Unlimited CME activity tracking" },
              { icon: "🔔", text: "License expiry & deadline reminders" },
              { icon: "🔒", text: "Certificate storage with signed URLs" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2.5 text-sm text-[#374151]">
                <span className="text-base w-5 text-center shrink-0">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a href="/pricing?source=billing" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1a56a0] text-white text-sm font-semibold hover:bg-[#1547a0] transition-colors">
              See all plans →
            </a>
            <p className="text-xs text-[#64748b]">${proMonthlyPrice}/month or ${proAnnualPrice}/year · 14-day money-back guarantee</p>
          </div>
        </div>
      )}

      {/* Upgrade to employer */}
      {(plan === "pro" || isOnTrial) && (
        <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#111]">Need to manage a team?</p>
            <p className="text-xs text-[#64748b] mt-0.5">
              Upgrade to an Employer plan to see your full team&apos;s compliance, assign required courses, and download bulk reports.
            </p>
          </div>
          <a
            href="/pricing?source=billing_employer"
            className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-lg border border-[#1a56a0] text-[#1a56a0] hover:bg-[#e8f0fe] transition-colors whitespace-nowrap"
          >
            See Employer plans →
          </a>
        </div>
      )}

      {/* Invoice note */}
      {hasPaddleCustomer && (
        <p className="text-xs text-[#94a3b8] mt-2">
          Invoices and receipts are available in the{" "}
          <a href="/api/paddle/portal" className="text-[#1a56a0] hover:underline">billing portal</a>.
          All amounts in USD. VAT may apply based on your location.
        </p>
      )}
    </div>
  );
}
