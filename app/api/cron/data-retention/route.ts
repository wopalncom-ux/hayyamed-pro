import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

// Retention windows
const AI_CALL_LOG_DAYS          = 90;
const NOTIFICATION_QUEUE_DAYS   = 30;
const WEBHOOK_DELIVERY_DAYS     = 90;
const DRIP_EMAIL_LOG_DAYS       = 90;

/**
 * GET /api/cron/data-retention
 *
 * Runs weekly (Sunday 04:00 GST) to prune rows that have no business value
 * beyond their retention window. Prevents unbounded growth in four high-volume
 * append-only tables. Uses service role (admin client) to bypass RLS.
 *
 * Tables and retention:
 *   ai_call_logs          — 90 days  (FinOps lookback window)
 *   notification_queue    — 30 days  (sent/failed/cancelled rows only)
 *   webhook_deliveries    — 90 days  (delivered/failed rows only)
 *   drip_email_log        — 90 days  (sequence completion records)
 *
 * audit_logs are NOT pruned here — 7-year retention per CLAUDE.md.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();

  function cutoff(days: number): string {
    return new Date(now.getTime() - days * 86_400_000).toISOString();
  }

  let deleted = 0;

  // ── 1. ai_call_logs > 90 days ─────────────────────────────────────────────
  {
    const { data, error } = await admin
      .from("ai_call_logs")
      .delete()
      .lt("created_at", cutoff(AI_CALL_LOG_DAYS))
      .select("id");
    if (!error) deleted += data?.length ?? 0;
    else console.error("data-retention: ai_call_logs cleanup error:", error.message);
  }

  // ── 2. notification_queue — terminal status rows > 30 days ────────────────
  {
    const { data, error } = await admin
      .from("notification_queue")
      .delete()
      .in("status", ["sent", "failed", "cancelled"])
      .lt("created_at", cutoff(NOTIFICATION_QUEUE_DAYS))
      .select("id");
    if (!error) deleted += data?.length ?? 0;
    else console.error("data-retention: notification_queue cleanup error:", error.message);
  }

  // ── 3. webhook_deliveries — terminal status rows > 90 days ───────────────
  {
    const { data, error } = await admin
      .from("webhook_deliveries")
      .delete()
      .in("status", ["delivered", "failed"])
      .lt("created_at", cutoff(WEBHOOK_DELIVERY_DAYS))
      .select("id");
    if (!error) deleted += data?.length ?? 0;
    else console.error("data-retention: webhook_deliveries cleanup error:", error.message);
  }

  // ── 4. drip_email_log > 90 days ───────────────────────────────────────────
  {
    const { data, error } = await admin
      .from("drip_email_log")
      .delete()
      .lt("created_at", cutoff(DRIP_EMAIL_LOG_DAYS))
      .select("id");
    if (!error) deleted += data?.length ?? 0;
    else console.error("data-retention: drip_email_log cleanup error:", error.message);
  }

  await pingCronMonitor("data-retention", { processed: deleted });

  return NextResponse.json({
    ok: true,
    rows_deleted: deleted,
    retention_windows: {
      ai_call_logs:       `${AI_CALL_LOG_DAYS}d`,
      notification_queue: `${NOTIFICATION_QUEUE_DAYS}d (terminal only)`,
      webhook_deliveries: `${WEBHOOK_DELIVERY_DAYS}d (terminal only)`,
      drip_email_log:     `${DRIP_EMAIL_LOG_DAYS}d`,
    },
  });
}
