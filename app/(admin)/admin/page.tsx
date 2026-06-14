import { createAdminClient } from "@/lib/supabase/server";

interface ServiceCheck {
  label: string;
  ok: boolean;
  action?: string;
}

function getSetupChecks(): ServiceCheck[] {
  return [
    { label: "Supabase",           ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    { label: "Email (Postmark)",   ok: !!process.env.POSTMARK_API_TOKEN,       action: "Set POSTMARK_API_TOKEN in GCP Secret Manager" },
    { label: "AI (Vertex AI)",     ok: !!process.env.GOOGLE_CLOUD_PROJECT,      action: "Vertex AI uses ADC — ensure GOOGLE_CLOUD_PROJECT env var is set" },
    { label: "Paddle (payments)",  ok: !!process.env.PADDLE_API_KEY,            action: "Create Paddle account → add PADDLE_API_KEY" },
    { label: "Cron jobs",          ok: !!process.env.CRON_SECRET,               action: "Set CRON_SECRET + run setup-cloud-scheduler.sh" },
    { label: "Push notifications", ok: !!process.env.VAPID_PRIVATE_KEY,         action: "Generate VAPID keys → set VAPID_PRIVATE_KEY" },
    { label: "Analytics (PostHog)",ok: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,   action: "Set _POSTHOG_KEY in Cloud Build trigger substitution vars" },
    { label: "Admin notifications",ok: !!process.env.ADMIN_NOTIFICATION_EMAIL,  action: "Set ADMIN_NOTIFICATION_EMAIL in Cloud Run env vars" },
    { label: "Email bounce webhook",ok: !!process.env.POSTMARK_WEBHOOK_TOKEN,   action: "Set POSTMARK_WEBHOOK_TOKEN + configure Postmark webhook URL" },
  ];
}

export default async function AdminPage() {
  const admin = createAdminClient();
  const setupChecks = getSetupChecks();
  const now = new Date().toISOString();
  const soon = new Date(Date.now() + 3 * 86400000).toISOString();

  const [
    profCount, orgCount, pendingLinks, pendingCme, pendingProviders, pendingCourses,
    proActive, empActive, pastDue,
    partnerCount, discountCount,
    activeTrials, expiringTrials,
    npsRes, bouncedRes, spamRes,
  ] = await Promise.all([
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
    admin.from("organizations").select("id", { count: "exact", head: true }),
    admin.from("employer_link_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
    admin.from("training_providers").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("courses").select("id", { count: "exact", head: true }).eq("status", "draft"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("plan", "pro").eq("status", "active"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("plan", "employer").eq("status", "active"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
    admin.from("partners").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("discounts").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("professional_profiles").select("id", { count: "exact", head: true })
      .gt("pro_trial_ends_at", now),
    admin.from("professional_profiles").select("id", { count: "exact", head: true })
      .gt("pro_trial_ends_at", now).lte("pro_trial_ends_at", soon),
    admin.from("nps_responses").select("score"),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("email_hard_bounced", true),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("email_spam_reported", true),
  ]);

  // NPS score calculation
  const npsScores = (npsRes.data ?? []).map((r) => r.score);
  const npsPromoters  = npsScores.filter((s) => s >= 9).length;
  const npsDetractors = npsScores.filter((s) => s <= 6).length;
  const npsScore = npsScores.length > 0
    ? Math.round(((npsPromoters - npsDetractors) / npsScores.length) * 100)
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Admin Overview</h1>

      {/* Platform stats */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Platform</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Professionals"      value={profCount.count ?? 0}    color="blue" />
        <StatCard label="Organizations"      value={orgCount.count ?? 0}     color="blue" />
        <StatCard label="Pending Links"      value={pendingLinks.count ?? 0} color="orange" />
        <StatCard label="Pending CME"        value={pendingCme.count ?? 0}   color="orange" />
      </div>

      {/* Revenue stats */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Revenue</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pro — Active"      value={proActive.count ?? 0}     color="green" />
        <StatCard label="Employer — Active" value={empActive.count ?? 0}     color="green" />
        <StatCard label="Past Due"          value={pastDue.count ?? 0}       color="red" />
        <StatCard label="Active Discounts"  value={discountCount.count ?? 0} color="blue" />
      </div>

      {/* Trial pipeline */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Trial Pipeline</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Trials"    value={activeTrials.count ?? 0}   color="blue" />
        <StatCard
          label="Expiring ≤3 Days"
          value={expiringTrials.count ?? 0}
          color={(expiringTrials.count ?? 0) > 0 ? "orange" : "green"}
        />
        <StatCard label="Pro Paid + Employer" value={(proActive.count ?? 0) + (empActive.count ?? 0)} color="green" />
      </div>

      {/* Product health */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Product Health</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] mb-1">NPS Score</p>
          <p className="text-3xl font-bold" style={{
            color: npsScore === null ? "#94a3b8" : npsScore >= 50 ? "#16a34a" : npsScore >= 0 ? "#d97706" : "#dc2626"
          }}>
            {npsScore !== null ? (npsScore > 0 ? `+${npsScore}` : String(npsScore)) : "—"}
          </p>
          <p className="text-xs text-[#94a3b8] mt-1">{npsScores.length} response{npsScores.length !== 1 ? "s" : ""}</p>
        </div>
        <StatCard label="NPS Responses"   value={npsScores.length}            color="blue" />
        <StatCard
          label="Email Bounced"
          value={bouncedRes.count ?? 0}
          color={(bouncedRes.count ?? 0) > 0 ? "orange" : "green"}
        />
        <StatCard
          label="Spam Reported"
          value={spamRes.count ?? 0}
          color={(spamRes.count ?? 0) > 0 ? "red" : "green"}
        />
      </div>

      {/* Platform setup status — only show if any service is unconfigured */}
      {setupChecks.some((c) => !c.ok) && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Platform Setup</h2>
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <p className="text-sm text-[#64748b] mb-4">
              Services not yet configured. Complete these before going live.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {setupChecks.map((c) => (
                <div key={c.label} className="flex items-start gap-2.5">
                  <span className={`mt-0.5 text-base leading-none ${c.ok ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                    {c.ok ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0">
                    <span className={`text-sm font-medium ${c.ok ? "text-[#16a34a]" : "text-[#111]"}`}>
                      {c.label}
                    </span>
                    {!c.ok && c.action && (
                      <p className="text-xs text-[#64748b] mt-0.5">{c.action}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {setupChecks.every((c) => c.ok) && (
              <p className="text-sm text-[#16a34a] font-medium mt-2">All services configured — ready to launch.</p>
            )}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Operations</h2>
          <div className="space-y-2">
            <a href="/admin/organizations" className="block text-sm text-[#1a56a0] hover:underline">Manage Organizations</a>
            <a href="/admin/link-requests" className="block text-sm text-[#1a56a0] hover:underline">
              Review Link Requests{(pendingLinks.count ?? 0) > 0 && ` (${pendingLinks.count} pending)`}
            </a>
            <a href="/admin/cme-activities" className="block text-sm text-[#1a56a0] hover:underline">
              Verify CME Activities{(pendingCme.count ?? 0) > 0 && ` (${pendingCme.count} pending)`}
            </a>
            <a href="/admin/professionals" className="block text-sm text-[#1a56a0] hover:underline">Manage Professionals</a>
            <a href="/admin/training-providers" className="block text-sm text-[#1a56a0] hover:underline">
              Training Providers{(pendingProviders.count ?? 0) > 0 && ` (${pendingProviders.count} pending)`}
            </a>
            <a href="/admin/courses" className="block text-sm text-[#1a56a0] hover:underline">
              Course Moderation{(pendingCourses.count ?? 0) > 0 && ` (${pendingCourses.count} pending)`}
            </a>
            <a href="/admin/country-rules" className="block text-sm text-[#1a56a0] hover:underline">Country Rules Engine</a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Master Controls</h2>
          <div className="space-y-2">
            <a href="/admin/revenue" className="block text-sm font-semibold text-[#16a34a] hover:underline">
              Revenue Dashboard — MRR / ARR / Signups
            </a>
            <a href="/admin/subscriptions" className="block text-sm text-[#1a56a0] hover:underline">
              Subscription Overview — {(proActive.count ?? 0) + (empActive.count ?? 0)} active
            </a>
            <a href="/admin/discounts" className="block text-sm text-[#1a56a0] hover:underline">
              Discount Management — {discountCount.count ?? 0} active discounts
            </a>
            <a href="/admin/partners" className="block text-sm text-[#1a56a0] hover:underline">
              Partner Logos — {partnerCount.count ?? 0} active partners
            </a>
            <a href="/admin/audit-logs" className="block text-sm text-[#1a56a0] hover:underline">
              Audit Log — append-only, 7-year retention
            </a>
            <a href="/admin/settings" className="block text-sm font-semibold text-[#1a56a0] hover:underline">
              ⚙ Platform Settings (prices &amp; limits)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: {
  label: string; value: number; color: "blue" | "green" | "orange" | "red";
}) {
  const c = {
    blue:   "text-[#1a56a0]",
    green:  "text-[#16a34a]",
    orange: "text-[#d97706]",
    red:    "text-[#dc2626]",
  }[color];
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${c}`}>{value}</p>
    </div>
  );
}
