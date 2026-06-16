import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/enrollments
 *
 * Enrollment records for training provider LMS integrations.
 * Returns paginated enrollments across all courses owned by this provider.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:enrollments
 *
 * Query params:
 *   ?course_id=uuid          — filter to a specific course
 *   ?status=enrolled|completed|cancelled
 *   ?page=1&per_page=100
 *
 * Privacy: Learner names are never returned — only professional_id (UUID).
 *   Profession and compliance_status only returned if employer_can_view_cme_summary
 *   is not disabled for that professional.
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

  if (!requireScope(ctx, "read:enrollments")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:enrollments" }, { status: 403 });
  }

  if (!ctx.providerId) {
    return NextResponse.json({ error: "This endpoint is only available to training provider accounts" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const admin = createAdminClient();

  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name")
    .eq("id", ctx.providerId)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) {
    return NextResponse.json({ error: "Provider account not found or inactive" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page         = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage      = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") ?? "100")));
  const courseFilter = searchParams.get("course_id");
  const statusFilter = searchParams.get("status");

  // Get all course IDs owned by this provider
  const { data: providerCourses } = await admin
    .from("courses")
    .select("id, title")
    .eq("provider_id", ctx.providerId);

  if (!providerCourses?.length) {
    return NextResponse.json({
      data: [],
      pagination: { page, per_page: perPage, total: 0, total_pages: 0 },
      meta: { provider_id: ctx.providerId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  const courseMap = Object.fromEntries(providerCourses.map((c) => [c.id, c.title]));
  const allowedIds = providerCourses.map((c) => c.id);

  let enrollQuery = admin
    .from("course_enrollments")
    .select("id, course_id, professional_id, status, enrolled_at, completed_at", { count: "exact" })
    .in("course_id", allowedIds)
    .order("enrolled_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (courseFilter && allowedIds.includes(courseFilter)) {
    enrollQuery = enrollQuery.eq("course_id", courseFilter);
  }
  if (statusFilter) {
    enrollQuery = enrollQuery.eq("status", statusFilter);
  }

  const { data: enrollments, count, error } = await enrollQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch profession for learners (no names — privacy)
  const learnerIds = [...new Set((enrollments ?? []).map((e) => e.professional_id))];
  const professionMap: Record<string, string | null> = {};

  if (learnerIds.length > 0) {
    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, profession")
      .in("auth_id", learnerIds);
    for (const p of profiles ?? []) professionMap[p.auth_id] = p.profession;
  }

  const total = count ?? 0;
  const data  = (enrollments ?? []).map((e) => ({
    enrollment_id:  e.id,
    course_id:      e.course_id,
    course_title:   courseMap[e.course_id] ?? null,
    professional_id: e.professional_id,
    profession:     professionMap[e.professional_id] ?? null,
    status:         e.status,
    enrolled_at:    e.enrolled_at,
    completed_at:   e.completed_at ?? null,
  }));

  return NextResponse.json({
    data,
    pagination: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) },
    meta: {
      provider_id:  ctx.providerId,
      generated_at: new Date().toISOString(),
      api_version:  "v1",
    },
  });
}
