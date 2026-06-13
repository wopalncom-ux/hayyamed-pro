import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const CreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed_amount", "free_upgrade"]),
  discount_value: z.number().min(0),
  target_type: z.enum(["user", "organization", "global"]),
  target_id: z.string().uuid().optional().nullable(),
  applicable_plans: z.array(z.string()).min(1),
  valid_from: z.string().datetime().optional(),
  valid_until: z.string().datetime().optional().nullable(),
  max_uses: z.number().int().positive().optional().nullable(),
  promo_code: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from("discounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ discounts: data });
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
    .from("discounts")
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  await logAudit({ actorAuthId: user.id, action: "admin.discount.create", targetTable: "discounts", targetId: data.id, metadata: { name: data.name, discount_type: data.discount_type, discount_value: data.discount_value, target_type: data.target_type } });

  return NextResponse.json({ discount: data }, { status: 201 });
}
