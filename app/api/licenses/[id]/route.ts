import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const UpdateSchema = z.object({
  license_number:      z.string().min(1).max(100).optional(),
  licensing_authority: z.string().min(1).max(100).optional(),
  country_code:        z.string().length(2).optional(),
  profession:          z.string().max(100).optional().nullable(),
  specialty:           z.string().max(100).optional().nullable(),
  issue_date:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  expiry_date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes:               z.string().max(500).optional().nullable(),
  is_primary:          z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const admin = createAdminClient();

  // Verify ownership
  const { data: existing } = await admin
    .from("professional_licenses")
    .select("id")
    .eq("id", id)
    .eq("professional_id", user.id)
    .maybeSingle();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If setting primary, unset others first
  if (parsed.data.is_primary) {
    await admin
      .from("professional_licenses")
      .update({ is_primary: false })
      .eq("professional_id", user.id)
      .neq("id", id);
  }

  const { data, error } = await admin
    .from("professional_licenses")
    .update(parsed.data)
    .eq("id", id)
    .eq("professional_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ license: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { error } = await admin
    .from("professional_licenses")
    .delete()
    .eq("id", id)
    .eq("professional_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
