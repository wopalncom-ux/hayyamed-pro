import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendLicenseExpiryEmail } from "@/lib/email";

export const runtime = "nodejs";

// Trigger thresholds in days
const REMINDER_DAYS = [90, 60, 30, 14, 7];

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  // Build a date condition: license_expiry is exactly N days from today for any N in REMINDER_DAYS
  const today = new Date();
  const targetDates = REMINDER_DAYS.map((d) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0, 10);
  });

  // Fetch professionals whose license expires on a reminder date
  const { data: profiles, error } = await admin
    .from("professional_profiles")
    .select("auth_id, email, full_name, license_expiry")
    .in("license_expiry", targetDates)
    .not("email", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!profiles?.length) {
    return NextResponse.json({ sent: 0, message: "No reminders due today" });
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
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        daysLeft,
      });
      sent++;
      results.push({ email: p.email, daysLeft, ok: true });
    } catch {
      results.push({ email: p.email, daysLeft, ok: false });
    }
  }

  return NextResponse.json({ sent, total: profiles.length, results });
}
