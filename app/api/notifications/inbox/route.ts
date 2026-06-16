import { NextRequest, NextResponse } from "next/server";
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
 * Returns recent sent/pending notifications for the authenticated user.
 * Used by NotificationBell dropdown and /dashboard/notifications inbox section.
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
    .select("id, channel, template_id, status, created_at, sent_at")
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
    created_at: row.created_at,
    sent_at: row.sent_at,
  }));

  const unread = notifications.filter((n) => n.status === "sent").length;

  return NextResponse.json({ notifications, unread, total: notifications.length });
}
