import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";

export const runtime = "nodejs";

const TEMPLATE_LABELS: Record<string, string> = {
  license_expiry_90d:          "License expiry in 90 days",
  license_expiry_60d:          "License expiry in 60 days",
  license_expiry_30d:          "License expiry in 30 days",
  license_expiry_14d:          "License expiry in 14 days",
  license_expiry_7d:           "License expiry in 7 days",
  cme_deadline_reminder:       "CME cycle deadline reminder",
  cme_deadline_30d:            "CME deadline in 30 days",
  cme_deadline_14d:            "CME deadline in 14 days",
  cme_deadline_7d:             "CME deadline in 7 days",
  compliance_alert:            "Compliance status alert",
  cme_verified:                "CME activity verified",
  cme_rejected:                "CME activity rejected",
  training_deadline:           "Training deadline reminder",
  cycle_renewed:               "CME cycle renewed",
  account_suspended:           "Account suspended",
  account_unsuspended:         "Account reinstated",
  drip_d1:                     "Getting started with Hayya Med Pro",
  drip_d3:                     "Track your first CME activity",
  drip_d7:                     "Download your compliance report",
  drip_d10:                    "Invite your team",
  trial_reminder:              "Trial period reminder",
  trial_ending:                "Your trial is ending soon",
  authority_reminder:          "Notice from your licensing authority",
};

function labelForTemplate(templateId: string): string {
  return TEMPLATE_LABELS[templateId] ?? templateId.replace(/_/g, " ");
}

function iconForTemplate(templateId: string): string {
  if (templateId.startsWith("license_")) return "id-card";
  if (templateId.startsWith("cme_")) return "graduation-cap";
  if (templateId.startsWith("compliance_")) return "shield";
  if (templateId.startsWith("training_")) return "book";
  if (templateId.startsWith("cycle_")) return "refresh";
  if (templateId.startsWith("drip_")) return "mail";
  if (templateId.startsWith("trial_")) return "clock";
  return "bell";
}

/**
 * GET /api/notifications/inbox?limit=20&offset=0
 * Returns recent notifications for the authenticated user.
 * Unread = status='sent' AND read_at IS NULL.
 */
export async function GET(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit  = Math.min(parseInt(searchParams.get("limit")  ?? "20"), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("notification_queue")
    .select("id, channel, template_id, status, read_at, created_at, sent_at")
    .eq("professional_id", user.id)
    .in("status", ["sent", "pending", "failed"])
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const notifications = (rows ?? []).map((row) => ({
    id: row.id,
    label: labelForTemplate(row.template_id),
    icon: iconForTemplate(row.template_id),
    channel: row.channel,
    status: row.status,
    is_read: row.read_at !== null,
    created_at: row.created_at,
    sent_at: row.sent_at,
  }));

  const unread = notifications.filter((n) => n.status === "sent" && !n.is_read).length;

  return NextResponse.json({ notifications, unread, total: notifications.length });
}

const MarkReadSchema = z.union([
  z.object({ id: z.string().uuid() }),
  z.object({ mark_all_read: z.literal(true) }),
]);

/**
 * PATCH /api/notifications/inbox
 * Body: { id: uuid }          — mark one notification as read
 *       { mark_all_read: true } — mark all unread notifications as read
 */
export async function PATCH(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = MarkReadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const admin = createAdminClient();
  const now = new Date().toISOString();

  if ("mark_all_read" in parsed.data) {
    await admin
      .from("notification_queue")
      .update({ read_at: now })
      .eq("professional_id", user.id)
      .eq("status", "sent")
      .is("read_at", null);

    return NextResponse.json({ ok: true });
  }

  // Single notification — verify ownership before marking read
  const { data: row } = await admin
    .from("notification_queue")
    .select("professional_id, read_at")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (!row || row.professional_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.read_at !== null) {
    return NextResponse.json({ ok: true }); // already read — idempotent
  }

  await admin
    .from("notification_queue")
    .update({ read_at: now })
    .eq("id", parsed.data.id);

  return NextResponse.json({ ok: true });
}
