import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

// GET /api/admin/content?page_key=landing
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const pageKey = req.nextUrl.searchParams.get("page_key");

  let query = admin.from("platform_content").select("*").order("page_key").order("section_key").order("field_key");
  if (pageKey) query = query.eq("page_key", pageKey);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/admin/content — upsert a single content field
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { page_key, section_key, field_key, content_value, content_type, notes } = body;

  if (!page_key || !section_key || !field_key) {
    return NextResponse.json({ error: "page_key, section_key, field_key required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("platform_content")
    .upsert({
      page_key,
      section_key,
      field_key,
      content_value: content_value ?? "",
      content_type: content_type ?? "text",
      notes: notes ?? null,
      updated_by: user.id,
    }, { onConflict: "page_key,section_key,field_key" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PUT /api/admin/content — bulk upsert array
export async function PUT(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const rows = Array.isArray(body) ? body : [body];

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("platform_content")
    .upsert(
      rows.map((r: Record<string, unknown>) => ({ ...r, updated_by: user.id })),
      { onConflict: "page_key,section_key,field_key" }
    )
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/admin/content?id=uuid
export async function DELETE(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("platform_content").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
