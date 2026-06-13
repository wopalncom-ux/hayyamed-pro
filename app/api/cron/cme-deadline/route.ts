import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push";
import { sendCmeDeadlineEmail } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date();

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

    // Batch-fetch email preferences and paid status for all professionals in this batch
    // Requires migration 022: email_cme_deadline column with DEFAULT true
    const professionalIds = wallets.map((w) => w.professional_id);
    const [prefRes, subRes] = await Promise.all([
      admin
        .from("professional_profiles")
        .select("auth_id, email, full_name, email_cme_deadline, pro_trial_ends_at")
        .in("auth_id", professionalIds),
      admin
        .from("subscriptions")
        .select("professional_id, plan, status")
        .in("professional_id", professionalIds),
    ]);
    const prefMap = Object.fromEntries(
      (prefRes.data ?? []).map((p) => [p.auth_id, p])
    );
    const subMap = Object.fromEntries(
      (subRes.data ?? []).map((s) => [s.professional_id, s])
    );

    for (const wallet of wallets) {
      const deficit = wallet.required_credits - wallet.completed_credits;
      if (deficit <= 0) continue;

      const profileData = prefMap[wallet.professional_id];
      const wantEmail = profileData?.email_cme_deadline !== false;
      const sub = subMap[wallet.professional_id];

      // Check Pro access (paid subscription or active trial)
      const hasPaidSub = sub &&
        (sub.plan === "pro" || sub.plan === "employer") &&
        (sub.status === "active" || sub.status === "trialing");

      const isOnTrial = profileData?.pro_trial_ends_at
        ? new Date(profileData.pro_trial_ends_at) > new Date()
        : false;
      const hasProAccess = hasPaidSub || isOnTrial;

      if (hasProAccess && wantEmail && profileData?.email) {
        await sendCmeDeadlineEmail({
          to: profileData.email,
          name: profileData.full_name ?? "Professional",
          daysLeft: days,
          creditsNeeded: deficit,
          cycleEndDate: wallet.cycle_end_date,
          authId: profileData.auth_id,
        });
      }

      // Push notification for all users with a subscription
      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("professional_id", wallet.professional_id);

      for (const pushSub of subs ?? []) {
        const result = await sendPushNotification(pushSub, {
          title: `CME Deadline in ${days} Days`,
          body: `You need ${deficit} more credits before your cycle ends on ${wallet.cycle_end_date}.`,
          url: "/dashboard/cme",
        });
        if (result.expired) {
          await admin.from("push_subscriptions").delete()
            .eq("professional_id", wallet.professional_id).eq("endpoint", pushSub.endpoint);
        }
      }

      notified++;
    }
  }

  await pingCronMonitor("cme-deadline");
  return NextResponse.json({ ok: true, notified });
}
