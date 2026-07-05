import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Monitoring",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function OwnerMonitoringPage() {
  await requireOwnerAuth();
  const admin = createAdminClient();

  const now = new Date();
  const hour1Ago  = new Date(now.getTime() - 3600_000).toISOString();
  const day1Ago   = new Date(now.getTime() - 86400_000).toISOString();
  const day7Ago   = new Date(now.getTime() - 7 * 86400_000).toISOString();

  const [
    recentAuditRes, failedAiRes, cmeRecentRes,
    suspendedRes, bouncedRes, spamRes,
    performanceRes, perfSnapshotRes,
  ] = await Promise.all([
    admin.from("audit_logs").select("id, action, target_table, metadata, created_at").order("created_at", { ascending: false }).limit(20),
    admin.from("ai_call_logs").select("id, action, model, error_message, created_at").eq("success", false).order("created_at", { ascending: false }).limit(10),
    admin.from("cme_activities").select("id", { count: "exact", head: true }).gte("created_at", day1Ago),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("is_suspended", true),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("email_hard_bounced", true),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("email_spam_reported", true),
    admin.from("performance_snapshots").select("*").order("created_at", { ascending: false }).limit(5),
    admin.from("performance_snapshots").select("page_path, lcp_ms, cls_score, fid_ms, performance_score").order("created_at", { ascending: false }).limit(20),
  ]);

  const integrationChecks = [
    { name: "Supabase DB",           status: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY), type: "database" },
    { name: "Supabase Auth",         status: !!process.env.NEXT_PUBLIC_SUPABASE_URL,   type: "auth" },
    { name: "Postmark (Email)",       status: !!process.env.POSTMARK_API_TOKEN,         type: "email" },
    { name: "Paddle (Payments)",      status: !!process.env.PADDLE_API_KEY,             type: "payment" },
    { name: "Vertex AI (Gemini)",     status: !!process.env.GOOGLE_CLOUD_PROJECT,       type: "ai" },
    { name: "VAPID (Push)",           status: !!process.env.VAPID_PRIVATE_KEY,          type: "push" },
    { name: "CRON_SECRET",            status: !!process.env.CRON_SECRET,                type: "jobs" },
    { name: "Upstash (Rate Limit)",   status: !!process.env.UPSTASH_REDIS_REST_URL,     type: "cache" },
    { name: "Postmark Webhook",       status: !!process.env.POSTMARK_WEBHOOK_TOKEN,     type: "webhook" },
    { name: "Cloud Run (me-central1)",status: process.env.GOOGLE_CLOUD_PROJECT?.includes("project-") ?? false, type: "infra" },
    { name: "Admin Notifications",    status: !!process.env.ADMIN_NOTIFICATION_EMAIL,   type: "email" },
  ];

  const allOk = integrationChecks.every((c) => c.status);
  const failCount = integrationChecks.filter((c) => !c.status).length;

  const latestPerf = (perfSnapshotRes.data ?? []);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Platform Monitoring Center</h1>
          <p className="text-sm text-[#64748b] mt-0.5">System health, errors, and activity metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
            allOk
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}>
            {allOk ? "✓ All systems operational" : `⚠ ${failCount} issue${failCount > 1 ? "s" : ""} detected`}
          </span>
          <a href="/admin/health" className="text-xs font-semibold text-[#1a56a0] hover:underline">
            Health Check →
          </a>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "CME (24h)",       value: String(cmeRecentRes.count ?? 0),   sub: "activities submitted",  color: "#1a56a0" },
          { label: "AI Failures",     value: String(failedAiRes.data?.length ?? 0), sub: "recent errors",    color: (failedAiRes.data?.length ?? 0) > 0 ? "#b91c1c" : "#64748b" },
          { label: "Email Bounces",   value: String(bouncedRes.count ?? 0),     sub: "hard bounces",          color: (bouncedRes.count ?? 0) > 0 ? "#d97706" : "#64748b" },
          { label: "Spam Reports",    value: String(spamRes.count ?? 0),        sub: "total reported",        color: (spamRes.count ?? 0) > 0 ? "#b91c1c" : "#64748b" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-2">{k.label}</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Integration health grid */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-sm font-semibold text-[#0f172a]">Integration & Environment Health</h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">Based on environment variable configuration</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {integrationChecks.map((check) => (
            <div
              key={check.name}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                check.status
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${check.status ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`text-sm font-medium ${check.status ? "text-green-800" : "text-red-800"}`}>
                  {check.name}
                </span>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                check.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {check.status ? "OK" : "MISSING"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Web Vitals (from performance_snapshots) */}
      {latestPerf.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0f172a]">Core Web Vitals</h2>
            <a href="/admin/performance" className="text-xs text-[#1a56a0] hover:underline font-semibold">Details →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b]">Page</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b]">LCP</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b]">CLS</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b]">FID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b]">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {latestPerf.map((snap, i) => (
                  <tr key={i} className="hover:bg-[#f8fafc]">
                    <td className="px-5 py-3 font-medium text-[#374151] max-w-[180px] truncate">{snap.page_path}</td>
                    <td className="px-5 py-3 tabular-nums text-xs">
                      <span className={snap.lcp_ms > 2500 ? "text-red-600 font-bold" : snap.lcp_ms > 1800 ? "text-amber-600" : "text-green-600"}>
                        {snap.lcp_ms ? `${snap.lcp_ms}ms` : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 tabular-nums text-xs">
                      <span className={snap.cls_score > 0.25 ? "text-red-600 font-bold" : snap.cls_score > 0.1 ? "text-amber-600" : "text-green-600"}>
                        {snap.cls_score != null ? snap.cls_score.toFixed(3) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 tabular-nums text-xs">
                      <span className={snap.fid_ms > 100 ? "text-red-600 font-bold" : snap.fid_ms > 50 ? "text-amber-600" : "text-green-600"}>
                        {snap.fid_ms ? `${snap.fid_ms}ms` : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        (snap.performance_score ?? 0) >= 90 ? "bg-green-100 text-green-700" :
                        (snap.performance_score ?? 0) >= 70 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {snap.performance_score ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI failures */}
      {(failedAiRes.data ?? []).length > 0 && (
        <div className="bg-white rounded-xl border border-red-200">
          <div className="px-5 py-4 border-b border-red-100 bg-red-50 rounded-t-xl">
            <h2 className="text-sm font-semibold text-red-800">Recent AI Failures</h2>
          </div>
          <div className="divide-y divide-[#f8fafc]">
            {(failedAiRes.data ?? []).map((f) => (
              <div key={f.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#374151] truncate">{f.action}</p>
                    {f.error_message && (
                      <p className="text-xs text-red-600 mt-0.5 truncate">{f.error_message}</p>
                    )}
                  </div>
                  <p className="text-xs text-[#94a3b8] flex-shrink-0">
                    {new Date(f.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent audit events */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#0f172a]">Recent Platform Events</h2>
          <a href="/owner/audit" className="text-xs text-[#1a56a0] hover:underline font-semibold">Full audit log →</a>
        </div>
        <div className="divide-y divide-[#f8fafc]">
          {(recentAuditRes.data ?? []).map((log) => (
            <div key={log.id} className="px-5 py-3 flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] flex-shrink-0 mt-1.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#374151] font-medium truncate">{log.action}</p>
                {log.target_table && (
                  <p className="text-xs text-[#94a3b8] mt-0.5">{log.target_table}</p>
                )}
              </div>
              <p className="text-xs text-[#94a3b8] flex-shrink-0">
                {new Date(log.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/health",       label: "Health Check" },
          { href: "/admin/monitoring",   label: "Monitoring" },
          { href: "/admin/performance",  label: "Performance" },
          { href: "/admin/logs",         label: "Error Logs" },
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
