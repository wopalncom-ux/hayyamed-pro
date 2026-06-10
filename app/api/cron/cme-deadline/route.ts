import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date();

  // Find CME wallets ending in 30 or 7 days where status is not compliant
  const targets = [30, 7];
  let notified = 0;

  for (const days of targets) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + days);
    const dateStr = targetDate.toISOString().slice(0, 10);

    const { data: wallets } = await admin
      .from("cme_wallets")
      .select("professional_id, required_credits, completed_credits, cycle_end_date")
      .eq("cycle_end_date", dateStr)
      .neq("compliance_status", "compliant");

    if (!wallets?.length) continue;

    for (const wallet of wallets) {
      const deficit = wallet.required_credits - wallet.completed_credits;
      if (deficit <= 0) continue;

      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("professional_id", wallet.professional_id);

      for (const sub of subs ?? []) {
        const result = await sendPushNotification(sub, {
          title: `CME Deadline in ${days} Days`,
          body: `You need ${deficit} more credits before your cycle ends on ${wallet.cycle_end_date}.`,
          url: "/dashboard/cme",
        });
        if (result.expired) {
          await admin.from("push_subscriptions").delete()
            .eq("professional_id", wallet.professional_id).eq("endpoint", sub.endpoint);
        }
      }

      notified++;
    }
  }

  return NextResponse.json({ ok: true, notified });
}
