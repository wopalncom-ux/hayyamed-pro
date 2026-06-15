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

  // ── Phase 1: primary license on professional_profiles ─────────────────────
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

  const authIds = (profiles ?? []).map((p) => p.auth_id);
  const { data: pushSubs } = authIds.length
    ? await admin
        .from("push_subscriptions")
        .select("professional_id, endpoint, p256dh, auth")
        .in("professional_id", authIds)
    : { data: [] };

  const pushMap = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
  for (const sub of pushSubs ?? []) {
    if (!pushMap.has(sub.professional_id)) pushMap.set(sub.professional_id, []);
    pushMap.get(sub.professional_id)!.push(sub);
  }

  let sent = 0;
  const results: { email: string; daysLeft: number; ok: boolean }[] = [];

  for (const p of profiles ?? []) {
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

  // ── Phase 2: secondary licenses in professional_licenses ──────────────────
  // Professionals whose primary license was already handled above are skipped
  // to avoid a double-notification on the same calendar day.
  const alreadyNotified = new Set<string>((profiles ?? []).map((p) => p.auth_id));

  const { data: expiringLicenses } = await admin
    .from("professional_licenses")
    .select("professional_id, license_number, licensing_authority, country_code, expiry_date")
    .in("expiry_date", targetDates);

  const newProfIds = [
    ...new Set(
      (expiringLicenses ?? [])
        .map((l) => l.professional_id as string)
        .filter((id) => !alreadyNotified.has(id))
    ),
  ];

  if (newProfIds.length > 0) {
    const [secProfilesRes, secPushSubsRes] = await Promise.all([
      admin
        .from("professional_profiles")
        .select("auth_id, email, full_name, email_license_expiry, push_license_expiry")
        .in("auth_id", newProfIds)
        .not("email", "is", null)
        .eq("email_license_expiry", true),
      admin
        .from("push_subscriptions")
        .select("professional_id, endpoint, p256dh, auth")
        .in("professional_id", newProfIds),
    ]);

    const secPushMap = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
    for (const sub of secPushSubsRes.data ?? []) {
      if (!secPushMap.has(sub.professional_id)) secPushMap.set(sub.professional_id, []);
      secPushMap.get(sub.professional_id)!.push(sub);
    }

    // Per professional, keep the soonest-expiring secondary license for the notification
    const licenseByProf = new Map<string, {
      license_number: string;
      licensing_authority: string;
      country_code: string;
      expiry_date: string;
    }>();
    for (const l of expiringLicenses ?? []) {
      const pid = l.professional_id as string;
      if (alreadyNotified.has(pid)) continue;
      const existing = licenseByProf.get(pid);
      if (!existing || new Date(l.expiry_date as string) < new Date(existing.expiry_date)) {
        licenseByProf.set(pid, {
          license_number: l.license_number as string,
          licensing_authority: l.licensing_authority as string,
          country_code: l.country_code as string,
          expiry_date: l.expiry_date as string,
        });
      }
    }

    for (const p of secProfilesRes.data ?? []) {
      if (!p.email) continue;
      const license = licenseByProf.get(p.auth_id);
      if (!license) continue;

      const daysLeft = Math.ceil((new Date(license.expiry_date).getTime() - Date.now()) / 86400000);
      const name = p.full_name ?? p.email.split("@")[0];

      try {
        await sendLicenseExpiryEmail({
          to: p.email,
          name,
          expiryDate: new Date(license.expiry_date).toLocaleDateString("en-GB", {
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

      if (p.push_license_expiry !== false) {
        const subs = secPushMap.get(p.auth_id) ?? [];
        for (const sub of subs) {
          sendPushNotification(sub, {
            title: `License expiry in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
            body: `Your ${license.licensing_authority} (${license.country_code}) license expires on ${new Date(license.expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Review it now.`,
            url: "/dashboard/cme",
          }).then(({ expired }) => {
            if (expired) {
              admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint).then(() => {});
            }
          }).catch(() => {});
        }
      }
    }
  }

  await pingCronMonitor("license-reminders");
  return NextResponse.json({
    sent,
    total: (profiles?.length ?? 0) + newProfIds.length,
    results,
  });
}
