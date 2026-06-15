import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendComplianceAlertEmail } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";
import { dispatchWebhook } from "@/lib/webhooks/dispatch";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Fetch all enabled thresholds
  const { data: thresholds, error: thErr } = await admin
    .from("employer_compliance_thresholds")
    .select("organization_id, threshold_pct, alert_email")
    .eq("enabled", true);

  if (thErr || !thresholds?.length) {
    await pingCronMonitor("CRON_MONITOR_COMPLIANCE_ALERTS");
    return NextResponse.json({ checked: 0, alerts_sent: 0 });
  }

  let alertsSent = 0;

  for (const threshold of thresholds) {
    const { organization_id: orgId, threshold_pct: thresholdPct, alert_email: alertEmail } = threshold;

    // Fetch approved staff links for this org
    const { data: links } = await admin
      .from("employer_link_requests")
      .select("professional_id")
      .eq("organization_id", orgId)
      .eq("status", "approved");

    if (!links?.length) continue;

    const staffIds = links.map((l) => l.professional_id);

    // Fetch wallets + privacy settings for these staff
    const [walletsRes, profilesRes, privacyRes] = await Promise.all([
      admin
        .from("cme_wallets")
        .select("professional_id, completed_credits, required_credits")
        .in("professional_id", staffIds),
      admin
        .from("professional_profiles")
        .select("auth_id, full_name, profession")
        .in("auth_id", staffIds),
      admin
        .from("profile_privacy_settings")
        .select("professional_id, employer_can_view_cme_summary")
        .in("professional_id", staffIds),
    ]);

    const walletMap = Object.fromEntries(
      (walletsRes.data ?? []).map((w) => [w.professional_id, w])
    );
    const profileMap = Object.fromEntries(
      (profilesRes.data ?? []).map((p) => [p.auth_id, p])
    );
    const privacyMap = Object.fromEntries(
      (privacyRes.data ?? []).map((p) => [p.professional_id, p])
    );

    // Also get org name
    const { data: org } = await admin
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .maybeSingle();
    const orgName = org?.name ?? "Your Organization";

    const belowThreshold: {
      name: string;
      profession: string;
      completedCredits: number;
      requiredCredits: number;
      pct: number;
    }[] = [];

    for (const staffId of staffIds) {
      const privacy = privacyMap[staffId];
      if (privacy?.employer_can_view_cme_summary === false) continue;

      const wallet = walletMap[staffId];
      if (!wallet || !wallet.required_credits) continue;

      const pct = Math.min(
        Math.round((wallet.completed_credits / wallet.required_credits) * 100),
        100
      );

      if (pct < thresholdPct) {
        const profile = profileMap[staffId];
        belowThreshold.push({
          name: profile?.full_name ?? "Unknown",
          profession: profile?.profession ?? "—",
          completedCredits: wallet.completed_credits,
          requiredCredits: wallet.required_credits,
          pct,
        });
      }
    }

    if (belowThreshold.length > 0) {
      await sendComplianceAlertEmail({
        to: alertEmail,
        orgName,
        thresholdPct,
        belowThreshold,
      });
      alertsSent++;

      // Dispatch staff.compliance_changed per below-threshold staff member
      // Must respect the same privacy gate as the email loop above.
      for (let i = 0; i < staffIds.length; i++) {
        const staffId = staffIds[i];
        const privacy = privacyMap[staffId];
        if (privacy?.employer_can_view_cme_summary === false) continue;

        const wallet = walletMap[staffId];
        if (!wallet || !wallet.required_credits) continue;
        const pct = Math.min(
          Math.round((wallet.completed_credits / wallet.required_credits) * 100),
          100
        );
        if (pct < thresholdPct) {
          dispatchWebhook(orgId, "staff.compliance_changed", {
            professional_id: staffId,
            compliance_pct: pct,
            completed_credits: wallet.completed_credits,
            required_credits: wallet.required_credits,
            threshold_pct: thresholdPct,
          }).catch(() => {});
        }
      }
    }
  }

  await pingCronMonitor("CRON_MONITOR_COMPLIANCE_ALERTS");
  return NextResponse.json({ checked: thresholds.length, alerts_sent: alertsSent });
}
