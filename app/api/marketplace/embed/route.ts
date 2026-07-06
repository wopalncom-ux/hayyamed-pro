import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getTextEmbedding, buildCourseEmbeddingText } from "@/lib/ai/embeddings";

export const runtime = "nodejs";

// POST /api/marketplace/embed
// Body: { courseId: string } — embed one course
// Body: { all: true }       — batch embed all courses without embeddings (admin only)
export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Verify caller is a platform admin or an active training provider
  const [{ data: adminMember }, { data: providerAccount }] = await Promise.all([
    admin
      .from("organization_members")
      .select("role")
      .eq("auth_id", user.id)
      .in("role", ["founder", "master_admin", "super_admin"])
      .limit(1)
      .maybeSingle(),
    admin
      .from("training_providers")
      .select("id")
      .eq("created_by", user.id)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  if (!adminMember && !providerAccount) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({})) as { courseId?: string; all?: boolean };
  const isAdmin =
    adminMember?.role === "founder" ||
    adminMember?.role === "master_admin" ||
    adminMember?.role === "super_admin";

  if (body.all && isAdmin) {
    // Batch embed all courses missing embeddings
    const { data: courses } = await admin
      .from("courses")
      .select("id, title, description, category, credits, professions, country_codes, provider_id")
      .is("embedding", null)
      .eq("status", "active")
      .limit(50);

    if (!courses?.length) return NextResponse.json({ embedded: 0, message: "No courses need embedding" });

    let count = 0;
    for (const course of courses) {
      try {
        const text = buildCourseEmbeddingText(course as Parameters<typeof buildCourseEmbeddingText>[0]);
        const embedding = await getTextEmbedding(text);
        await admin.from("courses").update({ embedding: JSON.stringify(embedding) }).eq("id", course.id);
        count++;
      } catch {
        // Skip individual failures — log and continue
      }
    }
    return NextResponse.json({ embedded: count, total: courses.length });
  }

  if (!body.courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

  // Verify access to this specific course
  const { data: course } = await admin
    .from("courses")
    .select("id, title, description, category, credits, professions, country_codes, provider_id")
    .eq("id", body.courseId)
    .maybeSingle();

  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  if (!isAdmin) {
    if (!providerAccount || providerAccount.id !== course.provider_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const text = buildCourseEmbeddingText(course as Parameters<typeof buildCourseEmbeddingText>[0]);
  const embedding = await getTextEmbedding(text);
  await admin.from("courses").update({ embedding: JSON.stringify(embedding) }).eq("id", course.id);

  return NextResponse.json({ success: true, courseId: course.id });
}
