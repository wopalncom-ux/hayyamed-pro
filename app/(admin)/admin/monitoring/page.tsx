import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/adminAuth";

export const metadata = { title: "Monitoring — Hayya Med Pro Admin" };
export const dynamic = "force-dynamic";

const CRON_JOBS = [
  // Daily — morning batch (staggered)
  { slug: "trial-reminders",       label: "Trial Reminders",        schedule: "Daily 08:00 GST",  description: "Day 3/7/11/14 trial conversion nudges" },
  { slug: "license-reminders",     label: "License Reminders",      schedule: "Daily 08:15 GST",  description: "30d/7d license expiry push notifications" },
  { slug: "cme-deadline",          label: "CME Deadline",           schedule: "Daily 08:30 GST",  description: "60d/30d CME cycle deadline push notifications" },
  { slug: "license-expiry",        label: "License Expiry Email",   schedule: "Daily 08:45 GST",  description: "90d/60d/30d/7d/1d expiry email alerts" },
  { slug: "onboarding-reminder",   label: "Onboarding Reminder",    schedule: "Daily 09:00 GST",  description: "Incomplete onboarding nudge (48h–7d window)" },
  { slug: "onboarding-drip",       label: "Onboarding Drip",        schedule: "Daily 09:15 GST",  description: "D+1/3/7/10 activation email sequence" },
  { slug: "training-deadline",     label: "Training Deadline",      schedule: "Daily 09:30 GST",  description: "7d/1d employer training deadline warnings" },
  { slug: "compliance-alerts",     label: "Compliance Alerts",      schedule: "Daily 10:00 GST",  description: "Non-compliant staff webhook + push to employer" },
  // Daily — end of day
  { slug: "compliance-snapshot",   label: "Compliance Snapshot",    schedule: "Daily 23:30 GST",  description: "Daily org compliance state snapshot for trend chart" },
  { slug: "cycle-renewal",         label: "CME Cycle Renewal",      schedule: "Daily 00:30 GST",  description: "Advance expired CME wallet cycles, reset credits" },
  // Weekly
  { slug: "employer-digest",       label: "Employer Digest",        schedule: "Mon 07:00 GST",    description: "Weekly staff compliance digest email" },
  { slug: "professional-digest",   label: "Professional Digest",    schedule: "Mon 07:30 GST",    description: "Weekly CME progress digest email" },
  { slug: "storage-cleanup",       label: "Storage Cleanup",        schedule: "Sun 03:00 GST",    description: "Delete orphaned certificate files >7d old" },
  { slug: "data-retention",        label: "Data Retention",         schedule: "Sun 04:00 GST",    description: "Prune ai_call_logs (90d), notification_queue (30d), webhook_deliveries (90d), drip_email_log (90d)" },
  // High-frequency
  { slug: "process-notifications", label: "Process Notifications",  schedule: "Every 5 min",      description: "Drain notification_queue (email + push)" },
  { slug: "process-webhooks",      label: "Process Webhooks",       schedule: "Every 5 min",      description: "Send pending webhook deliveries with retry" },
];

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffH  = Math.floor(diffMs / 3_600_000);
  const diffM  = Math.floor(diffMs / 60_000);
  if (diffH > 48) return `${Math.floor(diffH / 24)}d ago`;
  if (diffH >= 1)  return `${diffH}h ago`;
  if (diffM >= 1)  return `${diffM}m ago`;
  return "just now";
}

