import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { logAudit } from "@/lib/audit";
import { buildRenewalPredictionPrompt } from "@/lib/ai/prompts/renewal-prediction";

export const runtime = "nodejs";

const PredictionSchema = z.object({
  risk_level: z.enum(["on_track", "at_risk", "critical"]),
  credits_shortfall: z.number(),
  projected_completion_date: z.string().nullable(),
  required_monthly_pace: z.number(),
  insights: z.array(z.string()).min(1).max(5),
  recommendation: z.string(),
});

function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan))
    return NextResponse.json({ error: "Pro plan required" }, { status: 403 });

  const rl = await checkAndLogRateLimit({
    action: "ai_renewal_prediction",
    userId: user.id,
    maxPerHour: 5,
  });
  if (!rl.allowed)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );

  const body = await req.json();
  const { walletId } = body as { walletId: string };
  if (!walletId)
    return NextResponse.json({ error: "walletId required" }, { status: 400 });

  const admin = createAdminClient();

  const { data: wallet, error: walletError } = await admin
    .from("cme_wallets")
    .select("id, country, profession, specialty, required_credits, cycle_end_date, professional_id")
    .eq("id", walletId)
    .eq("professional_id", user.id)
    .single();

  if (walletError || !wallet)
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

  const { data: activities } = await admin
    .from("cme_activities")
    .select("credits, activity_date")
    .eq("professional_id", user.id)
    .eq("wallet_id", walletId)
    .in("verification_status", ["verified", "approved"])
    .order("activity_date");

  const completedCredits = (activities ?? []).reduce((s, a) => s + a.credits, 0);
  const required = wallet.required_credits ?? 50;

  // Compute monthly data for last 6 months
  const last6 = getLast6Months();
  const creditsByMonth: Record<string, number> = {};
  for (const a of activities ?? []) {
    const ym = a.activity_date.slice(0, 7);
    creditsByMonth[ym] = (creditsByMonth[ym] ?? 0) + a.credits;
  }
  const recentMonths = last6.map((ym) => ({ month: ym, credits: creditsByMonth[ym] ?? 0 }));

  // Average pace over active months
  const firstActivity = activities?.[0]?.activity_date;
  const monthsSinceFirst = firstActivity
    ? Math.max(1, (Date.now() - new Date(firstActivity).getTime()) / (30.4 * 86400000))
    : 1;
  const avgPerMonth = completedCredits / monthsSinceFirst;

  const daysLeft = wallet.cycle_end_date
    ? Math.max(0, Math.ceil((new Date(wallet.cycle_end_date).getTime() - Date.now()) / 86400000))
    : null;

  const prompt = buildRenewalPredictionPrompt({
    profession: wallet.profession,
    specialty: wallet.specialty ?? null,
    country: wallet.country,
    requiredCredits: required,
    completedCredits,
    avgPerMonth,
    daysLeft,
    cycleEndDate: wallet.cycle_end_date ?? null,
    recentMonths,
  });

  const startTime = Date.now();
  try {
    const client = getAnthropicClient();
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    logAudit({
      actorAuthId: user.id,
      action: "ai.renewal_prediction",
      targetTable: "cme_wallets",
      metadata: {
        wallet_id: walletId,
        model: "claude-sonnet-4-6",
        input_tokens: res.usage?.input_tokens ?? 0,
        output_tokens: res.usage?.output_tokens ?? 0,
        latency_ms: Date.now() - startTime,
      },
    }).catch(() => {});

    const text = (res.content[0] as { type: string; text: string }).text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    const validated = PredictionSchema.safeParse(JSON.parse(match[0]));
    if (!validated.success) throw new Error("Schema validation failed");

    return NextResponse.json({
      ...validated.data,
      wallet: {
        country: wallet.country,
        profession: wallet.profession,
        specialty: wallet.specialty ?? null,
        required_credits: required,
        completed_credits: completedCredits,
        avg_per_month: parseFloat(avgPerMonth.toFixed(2)),
        days_left: daysLeft,
        cycle_end_date: wallet.cycle_end_date ?? null,
      },
    });
  } catch {
    // Rule-based fallback — compliance cannot depend on AI uptime
    const remaining = Math.max(0, required - completedCredits);
    const monthsLeft = daysLeft !== null ? daysLeft / 30.4 : null;
    const requiredPace = monthsLeft && monthsLeft > 0 && remaining > 0 ? remaining / monthsLeft : 0;
    const onTrack = avgPerMonth >= requiredPace && remaining > 0;

    return NextResponse.json({
      risk_level: remaining === 0 ? "on_track" : onTrack ? "on_track" : daysLeft !== null && daysLeft < 30 ? "critical" : "at_risk",
      credits_shortfall: Math.max(0, remaining - (avgPerMonth * (monthsLeft ?? 0))),
      projected_completion_date: null,
      required_monthly_pace: parseFloat(requiredPace.toFixed(2)),
      insights: [
        `You have completed ${completedCredits} of ${required} required credits (${Math.round((completedCredits / required) * 100)}%).`,
        remaining > 0
          ? `You need ${remaining} more credits${daysLeft !== null ? ` in ${daysLeft} days` : ""}.`
          : "You have met your credit requirement.",
      ],
      recommendation:
        remaining === 0
          ? "You are fully compliant. Maintain your pace for the next renewal cycle."
          : `Log ${Math.ceil(requiredPace)} credits per month to meet your renewal deadline.`,
      wallet: {
        country: wallet.country,
        profession: wallet.profession,
        specialty: wallet.specialty ?? null,
        required_credits: required,
        completed_credits: completedCredits,
        avg_per_month: parseFloat(avgPerMonth.toFixed(2)),
        days_left: daysLeft,
        cycle_end_date: wallet.cycle_end_date ?? null,
      },
      _fallback: true,
    });
  }
}
