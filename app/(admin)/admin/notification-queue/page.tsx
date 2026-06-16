import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/adminAuth";
import NotificationQueueClient from "./NotificationQueueClient";

export const metadata = { title: "Notification Queue — Hayya Med Pro Admin" };
export const dynamic = "force-dynamic";

export type QueueItem = {
  id: string;
  professional_id: string | null;
  channel: string;
  template_id: string;
  status: string;
  attempts: number;
  max_attempts: number;
  error_message: string | null;
  scheduled_at: string;
  created_at: string;
  next_retry_at: string | null;
};

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "yellow" | "red" | "green" | "gray";
}) {
  const colors = {
    yellow: "bg-yellow-50 text-yellow-800 border-yellow-200",
    red:    "bg-red-50 text-red-800 border-red-200",
    green:  "bg-green-50 text-green-800 border-green-200",
    gray:   "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
    </div>
  );
}

export default async function NotificationQueuePage() {
  const user = await requireAdminUser();
  if (!user) {
    return <p className="p-8 text-red-600 font-medium">Unauthorized</p>;
  }

  const admin = createAdminClient();
  const since24h = new Date(Date.now() - 86_400_000).toISOString();

  const [pendingRes, failedRes, sentTodayRes, cancelledRes, itemsRes] = await Promise.all([
    admin
      .from("notification_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("notification_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed"),
    admin
      .from("notification_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("sent_at", since24h),
    admin
      .from("notification_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "cancelled"),
    admin
      .from("notification_queue")
      .select(
        "id, professional_id, channel, template_id, status, attempts, max_attempts, error_message, scheduled_at, created_at, next_retry_at"
      )
      .in("status", ["failed", "pending"])
      .order("status", { ascending: true })   // "failed" sorts before "pending"
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const stats = {
    pending:    pendingRes.count    ?? 0,
    failed:     failedRes.count     ?? 0,
    sentToday:  sentTodayRes.count  ?? 0,
    cancelled:  cancelledRes.count  ?? 0,
  };

  const items = (itemsRes.data ?? []) as QueueItem[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Queue</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Inspect failed and pending notifications — retry or cancel individual items.
          Showing up to 100 most recent.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending"    value={stats.pending}   color="yellow" />
        <StatCard label="Failed"     value={stats.failed}    color="red"    />
        <StatCard label="Sent today" value={stats.sentToday} color="green"  />
        <StatCard label="Cancelled"  value={stats.cancelled} color="gray"   />
      </div>

      <NotificationQueueClient items={items} totalFailed={stats.failed} />
    </div>
  );
}