export default async function MonitoringPage() {
  await requireAdminUser();
  const admin = createAdminClient();

  // Platform health — direct DB check
  let dbOk = false;
  try {
    const { error } = await admin.from("professional_profiles").select("id").limit(1);
    dbOk = !error;
  } catch { /* dbOk = false */ }

  const envChecks = {
    supabase:  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    vertex_ai: !!process.env.GOOGLE_CLOUD_PROJECT,
    paddle:    !!process.env.PADDLE_API_KEY,
    postmark:  !!process.env.POSTMARK_API_TOKEN,
    cron:      !!process.env.CRON_SECRET,
    vapid:     !!process.env.VAPID_PRIVATE_KEY,
    upstash:   !!process.env.UPSTASH_REDIS_REST_URL,
    sentry:    !!process.env.SENTRY_AUTH_TOKEN,
    posthog:   !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
  };

  const gcpProject = process.env.GOOGLE_CLOUD_PROJECT ?? "";

  // Cron last-run: one query per job slug, each taking only its own most recent row.
  // A single shared "top 300" query is wrong here — process-notifications and
  // process-webhooks run every 5 minutes (~288 rows/day each) and crowd every
  // other job's rows out of a shared limit within hours, making daily/weekly
  // jobs falsely read as "Never run" even though they ran fine.
  const since14d = new Date(Date.now() - 14 * 86_400_000).toISOString();
  const lastRun: Record<string, { at: Date; meta: Record<string, unknown> }> = {};
  await Promise.all(
    CRON_JOBS.map(async (job) => {
      const { data } = await admin
        .from("audit_logs")
        .select("metadata, created_at")
        .eq("action", "cron.completed")
        .filter("metadata->>job", "eq", job.slug)
        .gte("created_at", since14d)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        lastRun[job.slug] = { at: new Date(data.created_at), meta: (data.metadata as Record<string, unknown>) ?? {} };
      }
    }),
  );

  // Queue depth + error counts
  const since24h = new Date(Date.now() - 86_400_000).toISOString();
  const [errorCountRes, notifPendingRes, webhookPendingRes, webhookFailedRes] = await Promise.all([
    admin.from("audit_logs").select("id", { count: "exact", head: true })
      .ilike("action", "%error%").gte("created_at", since24h),
    admin.from("notification_queue").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("webhook_deliveries").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("webhook_deliveries").select("id", { count: "exact", head: true }).eq("status", "failed"),
  ]);

  const errorCount      = errorCountRes.count ?? 0;
  const notifPending    = notifPendingRes.count ?? 0;
  const webhookPending  = webhookPendingRes.count ?? 0;
  const webhookFailed   = webhookFailedRes.count ?? 0;

  const healthyServices = Object.values(envChecks).filter(Boolean).length;
  const totalServices   = Object.keys(envChecks).length;
  const overallHealthy  = dbOk && envChecks.supabase && envChecks.vertex_ai;
  const cronHealthy     = Object.keys(lastRun).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-2">Platform Monitoring</h1>
      <p className="text-sm text-[#64748b] mb-8">Live platform health, cron job status, and infrastructure links.</p>

      {/* ── Overall Health ── */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Platform Health</h2>
      <div className={`rounded-xl border px-5 py-4 mb-6 flex items-center gap-4 ${overallHealthy ? "bg-[#f0fdf4] border-[#86efac]" : "bg-[#fef2f2] border-[#fecaca]"}`}>
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${overallHealthy ? "bg-[#16a34a]" : "bg-[#dc2626]"} animate-pulse`} />
        <div>
          <p className={`text-sm font-bold ${overallHealthy ? "text-[#15803d]" : "text-[#b91c1c]"}`}>
            {overallHealthy ? "All systems operational" : "Degraded — check service configuration"}
          </p>
          <p className="text-xs text-[#64748b] mt-0.5">
            Database: {dbOk ? "✓ Connected" : "✗ Unreachable"} · {healthyServices}/{totalServices} services configured
          </p>
        </div>
      </div>

      {/* ── Service Configuration ── */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Service Configuration</h2>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(envChecks).map(([key, ok]) => (
            <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${ok ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-[#fef2f2] border-[#fecaca]"}`}>
              <span className={`text-sm font-bold ${ok ? "text-[#16a34a]" : "text-[#dc2626]"}`}>{ok ? "✓" : "✗"}</span>
              <span className="text-xs font-medium text-[#374151] capitalize">{key.replace(/_/g, " ")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Queue Depth + Error Summary ── */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Last 24 Hours</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">DB Status</p>
          <p className={`text-3xl font-bold ${dbOk ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
            {dbOk ? "OK" : "DOWN"}
          </p>
          <p className="text-xs text-[#64748b] mt-1">Supabase PostgreSQL</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Audit Errors</p>
          <p className={`text-3xl font-bold ${errorCount > 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
            {errorCount}
          </p>
          <p className="text-xs text-[#64748b] mt-1">actions matching "%error%"</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Notif Queue</p>
          <p className={`text-3xl font-bold ${notifPending > 100 ? "text-[#d97706]" : "text-[#16a34a]"}`}>
            {notifPending}
          </p>
          <p className="text-xs text-[#64748b] mt-1">pending items</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Webhook Queue</p>
          <p className={`text-3xl font-bold ${webhookPending > 50 ? "text-[#d97706]" : "text-[#16a34a]"}`}>
            {webhookPending}
          </p>
          <p className="text-xs text-[#64748b] mt-1">pending deliveries</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Webhooks Failed</p>
          <p className={`text-3xl font-bold ${webhookFailed > 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
            {webhookFailed}
          </p>
          <p className="text-xs text-[#64748b] mt-1">max attempts reached</p>
        </div>
      </div>

      {/* ── Cron Job Status ── */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">
        Cron Jobs — 15 Active
        <span className="ml-2 font-normal normal-case text-[#64748b]">
          {cronHealthy}/{CRON_JOBS.length} have run in the last 14 days
        </span>
      </h2>
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f1f5f9]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Job</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Schedule</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Last Run</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Sent / Processed</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {CRON_JOBS.map((job) => {
              const run = lastRun[job.slug];
              const hasError = run?.meta?.error;
              const sent = Number(run?.meta?.sent ?? 0);
              const processed = Number(run?.meta?.processed ?? 0);
              const activity = sent > 0 ? `${sent} sent` : processed > 0 ? `${processed} processed` : "0";
              return (
                <tr key={job.slug} className="hover:bg-[#f8fafc]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#111]">{job.label}</p>
                    <p className="text-xs text-[#64748b]">{job.description}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#64748b] whitespace-nowrap">{job.schedule}</td>
                  <td className="px-5 py-3 text-xs text-[#64748b]">
                    {run ? timeAgo(run.at) : <span className="text-[#d97706]">Never</span>}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#374151]">
                    {run ? activity : "—"}
                  </td>
                  <td className="px-5 py-3">
                    {!run ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b]">No data</span>
                    ) : hasError ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#dc2626]">Error</span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a]">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc]">
          <p className="text-xs text-[#64748b]">
            Last-run data written by <code className="bg-white border border-[#e2e8f0] px-1 rounded">pingCronMonitor()</code> → audit_logs (action = &quot;cron.completed&quot;, metadata.job = slug).
            {" "}Scheduled in GCP Cloud Scheduler (me-central1).
          </p>
        </div>
      </div>

      {/* ── GCP Infrastructure Links ── */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Infrastructure Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <h3 className="text-sm font-semibold text-[#111] mb-3">GCP Console</h3>
          <div className="space-y-2">
            {gcpProject ? (
              <>
                <a href={`https://console.cloud.google.com/run/detail/${encodeURIComponent("me-central1")}/hayyamed-pro/metrics?project=${gcpProject}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
                  Cloud Run → hayyamed-pro metrics ↗
                </a>
                <a href={`https://console.cloud.google.com/monitoring/uptime?project=${gcpProject}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
                  Uptime Checks ↗
                </a>
                <a href={`https://console.cloud.google.com/monitoring/alerting?project=${gcpProject}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
                  Alert Policies ↗
                </a>
                <a href={`https://console.cloud.google.com/cloudscheduler?project=${gcpProject}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
                  Cloud Scheduler (15 cron jobs) ↗
                </a>
                <a href={`https://console.cloud.google.com/logs/query?project=${gcpProject}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
                  Cloud Logging ↗
                </a>
                <a href="https://console.cloud.google.com/billing/budgets" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
                  Billing Budgets ↗
                </a>
              </>
            ) : (
              <p className="text-xs text-[#d97706]">GOOGLE_CLOUD_PROJECT not configured — links unavailable.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <h3 className="text-sm font-semibold text-[#111] mb-3">Observability Tools</h3>
          <div className="space-y-2">
            <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
              Sentry — Error tracking ↗
            </a>
            <a href="https://us.posthog.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
              PostHog — Product analytics ↗
            </a>
            <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
              Supabase Dashboard ↗
            </a>
            <a href="https://console.paddle.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
              Paddle — Billing & payments ↗
            </a>
            <a href="/api/health" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
              /api/health — JSON health check ↗
            </a>
            <a href="/status" target="_blank" rel="noopener noreferrer" className="block text-sm text-[#1a56a0] hover:underline">
              /status — Public status page ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── GCP Monitoring Setup Guide ── */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">GCP Monitoring Setup</h2>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <p className="text-sm text-[#374151] mb-3">
          Run this once to configure uptime checks, alert policies (5xx rate, latency p95, uptime failure), and billing budget alert:
        </p>
        <div className="bg-[#0f1f3d] rounded-lg px-4 py-3 font-mono text-sm text-[#e2e8f0] mb-4 overflow-x-auto">
          bash scripts/setup-gcp-monitoring.sh support@hayyamed.pro
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#64748b]">
          <div>
            <p className="font-semibold text-[#374151] mb-1">Script creates:</p>
            <ul className="space-y-1">
              <li>✓ Email notification channel</li>
              <li>✓ Uptime check — /api/health every 60s</li>
              <li>✓ Alert: uptime failure → immediate email</li>
              <li>✓ Alert: 5xx rate {">"} 1% → email</li>
              <li>✓ Alert: p95 latency {">"} 2s → email</li>
              <li>✓ Billing budget — $100/month alert</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#374151] mb-1">SLA targets:</p>
            <ul className="space-y-1">
              <li>Uptime: {">"} 99.9% (43 min/month max)</li>
              <li>API response p95: {"<"} 500ms</li>
              <li>Dashboard load p95: {"<"} 2 seconds</li>
              <li>AI response p95: {"<"} 5 seconds</li>
              <li>Deployment time: {"<"} 10 minutes</li>
              <li>Rollback time: {"<"} 5 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
