import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members").select("role")
    .eq("auth_id", user.id).in("role", ["master_admin", "super_admin"]).maybeSingle();
  return member ? user : null;
}

// GET /api/admin/announcements
export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("platform_announcements")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/admin/announcements
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, message, type, target_audience, is_active, dismissible, cta_label, cta_url, starts_at, ends_at } = body;
  if (!title || !message) return NextResponse.json({ error: "title and message required" }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin.from("platform_announcements").insert({
    title, message,
    type: type ?? "info",
    target_audience: target_audience ?? "all",
    is_active: is_active ?? true,
    dismissible: dismissible ?? true,
    cta_label: cta_label || null,
    cta_url: cta_url || null,
    starts_at: starts_at ?? new Date().toISOString(),
    ends_at: ends_at || null,
    created_by: user.id,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PUT /api/admin/announcements?id=uuid
export async function PUT(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const body = await req.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("platform_announcements").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/admin/announcements?id=uuid
export async function DELETE(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const admin = createAdminClient();
  const { error } = await admin.from("platform_announcements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
