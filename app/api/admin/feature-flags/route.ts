import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("feature_flags")
    .select("key, enabled, enabled_plans, rollout_pct, description, updated_at")
    .order("key");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ flags: data });
}

const UpdateSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean(),
  enabled_plans: z.array(z.string()).nullable().optional(),
  rollout_pct: z.number().int().min(0).max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { key, enabled, enabled_plans, rollout_pct } = parsed.data;

  const admin = createAdminClient();
  const update: Record<string, unknown> = { enabled, updated_by: user.id, updated_at: new Date().toISOString() };
  if (enabled_plans !== undefined) update.enabled_plans = enabled_plans;
  if (rollout_pct !== undefined) update.rollout_pct = rollout_pct;

  const { error } = await admin
    .from("feature_flags")
    .update(update)
    .eq("key", key);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "admin.feature_flag.update",
    targetTable: "feature_flags",
    metadata: { key, enabled, rollout_pct },
  });

  return NextResponse.json({ ok: true });
}
