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
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

// GET /api/admin/performance?page_url=https://...&limit=20
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const pageUrl = req.nextUrl.searchParams.get("page_url");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50", 10);

  let query = admin
    .from("performance_snapshots")
    .select("id, page_url, page_label, strategy, performance_score, accessibility_score, seo_score, best_practices_score, lcp_ms, cls_score, fid_ms, ttfb_ms, fcp_ms, si_ms, tbt_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (pageUrl) query = query.eq("page_url", pageUrl);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/admin/performance?id=uuid
export async function DELETE(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("performance_snapshots").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
