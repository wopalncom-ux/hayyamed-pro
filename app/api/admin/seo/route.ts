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

// GET /api/admin/seo?page_key=landing
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const pageKey = req.nextUrl.searchParams.get("page_key");

  if (pageKey) {
    const { data, error } = await admin
      .from("page_seo_settings")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const { data, error } = await admin
    .from("page_seo_settings")
    .select("*")
    .order("page_key");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/admin/seo — upsert SEO for a page
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    page_key, page_label,
    meta_title, meta_description,
    og_title, og_description, og_image_url,
    canonical_url, robots_directive, keywords, json_ld,
  } = body;

  if (!page_key) return NextResponse.json({ error: "page_key required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("page_seo_settings")
    .upsert({
      page_key,
      page_label: page_label ?? null,
      meta_title: meta_title ?? null,
      meta_description: meta_description ?? null,
      og_title: og_title ?? null,
      og_description: og_description ?? null,
      og_image_url: og_image_url ?? null,
      canonical_url: canonical_url ?? null,
      robots_directive: robots_directive ?? "index, follow",
      keywords: keywords ?? [],
      json_ld: json_ld ?? null,
      updated_by: user.id,
    }, { onConflict: "page_key" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
