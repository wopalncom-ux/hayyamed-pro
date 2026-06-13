import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendProfessionalWeeklyDigestEmail } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";

export const runtime = "nodejs";

// Runs every Monday — re-engage professionals with their weekly compliance snapshot.
// Sent to all professionals with at least one CME wallet.
// Skips opted-out users (email_cme_deadline = false reuses the same flag).

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch all wallets with professional IDs
  const { data: wallets, error: walletsError } = await admin
    .from("cme_wallets")
    .select("id, professional_id, completed_credits, required_credits, compliance_status, cycle_end_date, country")
    .not("professional_id", "is", null);

  if (walletsError || !wallets?.length) {
    await pingCronMonitor("professional-digest");
    return NextResponse.json({ sent: 0, message: "No wallets found" });
  }

  // Deduplicate — keep first wallet per professional (primary wallet)
  const seenProfIds = new Set<string>();
  const primaryWallets = wallets.filter((w) => {
    if (seenProfIds.has(w.professional_id)) return false;
    seenProfIds.add(w.professional_id);
    return true;
  });

  const profIds = primaryWallets.map((w) => w.professional_id);

  // Batch-fetch profiles, subscriptions, and recent activity dates
  const [profilesRes, subsRes, activitiesRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("auth_id, email, full_name, email_cme_deadline, pro_trial_ends_at")
      .in("auth_id", profIds),
    admin
      .from("subscriptions")
      .select("professional_id, plan, status")
      .in("professional_id", profIds),
    admin
      .from("cme_activities")
      .select("professional_id, activity_date")
      .in("professional_id", profIds)
      .neq("verification_status", "rejected")
      .order("activity_date", { ascending: false }),
  ]);

  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.auth_id, p])
  );
  const subMap = Object.fromEntries(
    (subsRes.data ?? []).map((s) => [s.professional_id, s])
  );

  // Latest activity date per professional
  const latestActivityMap: Record<string, string> = {};
  // Activity count per professional (for free tier remaining)
  const activityCountMap: Record<string, number> = {};
  for (const a of activitiesRes.data ?? []) {
    activityCountMap[a.professional_id] = (activityCountMap[a.professional_id] ?? 0) + 1;
    if (!latestActivityMap[a.professional_id]) {
      latestActivityMap[a.professional_id] = a.activity_date;
    }
  }

  let sent = 0;
  let skipped = 0;

  for (const wallet of primaryWallets) {
    const profile = profileMap[wallet.professional_id];
    if (!profile) { skipped++; continue; }

    // Respect opt-out
    if (profile.email_cme_deadline === false) { skipped++; continue; }

    const email = profile.email;
    if (!email) { skipped++; continue; }

    const name = profile.full_name ?? email.split("@")[0];

    // Determine plan
    const sub = subMap[wallet.professional_id];
    const hasPaidPro = sub &&
      (sub.plan === "pro" || sub.plan === "employer") &&
      (sub.status === "active" || sub.status === "trialing");
    const isOnTrial = profile.pro_trial_ends_at
      ? new Date(profile.pro_trial_ends_at) > new Date()
      : false;
    const isProUser = hasPaidPro || isOnTrial;

    // Activity stats
    const actCount = activityCountMap[wallet.professional_id] ?? 0;
    const lastActivityDate = latestActivityMap[wallet.professional_id] ?? null;
    const daysSinceActivity = lastActivityDate
      ? Math.floor((Date.now() - new Date(lastActivityDate).getTime()) / 86400000)
      : null;
    const remainingFreeActivities = Math.max(0, FREE_ACTIVITY_LIMIT - actCount);

    try {
      await sendProfessionalWeeklyDigestEmail({
        to: email,
        name,
        completed: wallet.completed_credits ?? 0,
        required: wallet.required_credits ?? 50,
        complianceStatus: wallet.compliance_status ?? "non_compliant",
        cycleEndDate: wallet.cycle_end_date ?? null,
        lastActivityDate,
        daysSinceActivity,
        isPro: isProUser,
        remainingFreeActivities,
        country: wallet.country ?? "Qatar",
      });
      sent++;
    } catch {
      skipped++;
    }
  }

  await pingCronMonitor("professional-digest");
  return NextResponse.json({ ok: true, sent, skipped });
}
