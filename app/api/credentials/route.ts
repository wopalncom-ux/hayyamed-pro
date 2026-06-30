import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getUserPlan, isPro } from "@/lib/subscription";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

// Free tier may track a few credentials; Pro unlocks unlimited tracking + expiry reminders.
const FREE_LIMIT = 3;

const CREDENTIAL_TYPES = [
  "medical_license", "bls", "acls", "pals", "nrp", "atls",
  "malpractice_insurance", "dataflow_psv", "good_standing",
  "passport", "visa", "qid", "degree", "board_certification", "other",
] as const;

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const CreateSchema = z.object({
  credential_type: z.enum(CREDENTIAL_TYPES),
  title: z.string().min(1).max(200),
  issuing_authority: z.string().max(200).nullable().optional(),
  credential_number: z.string().max(120).nullable().optional(),
  issue_date: dateStr.nullable().optional(),
  expiry_date: dateStr.nullable().optional(),
  document_url: z.string().max(1000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("professional_credentials")
    .select("id, credential_type, title, issuing_authority, credential_number, issue_date, expiry_date, document_url, notes, created_at, updated_at")
    .eq("professional_id", user.id)
    .order("expiry_date", { ascending: true, nullsFirst: false });

  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  return NextResponse.json({ credentials: data ?? [] });
}

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = CreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();

  // Server-side free-tier enforcement (never trust the client).
  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    const { count } = await admin
      .from("professional_credentials")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id);
    if ((count ?? 0) >= FREE_LIMIT) {
      return NextResponse.json(
        { error: "free_limit", message: `Free plan tracks up to ${FREE_LIMIT} credentials. Upgrade to Pro for unlimited credentials and expiry reminders.` },
        { status: 402 },
      );
    }
  }

  const { data, error } = await admin
    .from("professional_credentials")
    .insert({
      professional_id: user.id,
      credential_type: parsed.data.credential_type,
      title: parsed.data.title,
      issuing_authority: parsed.data.issuing_authority ?? null,
      credential_number: parsed.data.credential_number ?? null,
      issue_date: parsed.data.issue_date ?? null,
      expiry_date: parsed.data.expiry_date ?? null,
      document_url: parsed.data.document_url ?? null,
      notes: parsed.data.notes ?? null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Failed to save credential" }, { status: 500 });

  logAudit({
    actorAuthId: user.id,
    action: "credential.created",
    targetTable: "professional_credentials",
    targetId: data.id,
    metadata: { credential_type: parsed.data.credential_type },
  }).catch(() => {});

  return NextResponse.json({ id: data.id }, { status: 201 });
}
