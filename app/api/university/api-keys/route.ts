import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { generateApiKey } from "@/lib/apiKeyAuth";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const VALID_SCOPES = ["read:faculty", "read:compliance"] as const;

async function getUniversityOrg(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", userId)
    .eq("role", "university_admin")
    .maybeSingle();
  return data?.organization_id ?? null;
}

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getUniversityOrg(user.id);
  if (!orgId) return NextResponse.json({ error: "No university organisation" }, { status: 403 });

  const admin = createAdminClient();
  const { data: keys } = await admin
    .from("api_keys")
    .select("id, name, key_prefix, scopes, last_used_at, expires_at, is_active, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ keys: keys ?? [] });
}

const CreateSchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(VALID_SCOPES)).min(1),
  expires_in_days: z.number().int().min(1).max(365).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getUniversityOrg(user.id);
  if (!orgId) return NextResponse.json({ error: "No university organisation" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  const admin = createAdminClient();
  const { count } = await admin
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId)
    .eq("is_active", true);

  if ((count ?? 0) >= 10) {
    return NextResponse.json({ error: "Maximum 10 active API keys per organisation" }, { status: 400 });
  }

  const { key, prefix, hash } = generateApiKey();
  const expiresAt = parsed.data.expires_in_days
    ? new Date(Date.now() + parsed.data.expires_in_days * 86400_000).toISOString()
    : null;

  const { data: created, error } = await admin
    .from("api_keys")
    .insert({
      organization_id: orgId,
      name: parsed.data.name,
      key_prefix: prefix,
      key_hash: hash,
      scopes: parsed.data.scopes,
      expires_at: expiresAt,
      created_by: user.id,
    })
    .select("id, name, key_prefix, scopes, expires_at, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "university.api_key.created",
    targetTable: "api_keys",
    targetId: created.id,
    metadata: { name: parsed.data.name, scopes: parsed.data.scopes },
  });

  return NextResponse.json({ key: { ...created, full_key: key } }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getUniversityOrg(user.id);
  if (!orgId) return NextResponse.json({ error: "No university organisation" }, { status: 403 });

  const { id } = await req.json().catch(() => ({ id: null }));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("api_keys")
    .select("organization_id, name")
    .eq("id", id)
    .maybeSingle();

  if (!existing || existing.organization_id !== orgId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await admin.from("api_keys").update({ is_active: false }).eq("id", id);

  await logAudit({
    actorAuthId: user.id,
    action: "university.api_key.revoked",
    targetTable: "api_keys",
    targetId: id,
    metadata: { name: existing.name },
  });

  return NextResponse.json({ ok: true });
}
