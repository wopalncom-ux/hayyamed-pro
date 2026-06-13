import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendOnboardingReminderEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

// Runs daily — sends one re-engagement email to users who started onboarding
// but never completed it. Targets the 48h–7 day window:
//   - < 48h: too soon — user may still be in the middle of setup
//   - > 7 days: genuine abandoner who chose not to continue (stop nudging)
//
// Dedup via audit_logs: action="onboarding_reminder.sent" — ensures exactly
// one reminder per user regardless of cron run frequency.

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();

  const windowStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
  const windowEnd   = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();     // 48 hours ago

  const { data: profiles, error } = await admin
    .from("professional_profiles")
    .select("auth_id, email, full_name, onboarding_step")
    .eq("onboarding_complete", false)
    .gt("onboarding_step", 0)  // step > 0 means they confirmed email and started the flow
    .gte("created_at", windowStart)
    .lte("created_at", windowEnd);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!profiles?.length) {
    await pingCronMonitor("onboarding-reminder");
    return NextResponse.json({ sent: 0, message: "No incomplete profiles in window" });
  }

  const ids = profiles.map((p) => p.auth_id).filter(Boolean) as string[];

  // Dedup: skip profiles that have already received this reminder
  const { data: alreadySent } = await admin
    .from("audit_logs")
    .select("actor_auth_id")
    .eq("action", "onboarding_reminder.sent")
    .in("actor_auth_id", ids);

  const alreadySentSet = new Set((alreadySent ?? []).map((l) => l.actor_auth_id as string));

  let sent = 0;

  for (const profile of profiles) {
    if (alreadySentSet.has(profile.auth_id)) continue;

    const email = profile.email;
    if (!email) continue;

    const step = Math.max(1, profile.onboarding_step ?? 1);

    try {
      await sendOnboardingReminderEmail({
        to: email,
        name: profile.full_name ?? email.split("@")[0],
        step,
      });

      await logAudit({
        actorAuthId: profile.auth_id,
        action: "onboarding_reminder.sent",
        targetTable: "professional_profiles",
        targetId: profile.auth_id,
        metadata: { step, email },
      });

      sent++;
    } catch { /* never abort the batch on individual email failure */ }
  }

  await pingCronMonitor("onboarding-reminder");
  return NextResponse.json({ sent, total: profiles.length });
}
