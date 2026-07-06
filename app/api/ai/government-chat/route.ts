import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { aiComplete } from "@/lib/ai/complete";
import { GOVERNMENT_CHAT_SYSTEM, buildGovernmentChatContext } from "@/lib/ai/prompts/government-chat";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(4000),
});

const BodySchema = z.object({
  organizationId: z.string().uuid(),
  message: z.string().min(1).max(2000),
  history: z.array(MessageSchema).max(20).default([]),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const raw = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { organizationId, message, history } = parsed.data;
  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .in("role", ["government_admin", "government_staff"])
    .limit(1)
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai.government_chat", userId: user.id, maxPerHour: 30 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit reached. Try again later." }, { status: 429 });

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
  const authorityCode = govSettingsRes.data?.authority_code ?? "AUTHORITY";

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
  const avgCreditsCompletion = wallets.length > 0
    ? Math.round(wallets.reduce((s, w) => s + ((w.completed_credits ?? 0) / (w.required_credits ?? creditsRequired)) * 100, 0) / wallets.length)
    : 0;

  const now = Date.now();
  let expiring30 = 0, expiring60 = 0, expiring90 = 0;
  for (const p of profiles) {
    if (!p.license_expiry) continue;
    const days = Math.ceil((new Date(p.license_expiry).getTime() - now) / 86400000);
    if (days >= 0 && days <= 30) expiring30++;
    if (days >= 0 && days <= 60) expiring60++;
    if (days >= 0 && days <= 90) expiring90++;
  }

  const profMap = new Map<string, { total: number; compliant: number; atRisk: number; nonCompliant: number }>();
  for (const p of profiles) {
    const key = p.profession || "Unknown";
    if (!profMap.has(key)) profMap.set(key, { total: 0, compliant: 0, atRisk: 0, nonCompliant: 0 });
    const entry = profMap.get(key)!;
    entry.total++;
    const wallet = wallets.find((w) => w.professional_id === p.auth_id);
    if (wallet?.compliance_status === "compliant") entry.compliant++;
    else if (wallet?.compliance_status === "at_risk") entry.atRisk++;
    else if (wallet?.compliance_status === "non_compliant") entry.nonCompliant++;
  }

  const snapshots = snapshotsRes.data ?? [];
  let trend: "improving" | "declining" | "stable" | "unknown" = "unknown";
  if (snapshots.length >= 3) {
    const rates = snapshots.map((s) => s.total_staff > 0 ? (s.compliant / s.total_staff) * 100 : 0);
    const half = Math.floor(rates.length / 2);
    const first = rates.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const last = rates.slice(Math.ceil(rates.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(rates.length / 2);
    const diff = last - first;
    trend = diff > 3 ? "improving" : diff < -3 ? "declining" : "stable";
  }

  const context = buildGovernmentChatContext({
    authorityCode, countryCode, total, compliant, atRisk, nonCompliant,
    complianceRate, expiring30, expiring60, expiring90,
    cycleMonths, creditsRequired,
    daysUntilCycleEnd: Math.max(1, Math.round(cycleMonths * 30.44)),
    avgCreditsCompletion, trend,
    professionBreakdown: [...profMap.entries()].map(([profession, v]) => ({ profession, ...v })),
  });

  const systemWithContext = `${GOVERNMENT_CHAT_SYSTEM}\n\n${context}`;
  const recentHistory = history.slice(-8);

  const start = Date.now();

  try {
    const ai = await aiComplete({
      task: "government",
      maxTokens: 800,
      system: systemWithContext,
      messages: [
        ...recentHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: message },
      ],
    });

    const latency = Date.now() - start;
    const reply = ai.text;
    const inputTokens = ai.inputTokens;
    const outputTokens = ai.outputTokens;

    logAiCall({
      professionalId: user.id,
      model: ai.model,
      action: "government-chat",
      inputTokens,
      outputTokens,
      latencyMs: latency,
    }).catch(() => {});

    logAudit({
      actorAuthId: user.id,
      action: "ai.government_chat",
      targetTable: "organizations",
      targetId: organizationId,
      metadata: { model: ai.model, inputTokens, outputTokens, latencyMs: latency },
    }).catch(() => {});

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "AI error" }, { status: 500 });
  }
}
