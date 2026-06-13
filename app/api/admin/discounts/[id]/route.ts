import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const UpdateSchema = z.object({
  is_active: z.boolean().optional(),
  valid_until: z.string().datetime().optional().nullable(),
  max_uses: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
  discount_value: z.number().min(0).optional(),
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
    .from("discounts")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  await logAudit({ actorAuthId: user.id, action: "admin.discount.update", targetTable: "discounts", targetId: id, metadata: parsed.data as Record<string, unknown> });
  return NextResponse.json({ discount: data });
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
    .from("discounts")
    .update({ is_active: false })
    .eq("id", id);

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  await logAudit({ actorAuthId: user.id, action: "admin.discount.deactivate", targetTable: "discounts", targetId: id });
  return NextResponse.json({ success: true });
}
