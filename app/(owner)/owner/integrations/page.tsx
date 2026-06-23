import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integration Center",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function OwnerIntegrationsPage() {
  await requireOwnerAuth();
  const admin = createAdminClient();

  const [webhooksRes, apiKeysRes, featureFlagsRes] = await Promise.all([
    admin.from("provider_webhooks").select("id, url, is_active, event_types").limit(20),
    admin.from("api_keys").select("id, role, created_at, last_used_at").order("created_at", { ascending: false }).limit(20),
    admin.from("feature_flags").select("key, enabled, description").order("key"),
  ]);

  const integrations = [
    {
      name: "Supabase",
      category: "Database & Auth",
      status: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      description: "PostgreSQL database, auth, storage, and realtime",
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/project/default` : null,
      value: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 40)}…` : "Not configured",
      region: "Supabase me-central1 (Qatar)",
    },
    {
      name: "Postmark",
      category: "Email Delivery",
      status: !!process.env.POSTMARK_API_TOKEN,
      description: "Transactional email: onboarding, alerts, reports",
      value: process.env.POSTMARK_API_TOKEN ? "API key configured ✓" : "POSTMARK_API_TOKEN missing",
      configKey: "POSTMARK_API_TOKEN",
    },
    {
      name: "Postmark Webhooks",
      category: "Email Delivery",
      status: !!process.env.POSTMARK_WEBHOOK_TOKEN,
      description: "Bounce and spam notification webhooks",
      value: process.env.POSTMARK_WEBHOOK_TOKEN ? "Webhook token configured ✓" : "POSTMARK_WEBHOOK_TOKEN missing",
      configKey: "POSTMARK_WEBHOOK_TOKEN",
    },
    {
      name: "Paddle",
      category: "Payments",
      status: !!process.env.PADDLE_API_KEY,
      description: "Subscription billing, invoices, and tax management",
      value: process.env.PADDLE_API_KEY ? "API key configured ✓" : "PADDLE_API_KEY missing",
      configKey: "PADDLE_API_KEY",
    },
    {
      name: "Paddle Webhooks",
      category: "Payments",
      status: !!process.env.PADDLE_WEBHOOK_SECRET,
      description: "Payment event notifications (subscription created, past due)",
      value: process.env.PADDLE_WEBHOOK_SECRET ? "Webhook secret configured ✓" : "PADDLE_WEBHOOK_SECRET missing",
      configKey: "PADDLE_WEBHOOK_SECRET",
    },
    {
      name: "Anthropic Claude",
      category: "AI",
      status: !!process.env.ANTHROPIC_API_KEY,
      description: "Claude Haiku/Sonnet/Opus for CME analysis and chatbot",
      value: process.env.ANTHROPIC_API_KEY ? "API key configured ✓" : "ANTHROPIC_API_KEY missing",
      configKey: "ANTHROPIC_API_KEY",
    },
    {
      name: "Google Vertex AI (Gemini)",
      category: "AI",
      status: !!process.env.GOOGLE_CLOUD_PROJECT,
      description: "Gemini Flash for public chatbot (us-east5 region)",
      value: process.env.GOOGLE_CLOUD_PROJECT ?? "GOOGLE_CLOUD_PROJECT missing",
      configKey: "GOOGLE_CLOUD_PROJECT",
    },
    {
      name: "Web Push (VAPID)",
      category: "Push Notifications",
      status: !!(process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      description: "Browser push notifications for CME reminders and alerts",
      value: process.env.VAPID_PRIVATE_KEY ? "VAPID keys configured ✓" : "VAPID keys missing",
      configKey: "VAPID_PRIVATE_KEY",
    },
    {
      name: "Upstash Redis",
      category: "Rate Limiting",
      status: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      description: "Rate limiting on auth, AI, and webhook endpoints",
      value: process.env.UPSTASH_REDIS_REST_URL ? "Redis URL configured ✓" : "Upstash not configured",
      configKey: "UPSTASH_REDIS_REST_URL",
    },
    {
      name: "Cron Jobs (CRON_SECRET)",
      category: "Scheduled Jobs",
      status: !!process.env.CRON_SECRET,
      description: "16 scheduled jobs: compliance alerts, digests, reminders",
      value: process.env.CRON_SECRET ? "CRON_SECRET configured ✓" : "CRON_SECRET missing",
      configKey: "CRON_SECRET",
    },
    {
      name: "GCP Cloud Run",
      category: "Infrastructure",
      status: process.env.GOOGLE_CLOUD_PROJECT?.startsWith("project-") ?? false,
      description: "Serverless hosting in me-central1 (Doha, Qatar)",
      value: `Region: me-central1 (Qatar) · Project: ${process.env.GOOGLE_CLOUD_PROJECT ?? "—"}`,
      region: "Qatar data residency enforced",
    },
    {
      name: "Google Analytics",
      category: "Analytics",
      status: !!process.env.NEXT_PUBLIC_GA_ID,
      description: "GA4 for public website analytics",
      value: process.env.NEXT_PUBLIC_GA_ID ?? "Not configured",
      configKey: "NEXT_PUBLIC_GA_ID",
    },
  ];

  const categories = [...new Set(integrations.map((i) => i.category))];
  const activeCount = integrations.filter((i) => i.status).length;
  const missingCount = integrations.length - activeCount;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Integration Control Center</h1>
          <p className="text-sm text-[#64748b] mt-0.5">All platform integrations, their status, and configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-green-50 text-green-700 border-green-200">
            {activeCount} active
          </span>
          {missingCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-red-50 text-red-700 border-red-200">
              {missingCount} missing
            </span>
          )}
        </div>
      </div>

      {/* Integrations by category */}
      {categories.map((cat) => {
        const catItems = integrations.filter((i) => i.category === cat);
        return (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3">{cat}</p>
            <div className="space-y-3">
              {catItems.map((int) => (
                <div
                  key={int.name}
                  className={`bg-white rounded-xl border p-4 flex items-start justify-between gap-4 ${
                    int.status ? "border-[#e2e8f0]" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${int.status ? "bg-green-500" : "bg-red-500"}`} />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${int.status ? "text-[#0f172a]" : "text-red-800"}`}>
                        {int.name}
                      </p>
                      <p className="text-xs text-[#64748b] mt-0.5">{int.description}</p>
                      <p className={`text-xs mt-1 font-mono truncate ${int.status ? "text-[#94a3b8]" : "text-red-600"}`}>
                        {int.value}
                      </p>
                      {int.region && (
                        <p className="text-[11px] text-[#94a3b8] mt-0.5">{int.region}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full flex-shrink-0 ${
                    int.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {int.status ? "ACTIVE" : "MISSING"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Feature flags */}
      {(featureFlagsRes.data ?? []).length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Feature Flags</p>
            <a href="/admin/feature-flags" className="text-xs text-[#1a56a0] hover:underline font-semibold">Manage →</a>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f8fafc]">
            {(featureFlagsRes.data ?? []).map((flag) => (
              <div key={flag.key} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#374151]">{flag.key}</p>
                  {flag.description && <p className="text-xs text-[#94a3b8] mt-0.5">{flag.description}</p>}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  flag.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {flag.enabled ? "ON" : "OFF"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API keys summary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            API Keys ({apiKeysRes.data?.length ?? 0} active)
          </p>
          <a href="/admin/webhooks" className="text-xs text-[#1a56a0] hover:underline font-semibold">Manage →</a>
        </div>
        {(apiKeysRes.data ?? []).length > 0 ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f8fafc]">
            {(apiKeysRes.data ?? []).map((key) => (
              <div key={key.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#374151] capitalize bg-[#f1f5f9] px-2 py-0.5 rounded">
                    {key.role}
                  </span>
                  <span className="text-xs font-mono text-[#94a3b8]">{key.id.slice(0, 8)}…</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                  {key.last_used_at && (
                    <span>Last used {new Date(key.last_used_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  )}
                  <span>Created {new Date(key.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-8 text-center text-sm text-[#94a3b8]">
            No API keys issued yet
          </div>
        )}
      </div>

      {/* Webhooks */}
      {(webhooksRes.data ?? []).length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Provider Webhooks ({webhooksRes.data?.length ?? 0})
            </p>
            <a href="/admin/webhooks" className="text-xs text-[#1a56a0] hover:underline font-semibold">Manage →</a>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f8fafc]">
            {(webhooksRes.data ?? []).map((wh) => (
              <div key={wh.id} className="px-5 py-3.5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-[#374151] font-mono truncate">{wh.url}</p>
                  {wh.event_types && (
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      {Array.isArray(wh.event_types) ? (wh.event_types as string[]).join(", ") : String(wh.event_types)}
                    </p>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  wh.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {wh.is_active ? "ACTIVE" : "OFF"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
