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

// Strict whitelist — only application tables, never system tables
export const ALLOWED_TABLES = [
  "professional_profiles", "organizations", "organization_members",
  "employer_link_requests", "profile_privacy_settings",
  "cme_wallets", "cme_activities", "subscriptions",
  "country_compliance_rules", "compliance_activity_categories",
  "audit_logs", "platform_content", "page_seo_settings",
  "media_library", "performance_snapshots",
  "courses", "course_enrollments", "course_reviews",
  "certificates", "professional_licenses",
  "nps_responses", "waitlist_entries", "demo_requests",
  "ai_call_logs", "push_subscriptions", "feature_flags",
  "webhook_endpoints", "webhook_deliveries", "api_keys",
  "notification_queue", "discount_codes",
  "training_providers", "provider_courses",
  "government_staff", "university_staff",
  "employer_required_trainings",
] as const;

// GET /api/admin/db/records?table=...&limit=50&offset=0&search=...&col=...
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const table  = req.nextUrl.searchParams.get("table") ?? "";
  const limit  = Math.min(parseInt(req.nextUrl.searchParams.get("limit")  ?? "50", 10), 200);
  const offset = parseInt(req.nextUrl.searchParams.get("offset") ?? "0", 10);
  const search = req.nextUrl.searchParams.get("search") ?? "";
  const col    = req.nextUrl.searchParams.get("col") ?? "";

  if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
    return NextResponse.json({ error: "Table not allowed" }, { status: 400 });
  }

  const admin = createAdminClient();

  let query = admin
    .from(table)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search && col) {
    query = query.ilike(col, `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Derive column names from first row
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
  return NextResponse.json({ data, columns, count, table });
}
