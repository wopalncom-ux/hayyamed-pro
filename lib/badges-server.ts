import { createAdminClient } from "@/lib/supabase/server";

export async function checkAndAwardBadges(professionalId: string): Promise<void> {
  const admin = createAdminClient();

  const { data: earned } = await admin
    .from("professional_achievements")
    .select("badge_key")
    .eq("professional_id", professionalId);

  const earnedSet = new Set((earned ?? []).map((r) => r.badge_key));

  const [activitiesRes, walletRes, reflectionsRes] = await Promise.all([
    admin
      .from("cme_activities")
      .select("credits, certificate_url, activity_date, verification_status")
      .eq("professional_id", professionalId)
      .neq("verification_status", "rejected"),
    admin
      .from("cme_wallets")
      .select("completed_credits, compliance_status")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    admin
      .from("cpd_reflections")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", professionalId),
  ]);

  const activities = activitiesRes.data ?? [];
  const wallet = walletRes.data;
  const reflectionCount = reflectionsRes.count ?? 0;

  const totalCredits = activities.reduce((sum, a) => sum + (a.credits ?? 0), 0);
  const hasCertificate = activities.some((a) => a.certificate_url);

  const MS_WEEK = 7 * 86400000;
  const weekSet = new Set(
    activities
      .filter((a) => a.activity_date)
      .map((a) => Math.floor(new Date(a.activity_date).getTime() / MS_WEEK))
  );
  let maxStreak = 0;
  if (weekSet.size > 0) {
    const weeks = [...weekSet].sort((a, b) => a - b);
    let run = 1;
    for (let i = 1; i < weeks.length; i++) {
      if (weeks[i] === weeks[i - 1] + 1) {
        run++;
        if (run > maxStreak) maxStreak = run;
      } else {
        run = 1;
      }
    }
    if (maxStreak === 0) maxStreak = 1;
  }

  const toAward: string[] = [];
  if (!earnedSet.has("first_activity") && activities.length >= 1) toAward.push("first_activity");
  if (!earnedSet.has("ten_credits") && totalCredits >= 10) toAward.push("ten_credits");
  if (!earnedSet.has("twentyfive_credits") && totalCredits >= 25) toAward.push("twentyfive_credits");
  if (!earnedSet.has("fifty_credits") && totalCredits >= 50) toAward.push("fifty_credits");
  if (!earnedSet.has("hundred_credits") && totalCredits >= 100) toAward.push("hundred_credits");
  if (!earnedSet.has("first_certificate") && hasCertificate) toAward.push("first_certificate");
  if (!earnedSet.has("compliant") && wallet?.compliance_status === "compliant") toAward.push("compliant");
  if (!earnedSet.has("streak_4") && maxStreak >= 4) toAward.push("streak_4");
  if (!earnedSet.has("first_reflection") && reflectionCount >= 1) toAward.push("first_reflection");

  if (toAward.length === 0) return;

  await admin.from("professional_achievements").upsert(
    toAward.map((key) => ({ professional_id: professionalId, badge_key: key })),
    { onConflict: "professional_id,badge_key", ignoreDuplicates: true }
  );
}

export async function awardPortfolioBadge(professionalId: string): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("professional_achievements")
    .upsert(
      { professional_id: professionalId, badge_key: "portfolio_generated" },
      { onConflict: "professional_id,badge_key", ignoreDuplicates: true }
    );
}
