import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendLicenseExpiryEmail } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";
import { sendPushNotification } from "@/lib/push";

export const runtime = "nodejs";

// Trigger thresholds in days
const REMINDER_DAYS = [90, 60, 30, 14, 7];

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const today = new Date();
  const targetDates = REMINDER_DAYS.map((d) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0, 10);
  });

  // Requires migration 022: email_license_expiry column with DEFAULT true
  const { data: profiles, error } = await admin
    .from("professional_profiles")
    .select("auth_id, email, full_name, license_expiry, push_license_expiry")
    .in("license_expiry", targetDates)
    .not("email", "is", null)
    .eq("email_license_expiry", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!profiles?.length) {
    await pingCronMonitor("license-reminders");
    return NextResponse.json({ sent: 0, message: "No reminders due today" });
  }

  const authIds = profiles.map((p) => p.auth_id);
  const { data: pushSubs } = await admin
    .from("push_subscriptions")
    .select("professional_id, endpoint, p256dh, auth")
    .in("professional_id", authIds);

  const pushMap = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
  for (const sub of pushSubs ?? []) {
    if (!pushMap.has(sub.professional_id)) pushMap.set(sub.professional_id, []);
    pushMap.get(sub.professional_id)!.push(sub);
  }

  let sent = 0;
  const results: { email: string; daysLeft: number; ok: boolean }[] = [];

  for (const p of profiles) {
    if (!p.email || !p.license_expiry) continue;

    const expiryMs = new Date(p.license_expiry).getTime();
    const daysLeft = Math.ceil((expiryMs - Date.now()) / 86400000);
    const name = p.full_name ?? p.email.split("@")[0];

    try {
      await sendLicenseExpiryEmail({
        to: p.email,
        name,
        expiryDate: new Date(p.license_expiry).toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        }),
        daysLeft,
        authId: p.auth_id,
      });
      sent++;
      results.push({ email: p.email, daysLeft, ok: true });
    } catch {
      results.push({ email: p.email, daysLeft, ok: false });
    }

    // Fire-and-forget push notifications — respect push_license_expiry preference
    if (p.push_license_expiry === false) continue;
    const subs = pushMap.get(p.auth_id) ?? [];
    for (const sub of subs) {
      sendPushNotification(sub, {
        title: `License expiry in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
        body: `Your license expires on ${new Date(p.license_expiry!).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Review it now.`,
        url: "/dashboard/cme",
      }).then(({ expired }) => {
        if (expired) {
          admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint).then(() => {});
        }
      }).catch(() => {});
    }
  }

  await pingCronMonitor("license-reminders");
  return NextResponse.json({ sent, total: profiles.length, results });
}
