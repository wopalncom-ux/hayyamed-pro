import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/courses
 *
 * Course catalog for training provider integrations.
 * Returns paginated list of the provider's courses with enrollment stats.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:courses
 *
 * Query params:
 *   ?status=active|draft|closed|cancelled
 *   ?category=cardiology
 *   ?page=1&per_page=100
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing X-Api-Key header", docs: "https://hayyamed.pro/docs/api" },
      { status: 401 }
    );
  }

  const ctx = await verifyApiKey(apiKey);
  if (!ctx) return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 });

  if (!requireScope(ctx, "read:courses")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:courses" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 100 requests per minute per API key" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const admin = createAdminClient();

  // Confirm this key belongs to a training provider
  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name")
    .eq("id", ctx.organizationId)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) {
    return NextResponse.json({ error: "This endpoint is only available to training provider accounts" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page           = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage        = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") ?? "100")));
  const statusFilter   = searchParams.get("status");
  const categoryFilter = searchParams.get("category");

  let query = admin
    .from("courses")
    .select("id, title, category, credits, credit_type, delivery_mode, is_free, price_usd, status, created_at", { count: "exact" })
    .eq("provider_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (statusFilter)   query = query.eq("status", statusFilter);
  if (categoryFilter) query = query.eq("category", categoryFilter);

  const { data: courses, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const courseIds = (courses ?? []).map((c) => c.id);

  // Enrollment counts per course
  const enrollmentMap: Record<string, { total: number; completed: number }> = {};
  if (courseIds.length > 0) {
    const { data: enrollments } = await admin
      .from("course_enrollments")
      .select("course_id, status")
      .in("course_id", courseIds)
      .neq("status", "cancelled");

    for (const e of enrollments ?? []) {
      if (!enrollmentMap[e.course_id]) enrollmentMap[e.course_id] = { total: 0, completed: 0 };
      enrollmentMap[e.course_id].total++;
      if (e.status === "completed") enrollmentMap[e.course_id].completed++;
    }
  }

  const total = count ?? 0;
  const data  = (courses ?? []).map((c) => {
    const stats = enrollmentMap[c.id] ?? { total: 0, completed: 0 };
    return {
      course_id:          c.id,
      title:              c.title,
      category:           c.category,
      credits:            c.credits,
      credit_type:        c.credit_type,
      delivery_mode:      c.delivery_mode,
      is_free:            c.is_free,
      price_usd:          c.price_usd,
      status:             c.status,
      enrollment_count:   stats.total,
      completion_count:   stats.completed,
      completion_rate_pct: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      created_at:         c.created_at,
    };
  });

  return NextResponse.json({
    data,
    pagination: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) },
    meta: {
      provider_id:   ctx.organizationId,
      provider_name: provider.name,
      generated_at:  new Date().toISOString(),
      api_version:   "v1",
    },
  });
}
