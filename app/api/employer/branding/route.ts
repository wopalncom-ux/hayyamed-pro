import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const URL_RE    = /^https?:\/\/.+/;

const brandingSchema = z.object({
  brand_color:         z.string().regex(HEX_COLOR).nullable().optional(),
  brand_logo_url:      z.string().regex(URL_RE).max(1000).nullable().optional(),
  brand_name_override: z.string().max(80).nullable().optional(),
  brand_email_from:    z.string().max(120).nullable().optional(),
});

// GET — return current branding for the org
export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: org } = await admin
    .from("organizations")
    .select("brand_color, brand_logo_url, brand_name_override, brand_email_from")
    .eq("id", member.organization_id)
    .single();

  return NextResponse.json({ branding: org ?? {} });
}

// PATCH — update branding
export async function PATCH(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = brandingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 422 });
  }

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updates: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v !== undefined) updates[k] = v ?? null;
  }

  const { error } = await admin
    .from("organizations")
    .update(updates)
    .eq("id", member.organization_id);

  if (error) {
    return NextResponse.json({ error: "Failed to save branding" }, { status: 500 });
  }

  logAudit({
    actorAuthId: user.id,
    action: "org.branding.updated",
    targetTable: "organizations",
    targetId: member.organization_id,
    metadata: { fields: Object.keys(updates) },
  });

  return NextResponse.json({ ok: true });
}
