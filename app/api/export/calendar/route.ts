import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";
import { checkAndLogRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

function toIcsDate(isoDate: string): string {
  // Convert "YYYY-MM-DD" â†’ "YYYYMMDD"
  return isoDate.replace(/-/g, "");
}

function toIcsDateTime(date: Date): string {
  // UTC timestamp: "YYYYMMDDTHHmmssZ"
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function foldLine(line: string): string {
  // iCal spec: fold lines longer than 75 octets
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let pos = 0;
  while (pos < line.length) {
    if (pos === 0) {
      parts.push(line.slice(0, 75));
      pos = 75;
    } else {
      parts.push(" " + line.slice(pos, pos + 74));
      pos += 74;
    }
  }
  return parts.join("\r\n");
}

interface VEvent {
  uid: string;
  summary: string;
  description: string;
  dtstart: string;     // YYYYMMDD for all-day events
  dtend: string;       // next day for all-day events
  dtstamp: string;     // UTC timestamp of generation
  url?: string;
  categories?: string;
  alarm?: { trigger: string; description: string };
}

function buildVEvent(ev: VEvent): string {
  const lines = [
    "BEGIN:VEVENT",
    foldLine(`UID:${ev.uid}`),
    foldLine(`SUMMARY:${escapeIcs(ev.summary)}`),
    foldLine(`DESCRIPTION:${escapeIcs(ev.description)}`),
    `DTSTART;VALUE=DATE:${ev.dtstart}`,
    `DTEND;VALUE=DATE:${ev.dtend}`,
    `DTSTAMP:${ev.dtstamp}`,
    `STATUS:CONFIRMED`,
    `TRANSP:TRANSPARENT`,
  ];

  if (ev.url) lines.push(foldLine(`URL:${ev.url}`));
  if (ev.categories) lines.push(foldLine(`CATEGORIES:${ev.categories}`));

  if (ev.alarm) {
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      foldLine(`DESCRIPTION:${escapeIcs(ev.alarm.description)}`),
      `TRIGGER:${ev.alarm.trigger}`,
      "END:VALARM",
    );
  }

  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const rl = await checkAndLogRateLimit({ action: "calendar_export", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });
  }

  const admin = createAdminClient();
  const [profileRes, walletsRes] = await Promise.all([
    admin.from("professional_profiles").select("full_name, license_expiry, licensing_authority").eq("auth_id", user.id).single(),
    admin.from("cme_wallets").select("id, country, cycle_end_date, required_credits, completed_credits, profession").eq("professional_id", user.id).order("created_at", { ascending: true }),
  ]);

  const profile = profileRes.data;
  const wallets = walletsRes.data ?? [];
  const dtstamp = toIcsDateTime(new Date());
  const events: VEvent[] = [];

  // License expiry event
  if (profile?.license_expiry) {
    const authority = profile.licensing_authority ?? "your licensing authority";
    const expiryDate = profile.license_expiry;

    events.push({
      uid: `license-expiry-${user.id}@hayyamed.pro`,
      summary: `License Expiry â€” ${authority}`,
      description: `Your ${authority} license expires today. Download your CME compliance report from Hayya Med Pro and submit your renewal. ${APP_URL}/dashboard`,
      dtstart: toIcsDate(expiryDate),
      dtend: toIcsDate(addDays(expiryDate, 1)),
      dtstamp,
      url: `${APP_URL}/dashboard/licenses`,
      categories: "License Renewal",
      alarm: {
        trigger: "-P30D",
        description: `${authority} license expires in 30 days. Log in to Hayya Med Pro to prepare your renewal submission.`,
      },
    });

    // 90-day reminder
    const remind90 = addDays(expiryDate, -90);
    if (new Date(remind90) > new Date()) {
      events.push({
        uid: `license-90d-${user.id}@hayyamed.pro`,
        summary: `License Renewal â€” 90 days to go (${authority})`,
        description: `Your ${authority} license expires in 90 days on ${expiryDate}. Start preparing your CME portfolio now. ${APP_URL}/dashboard`,
        dtstart: toIcsDate(remind90),
        dtend: toIcsDate(addDays(remind90, 1)),
        dtstamp,
        url: `${APP_URL}/dashboard`,
        categories: "License Renewal",
      });
    }
  }

  // CME wallet cycle-end events
  for (const wallet of wallets) {
    if (!wallet.cycle_end_date) continue;

    const country = wallet.country ?? "CME";
    const remaining = Math.max(0, (wallet.required_credits ?? 0) - (wallet.completed_credits ?? 0));

    events.push({
      uid: `cme-cycle-end-${wallet.id}@hayyamed.pro`,
      summary: `CME Cycle Ends â€” ${country}`,
      description: `Your ${country} CME cycle ends today. You have completed ${wallet.completed_credits ?? 0} of ${wallet.required_credits ?? 0} required credits${remaining > 0 ? ` â€” ${remaining} credits still needed` : " â€” cycle complete!"}. Track your progress at ${APP_URL}/dashboard/cme`,
      dtstart: toIcsDate(wallet.cycle_end_date),
      dtend: toIcsDate(addDays(wallet.cycle_end_date, 1)),
      dtstamp,
      url: `${APP_URL}/dashboard/cme`,
      categories: "CME Compliance",
      alarm: {
        trigger: "-P60D",
        description: `${country} CME cycle ends in 60 days. Log in to Hayya Med Pro to check your progress.`,
      },
    });

    // 90-day reminder before cycle end
    const remind90 = addDays(wallet.cycle_end_date, -90);
    if (new Date(remind90) > new Date()) {
      events.push({
        uid: `cme-90d-${wallet.id}@hayyamed.pro`,
        summary: `CME Deadline â€” 90 days left (${country})`,
        description: `Your ${country} CME cycle ends in 90 days on ${wallet.cycle_end_date}. ${remaining > 0 ? `You need ${remaining} more credits.` : "You are on track â€” keep logging activities!"} ${APP_URL}/dashboard/cme`,
        dtstart: toIcsDate(remind90),
        dtend: toIcsDate(addDays(remind90, 1)),
        dtstamp,
        url: `${APP_URL}/dashboard/cme`,
        categories: "CME Compliance",
      });
    }
  }

  if (events.length === 0) {
    // Return an empty but valid calendar
    events.push({
      uid: `cme-setup-reminder-${user.id}@hayyamed.pro`,
      summary: "Set up your CME wallet â€” Hayya Med Pro",
      description: `Complete your CME wallet setup to start tracking compliance deadlines. ${APP_URL}/onboarding/5`,
      dtstart: toIcsDate(new Date().toISOString().slice(0, 10)),
      dtend: toIcsDate(addDays(new Date().toISOString().slice(0, 10), 1)),
      dtstamp,
      url: `${APP_URL}/onboarding/5`,
      categories: "CME Compliance",
    });
  }

  const name = profile?.full_name ?? "Healthcare Professional";
  const calLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hayya Med Pro//CME Compliance//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    foldLine(`X-WR-CALNAME:Hayya Med Pro â€” ${escapeIcs(name)}`),
    "X-WR-CALDESC:CME compliance deadlines and license renewal reminders from Hayya Med Pro",
    "X-WR-TIMEZONE:Asia/Qatar",
    ...events.map(buildVEvent),
    "END:VCALENDAR",
  ];

  const ics = calLines.join("\r\n");
  const filename = `Hayya-Med-Pro-CME-Calendar.ics`;

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
