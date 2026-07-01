import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { aiComplete } from "@/lib/ai/complete";
import { GOVERNMENT_FORECASTER_SYSTEM, buildGovernmentForecastPrompt } from "@/lib/ai/prompts/government-forecaster";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { z } from "zod";

const ForecastSchema = z.object({
  headline: z.string().max(300),
  risk_level: z.enum(["low", "medium", "high", "critical"]),
  projected_compliance_rate: z.number().int().min(0).max(100),
  professionals_at_risk: z.number().int().min(0),
  key_insights: z.array(z.string().max(200)).min(1).max(6),
  recommended_actions: z.array(z.string().max(200)).min(1).max(5),
  confidence: z.enum(["low", "medium", "high"]),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { organizationId } = body;
  if (!organizationId) return NextResponse.json({ error: "organizationId required" }, { status: 400 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai.government_forecast", userId: user.id, maxPerHour: 5 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit reached. Try again later." }, { status: 429 });

  // Fetch data (anonymised — no names, no license numbers)
  const [linkRes, govSettingsRes, snapshotsRes] = await Promise.all([
    admin.from("employer_link_requests")
      .select("professional_id")
      .eq("organization_id", organizationId)
      .eq("status", "approved"),
    admin.from("government_settings")
      .select("jurisdiction_country, authority_code")
      .eq("organization_id", organizationId)
      .maybeSingle(),
    admin.from("organization_compliance_snapshots")
      .select("snapshot_date, total_staff, compliant, at_risk, non_compliant")
      .eq("organization_id", organizationId)
      .order("snapshot_date", { ascending: true })
      .limit(14),
  ]);

  const approvedIds = (linkRes.data ?? []).map((r) => r.professional_id);
  const countryCode = govSettingsRes.data?.jurisdiction_country ?? "QA";

  const [walletsRes, profilesRes, countryRuleRes] = await Promise.all([
    approvedIds.length
      ? admin.from("cme_wallets")
          .select("professional_id, completed_credits, required_credits, compliance_status")
          .in("professional_id", approvedIds)
      : Promise.resolve({ data: [] }),
    approvedIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, profession, license_expiry")
          .in("auth_id", approvedIds)
      : Promise.resolve({ data: [] }),
    admin.from("country_compliance_rules")
      .select("cycle_months, credits_required")
      .eq("country_code", countryCode)
      .limit(1)
      .maybeSingle(),
  ]);

  const wallets = walletsRes.data ?? [];
  const profiles = profilesRes.data ?? [];
  const cycleMonths = (countryRuleRes.data as { cycle_months: number; credits_required: number } | null)?.cycle_months ?? 24;
  const creditsRequired = (countryRuleRes.data as { cycle_months: number; credits_required: number } | null)?.credits_required ?? 50;

  const total = approvedIds.length;
  const compliant = wallets.filter((w) => w.compliance_status === "compliant").length;
  const atRisk = wallets.filter((w) => w.compliance_status === "at_risk").length;
  const nonCompliant = wallets.filter((w) => w.compliance_status === "non_compliant").length;
  const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

  const now = Date.now();
  const expiringSoon = profiles.filter((p) => {
    if (!p.license_expiry) return false;
    const days = Math.ceil((new Date(p.license_expiry).getTime() - now) / 86400000);
    return days >= 0 && days <= 30;
  }).length;

  const avgCreditsCompletion = wallets.length > 0
    ? Math.round(wallets.reduce((sum, w) => sum + ((w.completed_credits ?? 0) / (w.required_credits ?? creditsRequired)) * 100, 0) / wallets.length)
    : 0;

  // Profession breakdown (count only)
  const profMap = new Map<string, { total: number; compliant: number }>();
  for (const p of profiles) {
    const key = p.profession || "Unknown";
    if (!profMap.has(key)) profMap.set(key, { total: 0, compliant: 0 });
    const entry = profMap.get(key)!;
    entry.total++;
    const wallet = wallets.find((w) => w.professional_id === p.auth_id);
    if (wallet?.compliance_status === "compliant") entry.compliant++;
  }

  // Trend from snapshots
  const snapshots = snapshotsRes.data ?? [];
  let trend: "improving" | "declining" | "stable" | "unknown" = "unknown";
  if (snapshots.length >= 3) {
    const rates = snapshots.map((s) => (s.total_staff > 0 ? (s.compliant / s.total_staff) * 100 : 0));
    const first = rates.slice(0, Math.floor(rates.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(rates.length / 2);
    const last = rates.slice(Math.ceil(rates.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(rates.length / 2);
    const diff = last - first;
    trend = diff > 3 ? "improving" : diff < -3 ? "declining" : "stable";
  }

  const daysUntilCycleEnd = Math.round(cycleMonths * 30.44);

  const prompt = buildGovernmentForecastPrompt({
    total,
    compliant,
    atRisk,
    nonCompliant,
    expiringSoon,
    complianceRate,
    countryCode,
    cycleMonths,
    daysUntilCycleEnd: Math.max(1, daysUntilCycleEnd),
    creditsRequired,
    professionBreakdown: [...profMap.entries()].map(([profession, v]) => ({ profession, ...v })),
    trend,
    avgCreditsCompletion,
  });

  const start = Date.now();

  try {
    const ai = await aiComplete({
      task: "forecast",
      maxTokens: 600,
      json: true,
      system: GOVERNMENT_FORECASTER_SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });

    const latency = Date.now() - start;
    const raw = ai.text;
    const inputTokens = ai.inputTokens;
    const outputTokens = ai.outputTokens;

    // Extract JSON
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in AI response");

    const parsed = ForecastSchema.safeParse(JSON.parse(jsonMatch[0]));
    if (!parsed.success) throw new Error("AI response failed validation");

    logAiCall({
      professionalId: user.id,
      model: ai.model,
      action: "government-forecast",
      inputTokens,
      outputTokens,
      latencyMs: latency,
    }).catch(() => {});

    logAudit({
      actorAuthId: user.id,
      action: "ai.government_forecast",
      targetTable: "organizations",
      targetId: organizationId,
      metadata: { model: ai.model, inputTokens, outputTokens, latencyMs: latency },
    }).catch(() => {});

    return NextResponse.json({ forecast: parsed.data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "AI error" }, { status: 500 });
  }
}
