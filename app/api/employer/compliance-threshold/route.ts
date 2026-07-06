import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";

export const runtime = "nodejs";

const UpsertSchema = z.object({
  threshold_pct: z.number().int().min(0).max(100),
  alert_email:   z.string().email().max(255),
  enabled:       z.boolean(),
});

async function getOrgId(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", userId)
    .eq("role", "employer_admin")
    .limit(1)
    .maybeSingle();
  return data?.organization_id ?? null;
}

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getOrgId(user.id);
  if (!orgId) return NextResponse.json({ error: "Not an employer admin" }, { status: 403 });

  const admin = createAdminClient();
  const { data } = await admin
    .from("employer_compliance_thresholds")
    .select("threshold_pct, alert_email, enabled")
    .eq("organization_id", orgId)
    .maybeSingle();

  return NextResponse.json({ threshold: data ?? null });
}

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getOrgId(user.id);
  if (!orgId) return NextResponse.json({ error: "Not an employer admin" }, { status: 403 });

  const body = await req.json();
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("employer_compliance_thresholds")
    .upsert({
      organization_id: orgId,
      threshold_pct:   parsed.data.threshold_pct,
      alert_email:     parsed.data.alert_email,
      enabled:         parsed.data.enabled,
    }, { onConflict: "organization_id" });

  if (error) return NextResponse.json({ error: "Failed to save threshold" }, { status: 500 });
  return NextResponse.json({ success: true });
}
