import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push";
import { pingCronMonitor } from "@/lib/cronMonitor";
import * as postmark from "postmark";

export const runtime = "nodejs";

const BATCH_SIZE = 50;

function getPostmark() {
  return new postmark.ServerClient(process.env.POSTMARK_API_TOKEN!);
}

// Process email notification from queue
async function processEmail(payload: Record<string, string>): Promise<{ ok: boolean; error?: string }> {
  const { to, subject, html } = payload;
  if (!to || !subject || !html) return { ok: false, error: "Missing to/subject/html in payload" };

  try {
    await getPostmark().sendEmail({
      From: process.env.EMAIL_FROM ?? "Hayya Med Pro <noreply@hayyamed.pro>",
      To: to,
      Subject: subject,
      HtmlBody: html,
      MessageStream: "outbound",
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// Process push notification from queue
async function processPush(
  admin: ReturnType<typeof createAdminClient>,
  professionalId: string,
  payload: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  const { title, body, url } = payload;
  if (!title || !body) return { ok: false, error: "Missing title/body in payload" };

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("professional_id", professionalId);

  if (!subs?.length) return { ok: false, error: "No push subscriptions found" };

  const expiredEndpoints: string[] = [];
  let sent = 0;

  for (const sub of subs) {
    const result = await sendPushNotification(sub, { title, body, url });
    if (result.error) {
      if ((result as { expired?: boolean }).expired) {
        expiredEndpoints.push(sub.endpoint);
      }
    } else {
      sent++;
    }
  }

  // Clean up expired subscriptions
  if (expiredEndpoints.length > 0) {
    await admin
      .from("push_subscriptions")
      .delete()
      .eq("professional_id", professionalId)
      .in("endpoint", expiredEndpoints);
  }

  return sent > 0
    ? { ok: true }
    : { ok: false, error: "All push subscriptions failed or expired" };
}

// GET /api/cron/process-notifications
// Drains the notification_queue — processes pending notifications in batches.
// Called by Cloud Scheduler every 5 minutes.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Fetch pending notifications due for sending, respecting retry backoff
  const { data: pendingItems } = await admin
    .from("notification_queue")
    .select("id, professional_id, channel, template_id, payload, attempts, max_attempts")
    .eq("status", "pending")
    .lte("scheduled_at", now)
    .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
    .order("scheduled_at", { ascending: true })
    .limit(BATCH_SIZE);

  const items = pendingItems ?? [];
  let processed = 0;
  let failed = 0;

  for (const item of items) {
    // Skip if already at max attempts
    if (item.attempts >= item.max_attempts) {
      await admin
        .from("notification_queue")
        .update({ status: "failed", error_message: "Max attempts reached" })
        .eq("id", item.id);
      failed++;
      continue;
    }

    // Increment attempt count immediately before trying
    await admin
      .from("notification_queue")
      .update({ attempts: item.attempts + 1 })
      .eq("id", item.id);

    const payload = item.payload as Record<string, string>;
    let result: { ok: boolean; error?: string };

    switch (item.channel) {
      case "email":
        result = await processEmail(payload);
        break;
      case "push":
        result = await processPush(admin, item.professional_id, payload);
        break;
      default:
        result = { ok: false, error: `Channel '${item.channel}' not implemented` };
    }

    const nextRetry = new Date(Date.now() + Math.pow(2, item.attempts + 1) * 60_000).toISOString();

    if (result.ok) {
      await admin
        .from("notification_queue")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", item.id);
      processed++;
    } else {
      const isLastAttempt = item.attempts + 1 >= item.max_attempts;
      await admin
        .from("notification_queue")
        .update({
          status: isLastAttempt ? "failed" : "pending",
          error_message: result.error ?? "Unknown error",
          next_retry_at: isLastAttempt ? null : nextRetry,
        })
        .eq("id", item.id);
      failed++;
    }
  }

  await pingCronMonitor("process-notifications", { sent: processed, processed: items.length, skipped: failed });

  return NextResponse.json({
    processed,
    failed,
    total: items.length,
  });
}
