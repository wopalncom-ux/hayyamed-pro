import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const CREDENTIAL_TYPES = [
  "medical_license", "bls", "acls", "pals", "nrp", "atls",
  "malpractice_insurance", "dataflow_psv", "good_standing",
  "passport", "visa", "qid", "degree", "board_certification", "other",
] as const;

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const UpdateSchema = z.object({
  credential_type: z.enum(CREDENTIAL_TYPES).optional(),
  title: z.string().min(1).max(200).optional(),
  issuing_authority: z.string().max(200).nullable().optional(),
  credential_number: z.string().max(120).nullable().optional(),
  issue_date: dateStr.nullable().optional(),
  expiry_date: dateStr.nullable().optional(),
  document_url: z.string().max(1000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = UpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  // Scope the update to the owner's row — defence in depth alongside RLS.
  const { data, error } = await admin
    .from("professional_credentials")
    .update(parsed.data)
    .eq("id", id)
    .eq("professional_id", user.id)
    .select("id")
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  logAudit({
    actorAuthId: user.id,
    action: "credential.updated",
    targetTable: "professional_credentials",
    targetId: id,
  }).catch(() => {});

  return NextResponse.json({ id: data.id });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("professional_credentials")
    .delete()
    .eq("id", id)
    .eq("professional_id", user.id);

  if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });

  logAudit({
    actorAuthId: user.id,
    action: "credential.deleted",
    targetTable: "professional_credentials",
    targetId: id,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
