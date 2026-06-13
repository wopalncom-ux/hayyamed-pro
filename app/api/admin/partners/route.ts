import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const CreateSchema = z.object({
  name: z.string().min(1),
  logo_url: z.string().url().optional().nullable(),
  website_url: z.string().url().optional().nullable(),
  country_code: z.string().optional().nullable(),
  partner_type: z.enum(["accreditor","employer","technology","government","hospital","university"]).optional().nullable(),
  organization_id: z.string().uuid().optional().nullable(),
  display_order: z.number().int().optional(),
  show_on_landing: z.boolean().optional(),
  show_on_dashboard: z.boolean().optional(),
  tagline: z.string().optional().nullable(),
});

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from("partners")
    .select("*")
    .order("display_order");

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ partners: data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from("partners")
    .insert(parsed.data)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  await logAudit({ actorAuthId: user.id, action: "admin.partner.create", targetTable: "partners", targetId: data.id, metadata: { name: data.name } });
  return NextResponse.json({ partner: data }, { status: 201 });
}
