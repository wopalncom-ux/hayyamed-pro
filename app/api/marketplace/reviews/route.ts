import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";
import { dispatchProviderWebhook } from "@/lib/webhooks/dispatch";

const ReviewSchema = z.object({
  courseId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { courseId, rating, reviewText } = parsed.data;
  const admin = createAdminClient();

  // Must have a completed enrollment
  const { data: enrollment } = await admin
    .from("course_enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("professional_id", user.id)
    .eq("status", "completed")
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ error: "You must complete the course before reviewing it" }, { status: 403 });
  }

  // Upsert review (one per professional per course)
  const { data: review, error } = await admin
    .from("course_reviews")
    .upsert(
      {
        course_id: courseId,
        reviewer_id: user.id,
        rating,
        review_text: reviewText?.trim() ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "course_id,reviewer_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("review upsert error", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }

  // Notify provider that a review was submitted
  const { data: courseRow } = await admin
    .from("courses")
    .select("provider_id")
    .eq("id", courseId)
    .maybeSingle();
  if (courseRow?.provider_id) {
    dispatchProviderWebhook(courseRow.provider_id, "course.reviewed", {
      professional_id: user.id,
      course_id: courseId,
      rating,
      review_id: review.id,
    }).catch(() => {});
  }

  return NextResponse.json({ review });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

  const admin = createAdminClient();
  await admin
    .from("course_reviews")
    .delete()
    .eq("course_id", courseId)
    .eq("reviewer_id", user.id);

  return NextResponse.json({ ok: true });
}
