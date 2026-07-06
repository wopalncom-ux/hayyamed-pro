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
    .limit(1)
    .maybeSingle();
  return member ? user : null;
}

function rangeStart(range: string): string | null {
  const now = new Date();
  const map: Record<string, number> = { "1h": 1/24, "24h": 1, "7d": 7, "30d": 30, "90d": 90 };
  const days = map[range];
  if (!days) return null;
  return new Date(now.getTime() - days * 86400000).toISOString();
}

// GET /api/admin/logs?source=audit|ai|webhook&range=7d&level=all|error|success&search=...&offset=0&limit=100
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const source  = req.nextUrl.searchParams.get("source") ?? "audit";
  const range   = req.nextUrl.searchParams.get("range") ?? "7d";
  const level   = req.nextUrl.searchParams.get("level") ?? "all";
  const search  = req.nextUrl.searchParams.get("search") ?? "";
  const limit   = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "100", 10), 500);
  const offset  = parseInt(req.nextUrl.searchParams.get("offset") ?? "0", 10);
  const since   = rangeStart(range);

  const admin = createAdminClient();

  if (source === "audit") {
    let q = admin
      .from("audit_logs")
      .select("id, created_at, actor_id, actor_role, action, target_type, target_id, metadata, ip_address", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (since) q = q.gte("created_at", since);
    if (search) q = q.or(`action.ilike.%${search}%,actor_id.ilike.%${search}%`);

    const { data, error, count } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, count, source: "audit" });
  }

  if (source === "ai") {
    let q = admin
      .from("ai_call_logs")
      .select("id, created_at, professional_id, action, model, cost_usd, input_tokens, output_tokens, latency_ms, success, error_message", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (since) q = q.gte("created_at", since);
    if (level === "error")   q = q.eq("success", false);
    if (level === "success") q = q.eq("success", true);
    if (search) q = q.or(`action.ilike.%${search}%,model.ilike.%${search}%`);

    const { data, error, count } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, count, source: "ai" });
  }

  if (source === "webhook") {
    let q = admin
      .from("webhook_deliveries")
      .select("id, created_at, endpoint_id, event_type, status_code, success, attempt_count, response_body", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (since) q = q.gte("created_at", since);
    if (level === "error")   q = q.eq("success", false);
    if (level === "success") q = q.eq("success", true);
    if (search) q = q.or(`event_type.ilike.%${search}%`);

    const { data, error, count } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, count, source: "webhook" });
  }

  return NextResponse.json({ error: "Invalid source" }, { status: 400 });
}
