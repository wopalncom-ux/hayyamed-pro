import { createAdminClient } from "@/lib/supabase/server";

export interface BadgeDefinition {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: "first_activity",
    title: "First Step",
    description: "Logged your first CME activity",
    icon: "🌱",
    color: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
  },
  {
    key: "ten_credits",
    title: "10 Credits",
    description: "Earned 10 or more CME credits",
    icon: "⚡",
    color: "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  },
  {
    key: "twentyfive_credits",
    title: "25 Credits",
    description: "Earned 25 or more CME credits",
    icon: "🎯",
    color: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
  },
  {
    key: "fifty_credits",
    title: "50 Credits",
    description: "Earned 50 or more CME credits",
    icon: "🏆",
    color: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]",
  },
  {
    key: "first_certificate",
    title: "Certified",
    description: "Uploaded your first CME certificate",
    icon: "📜",
    color: "bg-[#fdf4ff] text-[#7e22ce] border-[#e9d5ff]",
  },
  {
    key: "compliant",
    title: "Fully Compliant",
    description: "Reached 100% compliance for the first time",
    icon: "✅",
    color: "bg-[#f0fdf4] text-[#15803d] border-[#86efac]",
  },
  {
    key: "streak_4",
    title: "4-Week Streak",
    description: "Logged CME activities for 4 consecutive weeks",
    icon: "🔥",
    color: "bg-[#fff7ed] text-[#d97706] border-[#fde68a]",
  },
  {
    key: "first_reflection",
    title: "Reflective Practitioner",
    description: "Written your first CPD reflection",
    icon: "📝",
    color: "bg-[#eff6ff] text-[#1d4ed8] border-[#93c5fd]",
  },
  {
    key: "portfolio_generated",
    title: "Portfolio Ready",
    description: "Generated your CPD revalidation portfolio",
    icon: "📋",
    color: "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]",
  },
  {
    key: "hundred_credits",
    title: "Century",
    description: "Earned 100 or more CME credits",
    icon: "💯",
    color: "bg-[#fef9c3] text-[#92400e] border-[#fde68a]",
  },
];

export const BADGE_MAP = Object.fromEntries(
  BADGE_DEFINITIONS.map((b) => [b.key, b])
);

export async function checkAndAwardBadges(professionalId: string): Promise<void> {
  const admin = createAdminClient();

  // Fetch already-earned badge keys
  const { data: earned } = await admin
    .from("professional_achievements")
    .select("badge_key")
    .eq("professional_id", professionalId);

  const earnedSet = new Set((earned ?? []).map((r) => r.badge_key));

  // Fetch data needed for evaluation in parallel
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

  // Compute aggregate data
  const totalCredits = activities.reduce((sum, a) => sum + (a.credits ?? 0), 0);
  const hasCertificate = activities.some((a) => a.certificate_url);

  // Streak: weeks with at least 1 activity
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

  // Determine which badges to award
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
