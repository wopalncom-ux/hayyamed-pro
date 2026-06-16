import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendCycleRenewedEmail } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

function addYears(dateStr: string, years: number): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  // Find all wallets with expired cycles
  const { data: expiredWallets } = await admin
    .from("cme_wallets")
    .select("id, professional_id, country, profession, specialty, required_credits, renewal_cycle_years, cycle_start_date, cycle_end_date, compliance_status")
    .lte("cycle_end_date", today);

  if (!expiredWallets?.length) {
    await pingCronMonitor("cycle-renewal");
    return NextResponse.json({ ok: true, renewed: 0, date: today });
  }

  // Batch-fetch profiles for notifications
  const professionalIds = [...new Set(expiredWallets.map((w) => w.professional_id))];
  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, email, full_name, email_cme_deadline")
    .in("auth_id", professionalIds);

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.auth_id, p]));

  // Fetch country rules for terminology lookup (batch by unique country codes)
  const { data: allRules } = await admin
    .from("country_compliance_rules")
    .select("country_code, credit_terminology")
    .in("country_code", [...new Set(expiredWallets.map((w) => w.country))])
    .eq("profession_code", "all");

  const terminologyMap = Object.fromEntries((allRules ?? []).map((r) => [r.country_code, r.credit_terminology]));

  let renewed = 0;

  for (const wallet of expiredWallets) {
    const cycleYears = wallet.renewal_cycle_years ?? 1;

    // Advance cycle forward until cycle_end_date > today (handles multi-year backlogs)
    let newStart = wallet.cycle_end_date;
    let newEnd = addYears(newStart, cycleYears);
    while (newEnd <= today) {
      newStart = newEnd;
      newEnd = addYears(newStart, cycleYears);
    }

    // Compute credits already earned within the new cycle window
    const { data: newCycleActivities } = await admin
      .from("cme_activities")
      .select("credits")
      .eq("wallet_id", wallet.id)
      .eq("verification_status", "verified")
      .gte("activity_date", newStart);

    const newCredits = (newCycleActivities ?? []).reduce((sum, a) => sum + Number(a.credits), 0);

    // Update wallet — compliance_status trigger fires automatically
    const { error } = await admin
      .from("cme_wallets")
      .update({
        cycle_start_date: newStart,
        cycle_end_date: newEnd,
        completed_credits: newCredits,
      })
      .eq("id", wallet.id);

    if (error) continue;

    renewed++;

    logAudit({
      actorAuthId: wallet.professional_id,
      action: "cme_wallet.cycle_renewed",
      targetTable: "cme_wallets",
      targetId: wallet.id,
      metadata: {
        old_cycle_end: wallet.cycle_end_date,
        new_cycle_start: newStart,
        new_cycle_end: newEnd,
        country: wallet.country,
        profession: wallet.profession,
        credits_carried_forward: newCredits,
      },
    }).catch(() => {});

    // Notification — skip if email preference is off or email missing
    const profile = profileMap[wallet.professional_id];
    if (!profile?.email || profile.email_cme_deadline === false) continue;

    const terminology = terminologyMap[wallet.country] ?? "CME";

    sendCycleRenewedEmail({
      to: profile.email,
      name: profile.full_name ?? "Healthcare Professional",
      country: wallet.country,
      profession: wallet.profession,
      newCycleStart: newStart,
      newCycleEnd: newEnd,
      requiredCredits: wallet.required_credits,
      terminology,
    }).catch(() => {});
  }

  await pingCronMonitor("cycle-renewal", { sent: renewed, processed: expiredWallets.length });
  return NextResponse.json({ ok: true, renewed, checked: expiredWallets.length, date: today });
}
