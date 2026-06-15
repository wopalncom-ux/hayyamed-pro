import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { awardPortfolioBadge } from "@/lib/badges";
import { getUserPlan, isPro } from "@/lib/subscription";
import { renderToBuffer } from "@react-pdf/renderer";
import { CpdPortfolioDocument } from "@/components/pdf/CpdPortfolioDocument";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import React from "react";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "pdf_cpd_portfolio", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const admin = createAdminClient();
  const [profileRes, walletRes, activitiesRes, reflectionsRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, license_number, licensing_authority, license_expiry, country_of_residence")
      .eq("auth_id", user.id)
      .single(),
    admin
      .from("cme_wallets")
      .select("id, country, profession, required_credits, completed_credits, compliance_status, cycle_start_date, cycle_end_date")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    admin
      .from("cme_activities")
      .select("id, title, provider, activity_date, credits, category, verification_status")
      .eq("professional_id", user.id)
      .eq("verification_status", "verified")
      .order("activity_date", { ascending: false }),
    admin
      .from("cpd_reflections")
      .select(`
        id, reflection_date, reflection_type, what_learned,
        how_applied, impact_on_practice, further_learning,
        cme_activities(title)
      `)
      .eq("professional_id", user.id)
      .order("reflection_date", { ascending: false }),
  ]);

  const reflections = (reflectionsRes.data ?? []).map((r) => ({
    id: r.id,
    reflection_date: r.reflection_date,
    reflection_type: r.reflection_type,
    what_learned: r.what_learned,
    how_applied: r.how_applied ?? null,
    impact_on_practice: r.impact_on_practice ?? null,
    further_learning: r.further_learning ?? null,
    linked_activity_title: r.cme_activities
      ? (Array.isArray(r.cme_activities)
          ? (r.cme_activities[0] as { title: string } | null)?.title
          : (r.cme_activities as { title: string } | null)?.title) ?? null
      : null,
  }));

  const generatedAt = new Date().toISOString();

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(CpdPortfolioDocument, {
      profile: profileRes.data ?? {},
      wallet: walletRes.data ?? {},
      reflections,
      activities: (activitiesRes.data ?? []) as Record<string, unknown>[],
      generatedAt,
    }) as any
  );

  logAudit({
    actorAuthId: user.id,
    action: "pdf.cpd_portfolio_downloaded",
    targetTable: "cpd_reflections",
    metadata: {
      reflection_count: reflections.length,
      activity_count: activitiesRes.data?.length ?? 0,
    },
  }).catch(() => {});

  awardPortfolioBadge(user.id).catch(() => {});

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="CPD-Portfolio-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
