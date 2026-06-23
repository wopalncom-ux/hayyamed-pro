import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance Control",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function OwnerCompliancePage() {
  await requireOwnerAuth();
  const admin = createAdminClient();

  const [
    countryRulesRes, walletStatsRes, activitiesRes,
    pendingCmeRes, verifiedCmeRes, rejectedCmeRes,
    categoryRulesRes, complianceSnapshotsRes,
  ] = await Promise.all([
    admin.from("country_compliance_rules").select("country_code, profession, cycle_months, required_credits, cycle_label, is_active").order("country_code"),
    admin.from("cme_wallets").select("country, compliance_status, completed_credits, required_credits"),
    admin.from("cme_activities").select("category, verification_status, credits"),
    admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
    admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "verified"),
    admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "rejected"),
    admin.from("compliance_activity_categories").select("country_code, category_name, max_credits, credit_conversion_factor").order("country_code").limit(30),
    admin.from("compliance_snapshots").select("country_code, compliance_rate, snapshot_date").order("snapshot_date", { ascending: false }).limit(20),
  ]);

  // Compliance rate by country (from wallets)
  const wallets = walletStatsRes.data ?? [];
  const countryStats: Record<string, { total: number; compliant: number; inProgress: number; nonCompliant: number }> = {};
  for (const w of wallets) {
    const c = w.country ?? "Unknown";
    if (!countryStats[c]) countryStats[c] = { total: 0, compliant: 0, inProgress: 0, nonCompliant: 0 };
    countryStats[c].total++;
    if (w.compliance_status === "compliant") countryStats[c].compliant++;
    else if (w.compliance_status === "in_progress") countryStats[c].inProgress++;
    else countryStats[c].nonCompliant++;
  }

  // Activity stats by category
  const catStats: Record<string, { total: number; credits: number }> = {};
  for (const a of activitiesRes.data ?? []) {
    const cat = a.category ?? "uncategorized";
    if (!catStats[cat]) catStats[cat] = { total: 0, credits: 0 };
    catStats[cat].total++;
    catStats[cat].credits += Number(a.credits) || 0;
  }
  const topCategories = Object.entries(catStats).sort((a, b) => b[1].total - a[1].total).slice(0, 6);

  // Unique countries in rules
  const uniqueCountries = [...new Set((countryRulesRes.data ?? []).map((r) => r.country_code))];

  const totalWallets     = wallets.length;
  const compliantCount   = wallets.filter((w) => w.compliance_status === "compliant").length;
  const complianceRate   = totalWallets > 0 ? Math.round((compliantCount / totalWallets) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Compliance Control Center</h1>
          <p className="text-sm text-[#64748b] mt-0.5">CME rules, country compliance rates, and verification queue</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/country-rules" className="text-sm font-semibold text-[#1a56a0] hover:underline">
            Edit Country Rules →
          </a>
          <a href="/admin/cme-verification" className="text-sm font-semibold text-[#1a56a0] hover:underline">
            CME Queue →
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Overall Compliance", value: `${complianceRate}%`,             sub: `${compliantCount}/${totalWallets} wallets`,   color: complianceRate >= 80 ? "#15803d" : "#d97706" },
          { label: "CME Pending",        value: String(pendingCmeRes.count ?? 0), sub: "awaiting verification",                        color: (pendingCmeRes.count ?? 0) > 0 ? "#d97706" : "#64748b" },
          { label: "CME Verified",       value: String(verifiedCmeRes.count ?? 0),sub: "total verified activities",                   color: "#15803d" },
          { label: "Countries",          value: String(uniqueCountries.length),   sub: "configured country rules",                    color: "#1a56a0" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-2">{k.label}</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Compliance by country */}
      {Object.keys(countryStats).length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">Compliance Rate by Country</p>
          <div className="space-y-4">
            {Object.entries(countryStats)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([country, stats]) => {
                const rate = Math.round((stats.compliant / stats.total) * 100);
                return (
                  <div key={country}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-[#374151]">{country}</span>
                      <div className="flex items-center gap-3 text-xs text-[#64748b]">
                        <span>{stats.total} users</span>
                        <span className={`font-bold tabular-nums ${rate >= 80 ? "text-green-600" : rate >= 60 ? "text-amber-600" : "text-red-600"}`}>
                          {rate}% compliant
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${rate}%`, background: rate >= 80 ? "#16a34a" : rate >= 60 ? "#d97706" : "#dc2626" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country rules summary */}
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0f172a]">Country Rules Engine</p>
            <a href="/admin/country-rules" className="text-xs text-[#1a56a0] hover:underline font-semibold">Edit →</a>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {uniqueCountries.map((cc) => {
              const rules = (countryRulesRes.data ?? []).filter((r) => r.country_code === cc);
              const active = rules.filter((r) => r.is_active).length;
              return (
                <div key={cc} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#374151]">{cc}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{active} active rules · {rules[0]?.cycle_label ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#0f172a]">{rules[0]?.required_credits ?? "—"} credits</p>
                    <p className="text-xs text-[#94a3b8]">{rules[0]?.cycle_months ?? "—"}mo cycle</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity category breakdown */}
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0f172a]">CME by Category</p>
            <a href="/admin/cme-activities" className="text-xs text-[#1a56a0] hover:underline font-semibold">All activities →</a>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {topCategories.map(([cat, data]) => (
              <div key={cat} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[#374151] capitalize">{cat.replace(/_/g, " ")}</p>
                <div className="flex items-center gap-4 text-sm flex-shrink-0">
                  <span className="text-[#64748b] tabular-nums">{data.total} activities</span>
                  <span className="font-bold text-[#0f172a] tabular-nums">{data.credits.toFixed(1)} credits</span>
                </div>
              </div>
            ))}
            {topCategories.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-[#94a3b8]">No activities yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/cme-verification",  label: "CME Verification Queue" },
          { href: "/admin/country-rules",     label: "Edit Country Rules" },
          { href: "/admin/compliance",        label: "Compliance Map" },
          { href: "/admin/cme-activities",    label: "All CME Activities" },
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
