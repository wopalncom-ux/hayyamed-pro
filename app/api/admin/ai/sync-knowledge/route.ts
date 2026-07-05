import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createAdminClient } from "@/lib/supabase/server";
import { seedComplianceRules } from "@/lib/ai/rag/seed-rules";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";
// Seeding can take a few minutes for large rule sets
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Master admin only
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("role")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (!profile || !["founder", "master_admin", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = body.dry_run === true;

  await logAudit({
    actorAuthId: user.id,
    action: "admin.ai.sync_knowledge",
    targetTable: "knowledge_chunks",
    metadata: { dry_run: dryRun },
  });

  if (dryRun) {
    const { count } = await admin.from("knowledge_chunks").select("*", { count: "exact", head: true });
    const { data: rules } = await admin.from("country_compliance_rules").select("country_code", { count: "exact" });
    const { data: cats }  = await admin.from("compliance_activity_categories").select("category_name", { count: "exact" });
    return NextResponse.json({
      dry_run: true,
      current_chunks: count ?? 0,
      rules_to_embed: rules?.length ?? 0,
      categories_to_embed: cats?.length ?? 0,
    });
  }

  const result = await seedComplianceRules();

  return NextResponse.json({
    success: result.errors.length === 0,
    inserted: result.inserted,
    skipped: result.skipped,
    errors: result.errors,
  });
}
