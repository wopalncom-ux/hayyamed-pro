import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Faculty Analytics — University Portal" };

type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "unknown";

const STATUS_LABELS: Record<ComplianceStatus, string> = {
  compliant: "Compliant",
  at_risk: "At Risk",
  non_compliant: "Non-Compliant",
  unknown: "No Data",
};

export default async function UniversityAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "university_admin")
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Your Institution";

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const facultyIds = (approved ?? []).map((r) => r.professional_id);
  const total = facultyIds.length;

  if (total === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#111] mb-2">Faculty Analytics</h1>
        <p className="text-sm text-[#64748b] mb-8">{orgName}</p>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-base font-semibold text-[#111] mb-2">No analytics yet</h2>
          <p className="text-sm text-[#64748b]">Add faculty to your institution to start seeing compliance analytics.</p>
        </div>
      </div>
    );
  }

  const [walletsRes, profilesRes, activitiesRes] = await Promise.all([
    admin.from("cme_wallets")
      .select("professional_id, completed_credits, required_credits, compliance_status")
      .in("professional_id", facultyIds),
    admin.from("professional_profiles")
      .select("auth_id, profession, specialty, license_expiry")
      .in("auth_id", facultyIds),
    admin.from("cme_activities")
      .select("professional_id, credits, category, activity_date, verification_status")
      .in("professional_id", facultyIds)
      .eq("verification_status", "verified"),
  ]);

  const wallets = walletsRes.data ?? [];
  const profiles = profilesRes.data ?? [];
  const activities = activitiesRes.data ?? [];

  // Compliance breakdown
  const statusCounts: Record<ComplianceStatus, number> = { compliant: 0, at_risk: 0, non_compliant: 0, unknown: 0 };
  for (const w of wallets) {
    const s = (w.compliance_status as ComplianceStatus) ?? "unknown";
    statusCounts[s] = (statusCounts[s] ?? 0) + 1;
  }
  const withWallet = new Set(wallets.map((w) => w.professional_id));
  const noWallet = total - withWallet.size;
  statusCounts.unknown += noWallet;

  const complianceRate = total > 0 ? Math.round((statusCounts.compliant / total) * 100) : 0;

  // Average credits
  const avgCompleted = wallets.length > 0
    ? Math.round(wallets.reduce((s, w) => s + (w.completed_credits ?? 0), 0) / wallets.length)
    : 0;
  const avgRequired = wallets.length > 0
    ? Math.round(wallets.reduce((s, w) => s + (w.required_credits ?? 0), 0) / wallets.length)
    : 0;

  // License expiry breakdown
  const now = Date.now();
  let expired = 0, expiring30 = 0, expiring90 = 0, active = 0, unknown = 0;
  for (const p of profiles) {
    if (!p.license_expiry) { unknown++; continue; }
    const days = Math.ceil((new Date(p.license_expiry).getTime() - now) / 86400000);
    if (days < 0) expired++;
    else if (days <= 30) expiring30++;
    else if (days <= 90) expiring90++;
    else active++;
  }

  // Profession breakdown
  const professionMap = new Map<string, { compliant: number; total: number }>();
  for (const p of profiles) {
    const key = p.profession ?? "Unknown";
    if (!professionMap.has(key)) professionMap.set(key, { compliant: 0, total: 0 });
    const entry = professionMap.get(key)!;
    entry.total++;
    const wallet = wallets.find((w) => w.professional_id === p.auth_id);
    if (wallet?.compliance_status === "compliant") entry.compliant++;
  }
  const professionRows = [...professionMap.entries()]
    .map(([name, { compliant: c, total: t }]) => ({ name, compliant: c, total: t, rate: Math.round((c / t) * 100) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // CME activity categories
  const categoryMap = new Map<string, number>();
  for (const a of activities) {
    const key = a.category ?? "Other";
    categoryMap.set(key, (categoryMap.get(key) ?? 0) + (a.credits ?? 0));
  }
  const categoryRows = [...categoryMap.entries()]
    .map(([name, credits]) => ({ name, credits }))
    .sort((a, b) => b.credits - a.credits)
    .slice(0, 6);
  const totalCategoryCredits = categoryRows.reduce((s, r) => s + r.credits, 0);

  // Monthly activity volume (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyMap = new Map<string, number>();
  for (const a of activities) {
    const d = new Date(a.activity_date);
    if (d < sixMonthsAgo) continue;
    const key = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
  }
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }));
  }
  const monthlyRows = months.map((m) => ({ month: m, count: monthlyMap.get(m) ?? 0 }));
  const maxMonthly = Math.max(...monthlyRows.map((r) => r.count), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Faculty Analytics</h1>
        <p className="text-sm text-[#64748b] mt-1">{orgName} · {total} faculty members</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Compliance Rate" value={`${complianceRate}%`} sub={`${statusCounts.compliant} of ${total} compliant`} color={complianceRate >= 80 ? "green" : complianceRate >= 60 ? "orange" : "red"} />
        <KpiCard label="Avg Credits Completed" value={avgCompleted.toString()} sub={`of ${avgRequired} required avg`} color="blue" />
        <KpiCard label="Total CME Activities" value={activities.length.toString()} sub="verified activities" color="blue" />
        <KpiCard label="Licenses Expiring ≤30d" value={expiring30.toString()} sub={`${expired} already expired`} color={expiring30 + expired > 0 ? "red" : "green"} />
      </div>

      {/* Compliance status + License expiry side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

        {/* Compliance donut-style breakdown */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-4">Compliance Status Breakdown</h2>
          <div className="space-y-3">
            {(["compliant", "at_risk", "non_compliant", "unknown"] as ComplianceStatus[]).map((s) => {
              const count = statusCounts[s];
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const colors: Record<ComplianceStatus, { bar: string; label: string }> = {
                compliant:     { bar: "bg-[#16a34a]", label: "text-[#16a34a]" },
                at_risk:       { bar: "bg-[#d97706]", label: "text-[#d97706]" },
                non_compliant: { bar: "bg-[#dc2626]", label: "text-[#dc2626]" },
                unknown:       { bar: "bg-[#94a3b8]", label: "text-[#64748b]" },
              };
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#374151]">{STATUS_LABELS[s]}</span>
                    <span className={`font-semibold ${colors[s].label}`}>{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                    <div className={`${colors[s].bar} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* License expiry */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-4">License Expiry Status</h2>
          <div className="space-y-3">
            {[
              { label: "Expired",          value: expired,    color: "bg-[#dc2626]", textColor: "text-[#dc2626]" },
              { label: "Expiring ≤30 days",value: expiring30, color: "bg-[#f97316]", textColor: "text-[#f97316]" },
              { label: "Expiring ≤90 days",value: expiring90, color: "bg-[#d97706]", textColor: "text-[#d97706]" },
              { label: "Active (>90 days)",value: active,     color: "bg-[#16a34a]", textColor: "text-[#16a34a]" },
              { label: "Not provided",     value: unknown,    color: "bg-[#94a3b8]", textColor: "text-[#64748b]" },
            ].map(({ label, value, color, textColor }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#374151]">{label}</span>
                    <span className={`font-semibold ${textColor}`}>{value} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CME activity volume chart */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#111] mb-1">CME Activity Volume</h2>
        <p className="text-xs text-[#64748b] mb-5">Verified activities submitted by faculty — last 6 months</p>
        <div className="flex items-end gap-2 h-28">
          {monthlyRows.map(({ month, count }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-[#1a56a0]">{count > 0 ? count : ""}</span>
              <div
                className="w-full bg-[#1a56a0] rounded-t-md transition-all"
                style={{ height: `${Math.max((count / maxMonthly) * 80, count > 0 ? 4 : 2)}px`, opacity: count === 0 ? 0.15 : 1 }}
              />
              <span className="text-xs text-[#94a3b8] text-center leading-tight">{month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row: profession breakdown + category breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Profession compliance */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-4">Compliance by Profession</h2>
          {professionRows.length === 0 ? (
            <p className="text-sm text-[#64748b]">No profession data yet.</p>
          ) : (
            <div className="space-y-3">
              {professionRows.map(({ name, compliant: c, total: t, rate }) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#374151] truncate max-w-[60%]">{name}</span>
                    <span className="text-[#64748b] flex-shrink-0 ml-2">{c}/{t} · <span className={`font-semibold ${rate >= 80 ? "text-[#16a34a]" : rate >= 60 ? "text-[#d97706]" : "text-[#dc2626]"}`}>{rate}%</span></span>
                  </div>
                  <div className="w-full bg-[#f1f5f9] rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${rate >= 80 ? "bg-[#16a34a]" : rate >= 60 ? "bg-[#d97706]" : "bg-[#dc2626]"}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CME category credits */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-4">Credits by CME Category</h2>
          {categoryRows.length === 0 ? (
            <p className="text-sm text-[#64748b]">No verified activities yet.</p>
          ) : (
            <div className="space-y-3">
              {categoryRows.map(({ name, credits }) => {
                const pct = totalCategoryCredits > 0 ? Math.round((credits / totalCategoryCredits) * 100) : 0;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-[#374151] truncate max-w-[60%] capitalize">{name.replace(/_/g, " ")}</span>
                      <span className="text-[#1a56a0] font-semibold ml-2">{credits} credits ({pct}%)</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1.5">
                      <div className="bg-[#1a56a0] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: "blue" | "green" | "orange" | "red" }) {
  const colors = { blue: "text-[#1a56a0]", green: "text-[#16a34a]", orange: "text-[#d97706]", red: "text-[#dc2626]" };
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-[#94a3b8] mt-1">{sub}</p>
    </div>
  );
}
