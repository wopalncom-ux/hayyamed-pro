import { createAdminClient } from "@/lib/supabase/server";
import VerifiedRequestActions from "@/components/admin/VerifiedRequestActions";
import UnverifiedRequestActions from "@/components/admin/UnverifiedRequestActions";
import CmeActivityActions from "@/components/admin/CmeActivityActions";

export const metadata = { title: "Command Center" };
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

export default async function AdminPage() {
  const admin = createAdminClient();
  const now = new Date();
  const day1 = new Date(now.getTime() - 24 * 3600_000).toISOString();
  const day3later = new Date(now.getTime() + 3 * 86400_000).toISOString();

  const [
    profCountRes,
    pendingLinksCountRes,
    pendingLinksRes,
    pendingCmeCountRes,
    pendingCmeRes,
    pendingProvidersRes,
    pendingCoursesRes,
    subsRes,
    pastDueRes,
    activeTrialsRes,
    expiringTrialsRes,
    npsRes,
    bouncedRes,
    spamRes,
    waitlistRes,
    demoNewRes,
    dauRes,
  ] = await Promise.all([
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
    admin.from("employer_link_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin
      .from("employer_link_requests")
      .select("id, professional_id, organization_id, unverified_employer_name, organizations(name)")
      .eq("status", "pending")
      .order("requested_at", { ascending: true })
      .limit(5),
    admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
    admin
      .from("cme_activities")
      .select("id, professional_id, title, activity_date, credits, verification_status")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: true })
      .limit(5),
    admin.from("training_providers").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("courses").select("id", { count: "exact", head: true }).eq("status", "draft"),
    admin
      .from("subscriptions")
      .select("plan, employer_tier, billing_interval, status")
      .in("status", ["active", "trialing"]),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
    admin
      .from("professional_profiles")
      .select("id", { count: "exact", head: true })
      .gt("pro_trial_ends_at", now.toISOString()),
    admin
      .from("professional_profiles")
      .select("id", { count: "exact", head: true })
      .gt("pro_trial_ends_at", now.toISOString())
      .lte("pro_trial_ends_at", day3later),
    admin.from("nps_responses").select("score"),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("email_hard_bounced", true),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("email_spam_reported", true),
    admin.from("waitlist_signups").select("id", { count: "exact", head: true }),
    admin.from("demo_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    admin.from("cme_activities").select("auth_id").gte("created_at", day1),
  ]);

  // Profile lookups for quick-approve rows
  const linkProfIds = (pendingLinksRes.data ?? []).map((r) => r.professional_id);
  const cmeProfIds  = (pendingCmeRes.data ?? []).map((r) => r.professional_id);
  const allProfIds  = [...new Set([...linkProfIds, ...cmeProfIds])];
  const profilesRes = allProfIds.length
    ? await admin
        .from("professional_profiles")
        .select("auth_id, full_name, profession")
        .in("auth_id", allProfIds)
    : { data: [] };
  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.auth_id, p])
  );

  // KPI calculations
  const profCount        = profCountRes.count ?? 0;
  const pendingLinksCount = pendingLinksCountRes.count ?? 0;
  const pendingCmeCount  = pendingCmeCountRes.count ?? 0;
  const pendingProviders = pendingProvidersRes.count ?? 0;
  const pendingCourses   = pendingCoursesRes.count ?? 0;
  const pastDue          = pastDueRes.count ?? 0;
  const activeTrials     = activeTrialsRes.count ?? 0;
  const expiringTrials   = expiringTrialsRes.count ?? 0;
  const bounced          = bouncedRes.count ?? 0;
  const spam             = spamRes.count ?? 0;
  const demoNew          = demoNewRes.count ?? 0;
  const waitlist         = waitlistRes.count ?? 0;
  const dau              = new Set((dauRes.data ?? []).map((r) => r.auth_id)).size;

  const npsScores    = (npsRes.data ?? []).map((r) => r.score as number);
  const npsPromoters = npsScores.filter((s) => s >= 9).length;
  const npsDetractors = npsScores.filter((s) => s <= 6).length;
  const npsScore     = npsScores.length
    ? Math.round(((npsPromoters - npsDetractors) / npsScores.length) * 100)
    : null;

  let totalMrr = 0;
  for (const s of subsRes.data ?? []) {
    totalMrr += calcMrr(s.plan, s.employer_tier, s.billing_interval);
  }
  const totalArr = totalMrr * 12;

  const comingSoon = process.env.COMING_SOON !== "false";

  const setupChecks = [
    { label: "Supabase",            ok: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) },
    { label: "Email (Postmark)",    ok: !!process.env.POSTMARK_API_TOKEN },
    { label: "Vertex AI",           ok: !!process.env.GOOGLE_CLOUD_PROJECT },
    { label: "Paddle (payments)",   ok: !!process.env.PADDLE_API_KEY },
    { label: "Cron jobs",           ok: !!process.env.CRON_SECRET },
    { label: "Push notifications",  ok: !!process.env.VAPID_PRIVATE_KEY },
    { label: "Admin notifications", ok: !!process.env.ADMIN_NOTIFICATION_EMAIL },
  ];
  const hasSetupIssues = setupChecks.some((c) => !c.ok);

  const alerts = [
    { label: "CME to verify",            count: pendingCmeCount,   href: "/admin/cme-verification",   sev: "high"   as const },
    { label: "Employer link requests",   count: pendingLinksCount, href: "/admin/link-requests",       sev: "high"   as const },
    { label: "Past-due subscriptions",   count: pastDue,           href: "/admin/subscriptions",       sev: "high"   as const },
    { label: "Provider applications",    count: pendingProviders,  href: "/admin/training-providers",  sev: "medium" as const },
    { label: "Courses awaiting review",  count: pendingCourses,    href: "/admin/courses",             sev: "medium" as const },
    { label: "Trials expiring ≤ 3 days", count: expiringTrials,   href: "/admin/subscriptions",       sev: "medium" as const },
    { label: "Demo follow-ups needed",   count: demoNew,           href: "/admin/demo-requests",       sev: "medium" as const },
    { label: "Email hard bounces",       count: bounced,           href: "/admin/professionals",       sev: "low"    as const },
  ];
  const totalAlerts = alerts.reduce((s, a) => s + a.count, 0);

  const pendingLinks = pendingLinksRes.data ?? [];
  const pendingCme   = pendingCmeRes.data ?? [];
  const hasApprovals = pendingLinks.length > 0 || pendingCme.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Command Center</h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
          comingSoon
            ? "bg-[#fff7ed] text-[#92400e] border-[#fed7aa]"
            : "bg-[#dcfce7] text-[#15803d] border-[#86efac]"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${comingSoon ? "bg-[#d97706]" : "bg-[#16a34a]"}`} />
          {comingSoon ? "Coming soon mode" : "Platform live"}
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <KpiCard label="MRR"   value={fmt(totalMrr)} sub="monthly recurring" accent />
        <KpiCard label="ARR"   value={fmt(totalArr)} sub="annualized" accent />
        <KpiCard label="Users" value={String(profCount)} sub="professionals" />
        <KpiCard label="DAU"   value={String(dau)} sub="active today" />
        <KpiCard
          label="NPS"
          value={npsScore !== null ? (npsScore > 0 ? `+${npsScore}` : String(npsScore)) : "—"}
          sub={`${npsScores.length} responses`}
          sentiment={npsScore === null ? "neutral" : npsScore >= 50 ? "good" : npsScore >= 0 ? "warn" : "bad"}
        />
      </div>

      {/* Operations grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Inbox */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] flex flex-col">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0f172a]">Alert Inbox</h2>
            {totalAlerts > 0
              ? <span className="text-xs font-bold text-white bg-[#dc2626] px-2 py-0.5 rounded-full">{totalAlerts} pending</span>
              : <span className="text-xs font-semibold text-[#16a34a]">All clear</span>
            }
          </div>
          <div className="divide-y divide-[#f1f5f9] flex-1">
            {alerts.map((a) => (
              <a key={a.label} href={a.href}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-[#f8fafc] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    a.count === 0     ? "bg-[#86efac]" :
                    a.sev === "high"  ? "bg-[#dc2626]" :
                    a.sev === "medium"? "bg-[#d97706]" : "bg-[#94a3b8]"
                  }`} />
                  <span className="text-sm text-[#374151] group-hover:text-[#1a56a0] transition-colors truncate">
                    {a.label}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className={`text-sm font-bold tabular-nums ${
                    a.count === 0     ? "text-[#16a34a]" :
                    a.sev === "high"  ? "text-[#dc2626]" :
                    a.sev === "medium"? "text-[#d97706]" : "text-[#64748b]"
                  }`}>{a.count}</span>
                  <svg className="w-3.5 h-3.5 text-[#cbd5e1] group-hover:text-[#1a56a0] transition-colors" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
          <div className="px-6 py-3.5 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-xl">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#64748b]">
              <span>Active trials: <strong className="text-[#0f172a]">{activeTrials}</strong></span>
              <span>Waitlist: <strong className="text-[#0f172a]">{waitlist}</strong></span>
              <span>Spam: <strong className={spam > 0 ? "text-[#dc2626]" : "text-[#0f172a]"}>{spam}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Approve */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] flex flex-col">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0f172a]">Quick Approve</h2>
            <span className="text-xs text-[#64748b]">Act without leaving this page</span>
          </div>

          {!hasApprovals && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#16a34a]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[#374151]">No pending approvals</p>
              <p className="text-xs text-[#94a3b8] mt-1">You&apos;re all caught up.</p>
            </div>
          )}

          {pendingLinks.length > 0 && (
            <div>
              <p className="px-6 pt-4 pb-2 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                Employer Link Requests
              </p>
              <div className="divide-y divide-[#f1f5f9]">
                {pendingLinks.map((req) => {
                  const prof = profileMap[req.professional_id];
                  const _orgs = req.organizations as { name: string }[] | { name: string } | null;
                  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name)
                    ?? req.unverified_employer_name
                    ?? "Unknown org";
                  const isVerified = !!req.organization_id;
                  return (
                    <div key={req.id} className="px-6 py-3.5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0f172a] truncate">
                          {prof?.full_name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {prof?.profession ?? "—"} → <span className="font-medium text-[#374151]">{orgName}</span>
                          {!isVerified && (
                            <span className="ml-1.5 text-[10px] font-semibold text-[#d97706] bg-[#fff7ed] px-1.5 py-0.5 rounded">
                              new org
                            </span>
                          )}
                        </p>
                      </div>
                      {isVerified
                        ? <VerifiedRequestActions requestId={req.id} />
                        : <UnverifiedRequestActions requestId={req.id} suggestedName={req.unverified_employer_name ?? orgName} professionalId={req.professional_id} />
                      }
                    </div>
                  );
                })}
              </div>
              {pendingLinksCount > pendingLinks.length && (
                <p className="px-6 py-2 text-xs text-[#64748b]">
                  +{pendingLinksCount - pendingLinks.length} more —{" "}
                  <a href="/admin/link-requests" className="text-[#1a56a0] hover:underline">View all</a>
                </p>
              )}
            </div>
          )}

          {pendingCme.length > 0 && (
            <div className={pendingLinks.length > 0 ? "border-t border-[#f1f5f9]" : ""}>
              <p className="px-6 pt-4 pb-2 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                CME Verification Queue
              </p>
              <div className="divide-y divide-[#f1f5f9]">
                {pendingCme.map((act) => {
                  const prof = profileMap[act.professional_id];
                  return (
                    <div key={act.id} className="px-6 py-3.5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0f172a] truncate">{act.title}</p>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {prof?.full_name ?? "—"}
                          {" · "}{act.credits} credit{act.credits !== 1 ? "s" : ""}
                          {act.activity_date && (
                            <> · {new Date(act.activity_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</>
                          )}
                        </p>
                      </div>
                      <CmeActivityActions activityId={act.id} currentStatus={act.verification_status} />
                    </div>
                  );
                })}
              </div>
              {pendingCmeCount > pendingCme.length && (
                <p className="px-6 py-2 text-xs text-[#64748b]">
                  +{pendingCmeCount - pendingCme.length} more —{" "}
                  <a href="/admin/cme-verification" className="text-[#1a56a0] hover:underline">View all</a>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Setup issues */}
      {hasSetupIssues && (
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#92400e] mb-3">Platform Setup — Action Required</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {setupChecks.filter((c) => !c.ok).map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-sm text-[#b45309]">
                <span className="text-[#dc2626] font-bold leading-none">✗</span>
                <span>{c.label} not configured</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <NavSection title="Operations" links={[
          { href: "/admin/professionals",     label: "Professionals" },
          { href: "/admin/organizations",     label: "Organizations" },
          { href: "/admin/employers",         label: "Employers" },
          { href: "/admin/link-requests",     label: "Link Requests",    badge: pendingLinksCount || undefined },
          { href: "/admin/cme-verification",  label: "CME Queue",        badge: pendingCmeCount || undefined },
          { href: "/admin/cme-activities",    label: "CME Activities" },
          { href: "/admin/training-providers",label: "Providers",        badge: pendingProviders || undefined },
          { href: "/admin/courses",           label: "Courses",          badge: pendingCourses || undefined },
          { href: "/admin/reviews",           label: "Reviews" },
          { href: "/admin/compliance",        label: "Compliance Map" },
          { href: "/admin/country-rules",     label: "Country Rules" },
          { href: "/admin/demo-requests",     label: "Demo Requests",    badge: demoNew || undefined },
          { href: "/admin/waitlist",          label: "Waitlist" },
        ]} />
        <NavSection title="Revenue & Growth" links={[
          { href: "/admin/revenue",           label: "Revenue Dashboard" },
          { href: "/admin/subscriptions",     label: "Subscriptions" },
          { href: "/admin/discounts",         label: "Discounts" },
          { href: "/admin/analytics",         label: "Analytics" },
          { href: "/admin/nps",               label: "NPS Survey" },
          { href: "/admin/partners",          label: "Partners" },
          { href: "/admin/growth",            label: "Growth" },
          { href: "/admin/reports",           label: "Reports" },
          { href: "/admin/email-campaigns",   label: "Campaigns" },
          { href: "/admin/qpay-invoices",     label: "QPay Invoices" },
        ]} />
        <NavSection title="AI & Platform" links={[
          { href: "/admin/ai-modules",        label: "AI Modules" },
          { href: "/admin/ai-costs",          label: "AI Costs" },
          { href: "/admin/feature-flags",     label: "Feature Flags" },
          { href: "/admin/webhooks",          label: "Webhooks" },
          { href: "/admin/monitoring",        label: "Monitoring" },
          { href: "/admin/health",            label: "Health" },
          { href: "/admin/notification-queue",label: "Notif Queue" },
          { href: "/admin/push-compose",      label: "Push Compose" },
          { href: "/admin/announcements",     label: "Announcements" },
          { href: "/admin/performance",       label: "Performance" },
          { href: "/admin/behavior",          label: "User Behavior" },
        ]} />
        <NavSection title="System" links={[
          { href: "/admin/audit-logs",        label: "Audit Log" },
          { href: "/admin/settings",          label: "Platform Settings" },
          { href: "/admin/content",           label: "CMS Content" },
          { href: "/admin/media",             label: "Media Library" },
          { href: "/admin/seo",              label: "SEO Manager" },
          { href: "/admin/email-templates",   label: "Email Templates" },
          { href: "/admin/db",               label: "DB Explorer" },
          { href: "/admin/logs",             label: "Logs Center" },
          { href: "/admin/exports",          label: "Exports" },
          { href: "/admin/user-actions",     label: "User Actions" },
          { href: "/admin/changelog",        label: "Changelog" },
        ]} />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, accent = false,
  sentiment,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  sentiment?: "good" | "warn" | "bad" | "neutral";
}) {
  const valueColor = accent
    ? "text-[#1a56a0]"
    : sentiment === "good"    ? "text-[#16a34a]"
    : sentiment === "warn"    ? "text-[#d97706]"
    : sentiment === "bad"     ? "text-[#dc2626]"
    : "text-[#0f172a]";

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${valueColor}`}>{value}</p>
      <p className="text-xs text-[#94a3b8] mt-1">{sub}</p>
    </div>
  );
}

function NavSection({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; badge?: number }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">{title}</p>
      <div className="space-y-1">
        {links.map(({ href, label, badge }) => (
          <a
            key={href}
            href={href}
            className="flex items-center justify-between py-1.5 text-sm text-[#374151] hover:text-[#1a56a0] transition-colors group"
          >
            <span className="group-hover:underline underline-offset-2">{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="text-[10px] font-bold text-white bg-[#dc2626] px-1.5 py-0.5 rounded-full leading-none">
                {badge}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
