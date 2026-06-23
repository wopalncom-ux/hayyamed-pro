import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Center",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function calcMrr(plan: string, tier: string | null, interval: string | null): number {
  if (plan === "pro") return interval === "annual" ? 61.2 / 12 : 6;
  if (plan === "employer") {
    const prices: Record<string, [number, number]> = {
      clinic: [50, 510], growth: [100, 1020], department: [180, 1836], hospital: [350, 3570],
    };
    const [mo, yr] = prices[tier ?? "clinic"] ?? [50, 510];
    return interval === "annual" ? yr / 12 : mo;
  }
  return 0;
}

export default async function OwnerRevenuePage() {
  await requireOwnerAuth();
  const admin = createAdminClient();

  const [subsRes, pastDueRes, canceledRes, trialRes, planSettingsRes, recentSubsRes] = await Promise.all([
    admin.from("subscriptions").select("plan, employer_tier, billing_interval, status, created_at, professional_id"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "canceled"),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).gt("pro_trial_ends_at", new Date().toISOString()),
    admin.from("platform_settings").select("key, value").in("key", [
      "pro_price_monthly", "pro_price_annual",
      "employer_clinic_monthly", "employer_growth_monthly",
      "employer_dept_monthly", "employer_hospital_monthly",
    ]),
    admin.from("subscriptions")
      .select("plan, employer_tier, billing_interval, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const allSubs = subsRes.data ?? [];
  const activeSubs = allSubs.filter((s) => s.status === "active" || s.status === "trialing");

  let totalMrr = 0;
  const mrrByPlan: Record<string, number> = { pro: 0, employer: 0 };
  const mrrByInterval: Record<string, number> = { monthly: 0, annual: 0 };
  const subsByPlan: Record<string, number> = {};
  const subsByTier: Record<string, number> = {};

  for (const s of activeSubs) {
    const mrr = calcMrr(s.plan, s.employer_tier, s.billing_interval);
    totalMrr += mrr;
    mrrByPlan[s.plan] = (mrrByPlan[s.plan] ?? 0) + mrr;
    mrrByInterval[s.billing_interval ?? "monthly"] = (mrrByInterval[s.billing_interval ?? "monthly"] ?? 0) + mrr;
    subsByPlan[s.plan] = (subsByPlan[s.plan] ?? 0) + 1;
    if (s.employer_tier) subsByTier[s.employer_tier] = (subsByTier[s.employer_tier] ?? 0) + 1;
  }

  const totalArr = totalMrr * 12;
  const settings = Object.fromEntries((planSettingsRes.data ?? []).map((r) => [r.key, r.value]));

  function fmt(n: number) { return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`; }
  function fmtExact(n: number) { return `$${n.toFixed(2)}`; }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Revenue & Subscriptions</h1>
          <p className="text-sm text-[#64748b] mt-0.5">MRR, ARR, plan breakdown, and subscription health</p>
        </div>
        <a href="/admin/revenue" className="text-sm font-semibold text-[#1a56a0] hover:underline">
          Full Revenue Dashboard →
        </a>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "MRR",              value: fmt(totalMrr),                     sub: "monthly recurring",    color: "#1a56a0" },
          { label: "ARR",              value: fmt(totalArr),                     sub: "annualized",           color: "#1a56a0" },
          { label: "Active Subs",      value: String(activeSubs.length),          sub: "paying subscribers",   color: "#15803d" },
          { label: "Past-Due",         value: String(pastDueRes.count ?? 0),      sub: "payment failed",       color: (pastDueRes.count ?? 0) > 0 ? "#b91c1c" : "#64748b" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-2">{k.label}</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By plan */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">MRR by Plan</p>
          <div className="space-y-4">
            {Object.entries(mrrByPlan).filter(([, v]) => v > 0).map(([plan, mrr]) => (
              <div key={plan}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#374151] capitalize">{plan}</span>
                  <span className="font-bold text-[#0f172a] tabular-nums">{fmtExact(mrr)}/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1a56a0]"
                      style={{ width: `${totalMrr > 0 ? Math.round((mrr / totalMrr) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#94a3b8] w-8 text-right">
                    {totalMrr > 0 ? Math.round((mrr / totalMrr) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
            {Object.values(mrrByPlan).every((v) => v === 0) && (
              <p className="text-sm text-[#94a3b8]">No revenue data yet</p>
            )}
          </div>
        </div>

        {/* By billing interval */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">Subscriptions</p>
          <div className="space-y-3">
            {[
              { label: "Active",      value: activeSubs.length,              color: "#15803d" },
              { label: "Monthly",     value: subsByPlan.pro ?? 0,            color: "#64748b" },
              { label: "Employer",    value: subsByPlan.employer ?? 0,       color: "#64748b" },
              { label: "Active Trials", value: trialRes.count ?? 0,          color: "#d97706" },
              { label: "Past-Due",    value: pastDueRes.count ?? 0,          color: "#b91c1c" },
              { label: "Canceled",    value: canceledRes.count ?? 0,         color: "#94a3b8" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-[#64748b]">{row.label}</span>
                <span className="font-bold tabular-nums" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current pricing */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Current Pricing</p>
            <a href="/admin/settings" className="text-[10px] text-[#1a56a0] hover:underline font-semibold">Edit →</a>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Pro Monthly",      key: "pro_price_monthly",         suffix: "/mo" },
              { label: "Pro Annual",       key: "pro_price_annual",          suffix: "/yr" },
              { label: "Clinic Monthly",   key: "employer_clinic_monthly",   suffix: "/mo" },
              { label: "Growth Monthly",   key: "employer_growth_monthly",   suffix: "/mo" },
              { label: "Dept Monthly",     key: "employer_dept_monthly",     suffix: "/mo" },
              { label: "Hospital Monthly", key: "employer_hospital_monthly", suffix: "/mo" },
            ].map((p) => (
              <div key={p.key} className="flex items-center justify-between text-sm">
                <span className="text-[#64748b]">{p.label}</span>
                <span className="font-bold text-[#0f172a] tabular-nums">
                  {settings[p.key] ? `$${settings[p.key]}${p.suffix}` : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employer tier breakdown */}
      {Object.keys(subsByTier).length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">Employer Tier Breakdown</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["clinic", "growth", "department", "hospital"].map((tier) => (
              <div key={tier} className="text-center p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="text-xl font-bold text-[#0f172a] tabular-nums">{subsByTier[tier] ?? 0}</p>
                <p className="text-xs text-[#64748b] mt-1 capitalize">{tier}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent subscriptions */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0f172a]">Recent Subscriptions</p>
          <a href="/admin/subscriptions" className="text-xs text-[#1a56a0] hover:underline font-semibold">View all →</a>
        </div>
        <div className="divide-y divide-[#f8fafc]">
          {(recentSubsRes.data ?? []).map((s, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  s.plan === "pro" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                }`}>
                  {s.plan}{s.employer_tier ? ` · ${s.employer_tier}` : ""}
                </span>
                <span className="text-xs text-[#64748b]">{s.billing_interval ?? "monthly"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  s.status === "active" ? "bg-green-100 text-green-700" :
                  s.status === "trialing" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {s.status}
                </span>
                <span className="text-xs text-[#94a3b8]">
                  {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: "/admin/subscriptions", label: "Manage Subscriptions" },
          { href: "/admin/discounts",     label: "Discount Codes" },
          { href: "/admin/qpay-invoices", label: "QPay Invoices" },
        ].map((l) => (
          <a key={l.href} href={l.href}
            className="text-center px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-sm font-semibold text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors">
            {l.label} →
          </a>
        ))}
      </div>
    </div>
  );
}
