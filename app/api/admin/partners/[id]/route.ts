import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  logo_url: z.string().url().optional().nullable(),
  website_url: z.string().url().optional().nullable(),
  country_code: z.string().optional().nullable(),
  partner_type: z.enum(["accreditor","employer","technology","government","hospital","university"]).optional().nullable(),
  organization_id: z.string().uuid().optional().nullable(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
  show_on_landing: z.boolean().optional(),
  show_on_dashboard: z.boolean().optional(),
  tagline: z.string().optional().nullable(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from("partners")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  await logAudit({ actorAuthId: user.id, action: "admin.partner.update", targetTable: "partners", targetId: id, metadata: parsed.data as Record<string, unknown> });
  return NextResponse.json({ partner: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const admin = createAdminClient();

  const { error: dbErr } = await admin
    .from("partners")
    .update({ is_active: false })
    .eq("id", id);

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  await logAudit({ actorAuthId: user.id, action: "admin.partner.deactivate", targetTable: "partners", targetId: id });
  return NextResponse.json({ success: true });
}
