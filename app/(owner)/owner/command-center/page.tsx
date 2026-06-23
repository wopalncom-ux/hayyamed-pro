import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

function calcMrr(plan: string, tier: string | null, interval: string | null): number {
  if (plan === "pro") return interval === "annual" ? 61.2 / 12 : 6;
  if (plan === "employer") {
    const prices: Record<string, [number, number]> = {
      clinic:     [50,  510],
      growth:     [100, 1020],
      department: [180, 1836],
      hospital:   [350, 3570],
    };
    const [mo, yr] = prices[tier ?? "clinic"] ?? [50, 510];
    return interval === "annual" ? yr / 12 : mo;
  }
  return 0;
}

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;
}

export default async function OwnerCommandCenterPage() {
  await requireOwnerAuth();
  const admin = createAdminClient();
  const now = new Date();
  const day1Ago   = new Date(now.getTime() - 86400_000).toISOString();
  const day7Ago   = new Date(now.getTime() - 7 * 86400_000).toISOString();
  const day30Ago  = new Date(now.getTime() - 30 * 86400_000).toISOString();
  const day3Later = new Date(now.getTime() + 3 * 86400_000).toISOString();

  const [
    totalUsersRes, newUsersRes, dauRes, suspendedRes,
    subsRes, pastDueRes, trialRes, expiringTrialRes,
    pendingCmeRes, pendingLinksRes, pendingProvidersRes, pendingCoursesRes,
    aiCallsRes, aiCostRes, cmeActsRes, certsRes,
    orgCountRes, employerCountRes, govCountRes, providerCountRes,
    npsRes, waitlistRes, demoNewRes, bouncedRes,
    recentAuditRes, countryStatsRes, emergencyRes,
  ] = await Promise.all([
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).gte("created_at", day7Ago),
    admin.from("cme_activities").select("auth_id").gte("created_at", day1Ago),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("is_suspended", true),
    admin.from("subscriptions").select("plan, employer_tier, billing_interval, status").in("status", ["active", "trialing"]),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).gt("pro_trial_ends_at", now.toISOString()),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).gt("pro_trial_ends_at", now.toISOString()).lte("pro_trial_ends_at", day3Later),
    admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
    admin.from("employer_link_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("training_providers").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("courses").select("id", { count: "exact", head: true }).eq("status", "draft"),
    admin.from("ai_call_logs").select("id", { count: "exact", head: true }).gte("created_at", day30Ago),
    admin.from("ai_call_logs").select("cost_usd").gte("created_at", day30Ago),
    admin.from("cme_activities").select("id", { count: "exact", head: true }),
    admin.from("certificate_storage_records").select("id", { count: "exact", head: true }),
    admin.from("organizations").select("id", { count: "exact", head: true }),
    admin.from("organization_members").select("id", { count: "exact", head: true }).eq("role", "employer_admin"),
    admin.from("organization_members").select("id", { count: "exact", head: true }).eq("role", "government_admin"),
    admin.from("organization_members").select("id", { count: "exact", head: true }).eq("role", "training_provider_admin"),
    admin.from("nps_responses").select("score"),
    admin.from("waitlist_signups").select("id", { count: "exact", head: true }),
    admin.from("demo_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("email_hard_bounced", true),
    admin.from("audit_logs").select("id, action, target_table, created_at, metadata").order("created_at", { ascending: false }).limit(8),
    admin.from("professional_profiles").select("country_of_residence").not("country_of_residence", "is", null),
    admin.from("platform_emergency_controls").select("*").maybeSingle(),
  ]);

  // Revenue
  let totalMrr = 0;
  for (const s of subsRes.data ?? []) totalMrr += calcMrr(s.plan, s.employer_tier, s.billing_interval);
  const totalArr = totalMrr * 12;
  const activeSubs = (subsRes.data ?? []).length;

  // DAU
  const dau = new Set((dauRes.data ?? []).map((r) => r.auth_id)).size;

  // AI cost
  const aiCostTotal = (aiCostRes.data ?? []).reduce((sum, r) => sum + (Number(r.cost_usd) || 0), 0);

  // NPS
  const npsScores = (npsRes.data ?? []).map((r) => r.score as number);
  const npsPromoters  = npsScores.filter((s) => s >= 9).length;
  const npsDetractors = npsScores.filter((s) => s <= 6).length;
  const npsScore = npsScores.length
    ? Math.round(((npsPromoters - npsDetractors) / npsScores.length) * 100)
    : null;

  // Country breakdown (top 5)
  const countryCounts: Record<string, number> = {};
  for (const r of countryStatsRes.data ?? []) {
    const c = r.country_of_residence;
    if (c) countryCounts[c] = (countryCounts[c] ?? 0) + 1;
  }
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const emergency = emergencyRes.data;
  const comingSoon = process.env.COMING_SOON !== "false";
  const isLive = !comingSoon && !emergency?.maintenance_mode;

  const setupChecks = [
    { label: "Supabase",           ok: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY), href: "/owner/integrations" },
    { label: "Email (Postmark)",   ok: !!process.env.POSTMARK_API_TOKEN, href: "/owner/integrations" },
    { label: "Vertex AI",          ok: !!process.env.GOOGLE_CLOUD_PROJECT, href: "/owner/ai" },
    { label: "Paddle (Payments)",  ok: !!process.env.PADDLE_API_KEY, href: "/owner/integrations" },
    { label: "Cron Jobs",          ok: !!process.env.CRON_SECRET, href: "/owner/monitoring" },
    { label: "Push Notifications", ok: !!process.env.VAPID_PRIVATE_KEY, href: "/owner/integrations" },
  ];

  const kpiRows = [
    {
      title: "Users & Activity",
      cards: [
        { label: "Total Users",    value: String(totalUsersRes.count ?? 0),  sub: "registered professionals", color: "blue" },
        { label: "New (7 days)",   value: String(newUsersRes.count ?? 0),     sub: "new registrations",       color: "green" },
        { label: "Active Today",   value: String(dau),                        sub: "daily active users",      color: "purple" },
        { label: "Suspended",      value: String(suspendedRes.count ?? 0),    sub: "banned accounts",         color: (suspendedRes.count ?? 0) > 0 ? "red" : "gray" },
      ],
    },
    {
      title: "Revenue & Subscriptions",
      cards: [
        { label: "MRR",            value: fmt(totalMrr),      sub: "monthly recurring",    color: "amber" },
        { label: "ARR",            value: fmt(totalArr),      sub: "annualized revenue",   color: "amber" },
        { label: "Active Subs",    value: String(activeSubs), sub: "paying subscribers",   color: "green" },
        { label: "Past-Due",       value: String(pastDueRes.count ?? 0), sub: "payment failed", color: (pastDueRes.count ?? 0) > 0 ? "red" : "gray" },
      ],
    },
    {
      title: "Operations",
      cards: [
        { label: "CME Queue",      value: String(pendingCmeRes.count ?? 0),      sub: "awaiting verification", color: (pendingCmeRes.count ?? 0) > 0 ? "orange" : "gray" },
        { label: "Link Requests",  value: String(pendingLinksRes.count ?? 0),    sub: "employer links",        color: (pendingLinksRes.count ?? 0) > 0 ? "orange" : "gray" },
        { label: "Providers",      value: String(pendingProvidersRes.count ?? 0),sub: "provider applications", color: (pendingProvidersRes.count ?? 0) > 0 ? "orange" : "gray" },
        { label: "Courses",        value: String(pendingCoursesRes.count ?? 0),  sub: "awaiting review",       color: (pendingCoursesRes.count ?? 0) > 0 ? "orange" : "gray" },
      ],
    },
    {
      title: "Platform Intelligence",
      cards: [
        { label: "AI Calls (30d)",  value: String(aiCallsRes.count ?? 0),   sub: "AI API requests",     color: "purple" },
        { label: "AI Cost (30d)",   value: `$${aiCostTotal.toFixed(2)}`,     sub: "USD, last 30 days",   color: aiCostTotal > 50 ? "red" : "gray" },
        { label: "CME Activities",  value: String(cmeActsRes.count ?? 0),   sub: "total logged",         color: "blue" },
        { label: "Certificates",    value: String(certsRes.count ?? 0),     sub: "uploaded & stored",    color: "green" },
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue:   { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    green:  { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    purple: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
    red:    { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
    amber:  { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
    orange: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
    gray:   { bg: "#f8fafc", text: "#374151", border: "#e2e8f0" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#0f172a" }}>
            Owner Command Center
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
            {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {emergency?.maintenance_mode && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-red-50 text-red-700 border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Maintenance Mode
            </span>
          )}
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
            isLive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-500" : "bg-amber-500"}`} />
            {isLive ? "Platform Live" : comingSoon ? "Coming Soon Mode" : "Maintenance"}
          </span>
          <a
            href="/owner/emergency"
            className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
            style={{ background: "#fef2f2", color: "#b91c1c", borderColor: "#fecaca" }}
          >
            Emergency Controls →
          </a>
        </div>
      </div>

      {/* Setup issues */}
      {setupChecks.some((c) => !c.ok) && (
        <div className="rounded-xl border p-4" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "#92400e" }}>
            ⚠ Platform Setup — Action Required
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {setupChecks.filter((c) => !c.ok).map((c) => (
              <a key={c.label} href={c.href}
                className="flex items-center gap-2 text-sm hover:underline"
                style={{ color: "#b45309" }}>
                <span style={{ color: "#dc2626" }} className="font-bold">✗</span>
                {c.label} not configured
              </a>
            ))}
          </div>
        </div>
      )}

      {/* KPI rows */}
      {kpiRows.map((row) => (
        <div key={row.title}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#94a3b8" }}>
            {row.title}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {row.cards.map((card) => {
              const c = colorMap[card.color] ?? colorMap.gray;
              return (
                <div
                  key={card.label}
                  className="rounded-xl border p-5"
                  style={{ background: c.bg, borderColor: c.border }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: c.text, opacity: 0.7 }}>
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold tabular-nums" style={{ color: c.text }}>
                    {card.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: c.text, opacity: 0.6 }}>{card.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Platform overview row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NPS + Org breakdown */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">Platform Overview</p>
          <div className="space-y-3">
            {[
              { label: "Organizations",       value: String(orgCountRes.count ?? 0) },
              { label: "Employers",           value: String(employerCountRes.count ?? 0) },
              { label: "Government Authorities", value: String(govCountRes.count ?? 0) },
              { label: "Training Providers",  value: String(providerCountRes.count ?? 0) },
              { label: "Active Trials",       value: String(trialRes.count ?? 0) },
              { label: "Expiring (3 days)",   value: String(expiringTrialRes.count ?? 0) },
              { label: "Waitlist",            value: String(waitlistRes.count ?? 0) },
              { label: "Demo Requests",       value: String(demoNewRes.count ?? 0) },
              { label: "Email Bounces",       value: String(bouncedRes.count ?? 0) },
              { label: "NPS Score",           value: npsScore !== null ? (npsScore > 0 ? `+${npsScore}` : String(npsScore)) : "—" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[#64748b]">{item.label}</span>
                <span className="font-bold text-[#0f172a] tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top countries */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">Users by Country</p>
          {topCountries.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No country data yet</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map(([country, count]) => {
                const pct = Math.round((count / (totalUsersRes.count ?? 1)) * 100);
                return (
                  <div key={country}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[#374151] font-medium">{country}</span>
                      <span className="text-[#64748b] tabular-nums">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: "#1a56a0" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent audit */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Recent Activity</p>
            <a href="/owner/audit" className="text-xs text-[#1a56a0] hover:underline">View all →</a>
          </div>
          <div className="space-y-3">
            {(recentAuditRes.data ?? []).map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] flex-shrink-0 mt-1.5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#374151] truncate">{log.action}</p>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    {log.target_table && <span className="text-[#64748b]">{log.target_table} · </span>}
                    {new Date(log.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {(recentAuditRes.data ?? []).length === 0 && (
              <p className="text-sm text-[#94a3b8]">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Module navigation grid */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">All Modules</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "User Management",
              desc: "All users, roles, suspension, activity history",
              href: "/owner/users",
              icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z",
              badge: totalUsersRes.count ?? 0,
            },
            {
              title: "Revenue Center",
              desc: "MRR, ARR, subscriptions, churn, country revenue",
              href: "/owner/revenue",
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              badge: undefined,
            },
            {
              title: "AI Command Center",
              desc: "Usage, token cost, models, failures by org",
              href: "/owner/ai",
              icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
              badge: aiCallsRes.count ?? 0,
            },
            {
              title: "Platform Monitoring",
              desc: "Uptime, API performance, errors, storage",
              href: "/owner/monitoring",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              badge: undefined,
            },
            {
              title: "Integration Center",
              desc: "Supabase, Paddle, Postmark, AI, Push status",
              href: "/owner/integrations",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              badge: undefined,
            },
            {
              title: "Compliance Control",
              desc: "CME rules, country rules, compliance rates",
              href: "/owner/compliance",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              badge: undefined,
            },
            {
              title: "Audit & Security",
              desc: "Every action, who, when, IP, change log",
              href: "/owner/audit",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              badge: undefined,
            },
            {
              title: "Emergency Controls",
              desc: "Maintenance mode, kill switches, force logout",
              href: "/owner/emergency",
              icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
              badge: undefined,
              danger: true,
            },
          ].map((mod) => (
            <a
              key={mod.href}
              href={mod.href}
              className={`group rounded-xl border p-5 hover:shadow-md transition-all ${
                mod.danger
                  ? "bg-red-50 border-red-200 hover:border-red-300"
                  : "bg-white border-[#e2e8f0] hover:border-[#1a56a0]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  mod.danger ? "bg-red-100" : "bg-[#eff6ff]"
                }`}>
                  <svg className={`w-5 h-5 ${mod.danger ? "text-red-600" : "text-[#1a56a0]"}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d={mod.icon} clipRule="evenodd" />
                  </svg>
                </div>
                {mod.badge !== undefined && mod.badge > 0 && (
                  <span className="text-xs font-bold text-white bg-[#1a56a0] px-2 py-0.5 rounded-full">
                    {mod.badge > 999 ? "999+" : mod.badge}
                  </span>
                )}
              </div>
              <p className={`text-sm font-semibold mb-1 ${mod.danger ? "text-red-700" : "text-[#0f172a]"}`}>
                {mod.title}
              </p>
              <p className="text-xs text-[#64748b] leading-relaxed">{mod.desc}</p>
              <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${
                mod.danger ? "text-red-600" : "text-[#1a56a0]"
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                Open →
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick admin links */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">
          Admin Panel Quick Links
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2">
          {[
            ["/admin/professionals", "Professionals"],
            ["/admin/organizations", "Organizations"],
            ["/admin/employers", "Employers"],
            ["/admin/link-requests", "Link Requests"],
            ["/admin/cme-verification", "CME Queue"],
            ["/admin/training-providers", "Providers"],
            ["/admin/courses", "Courses"],
            ["/admin/reviews", "Reviews"],
            ["/admin/revenue", "Revenue Dashboard"],
            ["/admin/subscriptions", "Subscriptions"],
            ["/admin/discounts", "Discounts"],
            ["/admin/analytics", "Analytics"],
            ["/admin/nps", "NPS Survey"],
            ["/admin/partners", "Partners"],
            ["/admin/growth", "Growth"],
            ["/admin/reports", "Reports"],
            ["/admin/ai-modules", "AI Modules"],
            ["/admin/ai-costs", "AI Costs"],
            ["/admin/feature-flags", "Feature Flags"],
            ["/admin/webhooks", "Webhooks"],
            ["/admin/monitoring", "Monitoring"],
            ["/admin/health", "Health"],
            ["/admin/audit-logs", "Audit Logs"],
            ["/admin/settings", "Platform Settings"],
            ["/admin/content", "CMS Content"],
            ["/admin/media", "Media Library"],
            ["/admin/seo", "SEO Manager"],
            ["/admin/db", "DB Explorer"],
            ["/admin/logs", "Logs Center"],
            ["/admin/exports", "Data Exports"],
            ["/admin/email-campaigns", "Email Campaigns"],
            ["/admin/announcements", "Announcements"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-1.5 py-1 text-sm text-[#374151] hover:text-[#1a56a0] transition-colors"
            >
              <span className="w-1 h-1 rounded-full bg-[#cbd5e1] flex-shrink-0" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
