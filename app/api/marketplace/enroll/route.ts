import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { dispatchProviderWebhook } from "@/lib/webhooks/dispatch";

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

  const admin = createAdminClient();

  // Verify course exists and is active
  const { data: course } = await admin
    .from("courses")
    .select("id, status, max_enrollments, enrollment_deadline, provider_id")
    .eq("id", courseId)
    .eq("status", "active")
    .maybeSingle();

  if (!course) return NextResponse.json({ error: "Course not found or not active" }, { status: 404 });

  // Check enrollment deadline
  if (course.enrollment_deadline && new Date(course.enrollment_deadline) < new Date()) {
    return NextResponse.json({ error: "Enrollment deadline has passed" }, { status: 400 });
  }

  // Check max enrollments
  if (course.max_enrollments) {
    const { count } = await admin
      .from("course_enrollments")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId)
      .neq("status", "cancelled");

    if ((count ?? 0) >= course.max_enrollments) {
      return NextResponse.json({ error: "Course is full" }, { status: 400 });
    }
  }

  const { data: enrollment, error } = await admin
    .from("course_enrollments")
    .insert({
      course_id: courseId,
      professional_id: user.id,
      status: "enrolled",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (course.provider_id) {
    dispatchProviderWebhook(course.provider_id, "course.enrolled", {
      professional_id: user.id,
      course_id: courseId,
      enrollment_id: enrollment.id,
    }).catch(() => {});
  }

  return NextResponse.json({ enrollmentId: enrollment.id });
}
