import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

async function requireAdmin(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", userId)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  return data?.role ?? null;
}

/**
 * DELETE /api/admin/reviews?id=<review_id>
 * Admin-only: remove any course review by id.
 */
export async function DELETE(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await requireAdmin(user.id);
  if (!role) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get("id");
  if (!reviewId) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("course_reviews")
    .select("id, course_id, reviewer_id, rating")
    .eq("id", reviewId)
    .maybeSingle();

  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  await admin.from("course_reviews").delete().eq("id", reviewId);

  await logAudit({
    actorAuthId: user.id,
    action: "admin.review.removed",
    targetTable: "course_reviews",
    targetId: reviewId,
    metadata: { course_id: existing.course_id, reviewer_id: existing.reviewer_id, rating: existing.rating },
  });

  return NextResponse.json({ ok: true });
}
