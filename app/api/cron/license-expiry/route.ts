import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push";
import { sendLicenseExpiryEmail } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

// Called daily by GCP Cloud Scheduler or cron service
// Authorization: Bearer $CRON_SECRET
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date();

  // Find professionals with license expiring in 30 or 7 days
  const targets = [30, 7];
  let notified = 0;

  for (const days of targets) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + days);
    const dateStr = targetDate.toISOString().slice(0, 10);

    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, license_expiry")
      .eq("license_expiry", dateStr);

    if (!profiles?.length) continue;

    for (const profile of profiles) {
      if (profile.email) {
        await sendLicenseExpiryEmail({
          to: profile.email,
          name: profile.full_name ?? "Professional",
          expiryDate: profile.license_expiry,
          daysLeft: days,
        });
      }

      // Send push notification
      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("professional_id", profile.auth_id);

      for (const sub of subs ?? []) {
        const result = await sendPushNotification(sub, {
          title: `License Expiring in ${days} Days`,
          body: `Your license expires on ${profile.license_expiry}. Check your CME status now.`,
          url: "/dashboard/licenses",
        });
        if (result.expired) {
          await admin.from("push_subscriptions").delete()
            .eq("professional_id", profile.auth_id).eq("endpoint", sub.endpoint);
        }
      }

      notified++;
    }
  }

  await pingCronMonitor("license-expiry");
  return NextResponse.json({ ok: true, notified });
}
