import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { aiComplete } from "@/lib/ai/complete";
import { BROADCAST_DRAFTER_SYSTEM, buildBroadcastDraftPrompt } from "@/lib/ai/prompts/broadcast-drafter";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { z } from "zod";

const BodySchema = z.object({
  organizationId: z.string().uuid(),
  intent: z.string().min(5).max(500),
  audience: z.enum(["all", "at_risk", "non_compliant"]),
});

const DraftSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const raw = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { organizationId, intent, audience } = parsed.data;
  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai.draft_broadcast", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit reached. Try again later." }, { status: 429 });

  const [govSettingsRes, linkRes, countryRuleRes] = await Promise.all([
    admin.from("government_settings")
      .select("jurisdiction_country, authority_code")
      .eq("organization_id", organizationId)
      .maybeSingle(),
    admin.from("employer_link_requests")
      .select("professional_id")
      .eq("organization_id", organizationId)
      .eq("status", "approved"),
    admin.from("country_compliance_rules")
      .select("cycle_months, credits_required")
      .limit(1)
      .maybeSingle(),
  ]);

  const countryCode = govSettingsRes.data?.jurisdiction_country ?? "QA";
  const authorityCode = govSettingsRes.data?.authority_code ?? "AUTHORITY";
  const cycleMonths = (countryRuleRes.data as { cycle_months: number; credits_required: number } | null)?.cycle_months ?? 24;
  const creditsRequired = (countryRuleRes.data as { cycle_months: number; credits_required: number } | null)?.credits_required ?? 50;
  const approvedIds = (linkRes.data ?? []).map((r) => r.professional_id);

  let audienceCount = approvedIds.length;
  if (audience !== "all" && approvedIds.length > 0) {
    const { data: wallets } = await admin
      .from("cme_wallets")
      .select("compliance_status")
      .in("professional_id", approvedIds)
      .eq("compliance_status", audience);
    audienceCount = (wallets ?? []).length;
  }

  const prompt = buildBroadcastDraftPrompt({
    intent, audience, audienceCount, authorityCode, countryCode,
    cycleMonths, creditsRequired,
    daysUntilCycleEnd: Math.max(1, Math.round(cycleMonths * 30.44)),
  });

  const start = Date.now();

  try {
    const ai = await aiComplete({
      task: "draft",
      maxTokens: 600,
      json: true,
      system: BROADCAST_DRAFTER_SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });

    const latency = Date.now() - start;
    const raw = ai.text;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in AI response");

    const draftParsed = DraftSchema.safeParse(JSON.parse(jsonMatch[0]));
    if (!draftParsed.success) throw new Error("AI response failed validation");

    logAiCall({
      professionalId: user.id,
      model: ai.model,
      action: "draft-broadcast",
      inputTokens: ai.inputTokens,
      outputTokens: ai.outputTokens,
      latencyMs: latency,
    }).catch(() => {});

    logAudit({
      actorAuthId: user.id,
      action: "ai.draft_broadcast",
      targetTable: "organizations",
      targetId: organizationId,
      metadata: { audience, audienceCount, latencyMs: latency },
    }).catch(() => {});

    return NextResponse.json({ draft: draftParsed.data });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "AI error" }, { status: 500 });
  }
}
