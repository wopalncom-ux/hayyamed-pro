import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendWebhookDelivery } from "@/lib/webhooks/dispatch";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

const BATCH_SIZE = 20;
const MAX_ATTEMPTS = 5;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Fetch pending deliveries that are ready to send (not exceeded max attempts)
  const { data: deliveries, error } = await admin
    .from("webhook_deliveries")
    .select("id")
    .eq("status", "pending")
    .lt("attempts", MAX_ATTEMPTS)
    .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!deliveries?.length) {
    await pingCronMonitor("process-webhooks");
    return NextResponse.json({ processed: 0, message: "No pending deliveries" });
  }

  const results = await Promise.allSettled(
    deliveries.map((d) => sendWebhookDelivery(d.id))
  );

  let delivered = 0;
  let failed = 0;
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.ok) delivered++;
    else failed++;
  }

  // Mark deliveries that have exceeded max attempts as permanently failed
  await admin
    .from("webhook_deliveries")
    .update({ status: "failed" })
    .eq("status", "pending")
    .gte("attempts", MAX_ATTEMPTS);

  await pingCronMonitor("process-webhooks");

  return NextResponse.json({
    processed: deliveries.length,
    delivered,
    failed,
  });
}
