import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendTrialDay3Email,
  sendTrialDay7Email,
  sendTrialEndingSoonEmail,
  sendTrialExpiredEmail,
} from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

// Runs daily — handles all 4 trial touchpoints:
//   Day  3: activation nudge (sent if user has 0 CME activities)
//   Day  7: midpoint summary with compliance snapshot (sent if not yet upgraded)
//   Day 11: 3-day warning — "your trial ends in 3 days"
//   Day 14: trial expired (sent if no active subscription)

function dayWindow(now: Date, daysFromNow: number): { start: string; end: string } {
  const d = new Date(now);
  d.setDate(d.getDate() + daysFromNow);
  const base = d.toISOString().slice(0, 10);
  return { start: `${base}T00:00:00.000Z`, end: `${base}T23:59:59.999Z` };
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();

  // Day 3 nudge fires when 3 days have elapsed since trial start.
  // 14-day trial: trial ends in 11 days.  30-day trial: trial ends in 27 days.
  const day3Window14 = dayWindow(now, 11); // 14-day trial users
  const day3Window30 = dayWindow(now, 27); // 30-day trial users (referred)

  // Day 7 midpoint fires when 7 days have elapsed.
  // 14-day trial: trial ends in 7 days.  30-day trial: trial ends in 23 days.
  const day7Window14 = dayWindow(now, 7);  // 14-day trial users
  const day7Window30 = dayWindow(now, 23); // 30-day trial users (referred)

  // 3-day warning is relative to remaining time — applies to all trial lengths.
  const warnWindow   = dayWindow(now, 3);

  // Trial expired in last 48 hours
  const expiredAfter = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  const [day3Res14, day3Res30, day7Res14, day7Res30, warnRes, expiredRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, pro_trial_ends_at")
      .gte("pro_trial_ends_at", day3Window14.start)
      .lte("pro_trial_ends_at", day3Window14.end)
      .not("email", "is", null)
      .eq("email_trial_reminders", true),
    admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, pro_trial_ends_at")
      .gte("pro_trial_ends_at", day3Window30.start)
      .lte("pro_trial_ends_at", day3Window30.end)
      .not("email", "is", null)
      .eq("email_trial_reminders", true),
    admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, pro_trial_ends_at")
      .gte("pro_trial_ends_at", day7Window14.start)
      .lte("pro_trial_ends_at", day7Window14.end)
      .not("email", "is", null)
      .eq("email_trial_reminders", true),
    admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, pro_trial_ends_at")
      .gte("pro_trial_ends_at", day7Window30.start)
      .lte("pro_trial_ends_at", day7Window30.end)
      .not("email", "is", null)
      .eq("email_trial_reminders", true),
    admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, pro_trial_ends_at")
      .gte("pro_trial_ends_at", warnWindow.start)
      .lte("pro_trial_ends_at", warnWindow.end)
      .not("email", "is", null)
      .eq("email_trial_reminders", true),
    admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, pro_trial_ends_at")
      .lt("pro_trial_ends_at", now.toISOString())
      .gte("pro_trial_ends_at", expiredAfter)
      .not("email", "is", null)
      .eq("email_trial_reminders", true),
  ]);

  let day3Sent = 0;
  let day7Sent = 0;
  let warnSent = 0;
  let expiredSent = 0;

  // Merge 14-day and 30-day windows, deduplicate by auth_id
  function mergeProfiles(
    a: typeof day3Res14.data,
    b: typeof day3Res30.data
  ) {
    const seen = new Set<string>();
    const out: NonNullable<typeof a> = [];
    for (const p of [...(a ?? []), ...(b ?? [])]) {
      if (p.auth_id && !seen.has(p.auth_id)) { seen.add(p.auth_id); out.push(p); }
    }
    return out;
  }

  // ── Day 3: activation nudge — only sent if user has 0 CME activities ──────
  const day3Profiles = mergeProfiles(day3Res14.data, day3Res30.data);
  if (day3Profiles.length > 0) {
    const ids = day3Profiles.map((p) => p.auth_id).filter(Boolean) as string[];
    const { data: activityRows } = await admin
      .from("cme_activities")
      .select("professional_id")
      .in("professional_id", ids);
    const hasActivitySet = new Set((activityRows ?? []).map((a) => a.professional_id));

    for (const p of day3Profiles) {
      if (!p.email || !p.pro_trial_ends_at) continue;
      if (hasActivitySet.has(p.auth_id)) continue; // already active — skip
      try {
        await sendTrialDay3Email({
          to: p.email,
          name: p.full_name ?? p.email.split("@")[0],
          trialEndsAt: p.pro_trial_ends_at,
        });
        day3Sent++;
      } catch { /* never let a single failure abort the batch */ }
    }
  }

  // ── Day 7: midpoint summary — only sent if user has no active subscription ─
  const day7Profiles = mergeProfiles(day7Res14.data, day7Res30.data);
  if (day7Profiles.length > 0) {
    const ids = day7Profiles.map((p) => p.auth_id).filter(Boolean) as string[];
    const [subsRes, walletsRes] = await Promise.all([
      admin
        .from("subscriptions")
        .select("professional_id")
        .in("professional_id", ids)
        .in("status", ["active", "trialing"]),
      admin
        .from("cme_wallets")
        .select("professional_id, completed_credits, required_credits")
        .in("professional_id", ids)
        .order("created_at", { ascending: true }),
    ]);
    const paidSet = new Set((subsRes.data ?? []).map((s) => s.professional_id));
    // First wallet per professional
    const walletMap: Record<string, { completed_credits: number; required_credits: number }> = {};
    for (const w of walletsRes.data ?? []) {
      if (!walletMap[w.professional_id]) walletMap[w.professional_id] = w;
    }

    for (const p of day7Profiles) {
      if (!p.email || !p.pro_trial_ends_at) continue;
      if (paidSet.has(p.auth_id)) continue; // already paid — skip
      const wallet = walletMap[p.auth_id];
      try {
        await sendTrialDay7Email({
          to: p.email,
          name: p.full_name ?? p.email.split("@")[0],
          completed: wallet?.completed_credits ?? 0,
          required: wallet?.required_credits ?? 50,
          trialEndsAt: p.pro_trial_ends_at,
        });
        day7Sent++;
      } catch { /* never let a single failure abort the batch */ }
    }
  }

  // ── Day 11: 3-day warning ─────────────────────────────────────────────────
  for (const p of warnRes.data ?? []) {
    if (!p.email || !p.pro_trial_ends_at) continue;
    const daysLeft = Math.max(1, Math.ceil((new Date(p.pro_trial_ends_at).getTime() - now.getTime()) / 86400000));
    try {
      await sendTrialEndingSoonEmail({
        to: p.email,
        name: p.full_name ?? p.email.split("@")[0],
        daysLeft,
        trialEndsAt: p.pro_trial_ends_at,
        authId: p.auth_id ?? undefined,
      });
      warnSent++;
    } catch { /* never let a single failure abort the batch */ }
  }

  // ── Day 14+: expired — skip users who upgraded ───────────────────────────
  const expiredProfiles = expiredRes.data ?? [];
  if (expiredProfiles.length > 0) {
    const expiredIds = expiredProfiles.map((p) => p.auth_id).filter(Boolean) as string[];
    const { data: activeSubs } = await admin
      .from("subscriptions")
      .select("professional_id")
      .in("professional_id", expiredIds)
      .in("status", ["active", "trialing"]);
    const paidSet = new Set((activeSubs ?? []).map((s) => s.professional_id));

    for (const p of expiredProfiles) {
      if (!p.email || paidSet.has(p.auth_id)) continue;
      try {
        await sendTrialExpiredEmail({ to: p.email, name: p.full_name ?? p.email.split("@")[0], authId: p.auth_id ?? undefined });
        expiredSent++;
      } catch { /* never let a single failure abort the batch */ }
    }
  }

  await pingCronMonitor("trial-reminders");
  return NextResponse.json({ ok: true, day3_sent: day3Sent, day7_sent: day7Sent, warn_sent: warnSent, expired_sent: expiredSent });
}
