import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Webhook Event Log — Admin" };

// Kept in sync with the exact action strings each handler actually calls
// logAudit() with (verified against app/api/paddle/webhook, app/api/webhooks/postmark,
// and app/api/admin/push-broadcast — 2026-07-05). Previously this list included
// "email.bounced"/"email.spam_reported" (the handlers actually log "email.hard_bounce"/
// "email.spam_complaint") and several actions that are never logged anywhere at all
// (subscription.paused/resumed, email.unsubscribed, cron.*) — so real bounce/spam
// events were silently hidden and several filters could never match anything.
const WEBHOOK_ACTIONS = [
  "subscription.activated",
  "subscription.activated_webhook",
  "subscription.canceled",
  "subscription.updated",
  "email.hard_bounce",
  "email.spam_complaint",
  "admin.push_broadcast",
];

const ACTION_STYLES: Record<string, { label: string; badge: string }> = {
  "subscription.activated":         { label: "Subscription Activated",  badge: "bg-[#dcfce7] text-[#16a34a]" },
  "subscription.activated_webhook": { label: "Sub Webhook Confirmed",   badge: "bg-[#f0fdf4] text-[#166534]" },
  "subscription.canceled":          { label: "Subscription Canceled",   badge: "bg-[#fef2f2] text-[#dc2626]" },
  "subscription.updated":           { label: "Subscription Updated",    badge: "bg-[#eff6ff] text-[#1a56a0]" },
  "email.hard_bounce":              { label: "Email Bounced",           badge: "bg-[#fef2f2] text-[#dc2626]" },
  "email.spam_complaint":           { label: "Spam Reported",           badge: "bg-[#fef2f2] text-[#dc2626]" },
  "admin.push_broadcast":           { label: "Push Broadcast",          badge: "bg-[#fdf4ff] text-[#7e22ce]" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default async function WebhookLogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  if (!member) redirect("/dashboard");

  const { data: events } = await admin
    .from("audit_logs")
    .select("id, action, actor_auth_id, target_table, metadata, created_at")
    .in("action", WEBHOOK_ACTIONS)
    .order("created_at", { ascending: false })
    .limit(100);

  const logs = events ?? [];

  // Aggregate counts per action type
  const actionCounts = WEBHOOK_ACTIONS.reduce<Record<string, number>>((acc, a) => {
    acc[a] = logs.filter((l) => l.action === a).length;
    return acc;
  }, {});

  const subscriptionEvents = logs.filter((l) => l.action.startsWith("subscription.")).length;
  const emailEvents = logs.filter((l) => l.action.startsWith("email.")).length;
  const pushEvents = logs.filter((l) => l.action.startsWith("admin.push")).length;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Webhook Event Log</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Recent webhook and system events from Paddle, Postmark, and push notifications.
          Sourced from audit_logs — last 100 entries.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Paddle Events</p>
          <p className="text-3xl font-bold text-[#1a56a0]">{subscriptionEvents}</p>
          <p className="text-xs text-[#64748b] mt-1">subscriptions</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Email Events</p>
          <p className="text-3xl font-bold text-[#d97706]">{emailEvents}</p>
          <p className="text-xs text-[#64748b] mt-1">bounces · spam · unsub</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Push Events</p>
          <p className="text-3xl font-bold text-[#7e22ce]">{pushEvents}</p>
          <p className="text-xs text-[#64748b] mt-1">broadcasts sent</p>
        </div>
      </div>

      {/* Action breakdown */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 mb-8">
        <h2 className="text-sm font-semibold text-[#111] mb-4">Event Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WEBHOOK_ACTIONS.filter((a) => actionCounts[a] > 0).map((action) => {
            const cfg = ACTION_STYLES[action] ?? { label: action, badge: "bg-[#f1f5f9] text-[#64748b]" };
            return (
              <div key={action} className="flex items-center justify-between gap-2 bg-[#f8fafc] rounded-lg px-3 py-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                <span className="text-sm font-bold text-[#111]">{actionCounts[action]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event timeline */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Event Timeline</h2>
          <span className="text-xs text-[#64748b]">{logs.length} events</span>
        </div>

        {logs.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#64748b]">
            No webhook events found. Events appear here after Paddle, Postmark, or push activity.
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9]">
            {logs.map((log) => {
              const cfg = ACTION_STYLES[log.action] ?? { label: log.action, badge: "bg-[#f1f5f9] text-[#64748b]" };
              const meta = log.metadata as Record<string, unknown> | null;
              return (
                <div key={log.id} className="px-6 py-3.5 flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {meta && Object.keys(meta).length > 0 && (
                      <p className="text-xs text-[#64748b] font-mono truncate">
                        {Object.entries(meta)
                          .filter(([, v]) => v !== null && v !== undefined)
                          .slice(0, 4)
                          .map(([k, v]) => `${k}: ${String(v)}`)
                          .join(" · ")}
                      </p>
                    )}
                    {log.target_table && (
                      <p className="text-xs text-[#64748b] mt-0.5">table: {log.target_table}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-xs text-[#64748b] whitespace-nowrap">
                    {timeAgo(log.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
