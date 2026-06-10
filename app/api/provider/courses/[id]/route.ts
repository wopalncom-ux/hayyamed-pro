import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

async function getProviderCourse(userId: string, courseId: string) {
  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("created_by", userId)
    .eq("status", "active")
    .maybeSingle();
  if (!provider) return { provider: null, course: null, admin };

  const { data: course } = await admin
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("provider_id", provider.id)
    .maybeSingle();

  return { provider, course, admin };
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { provider, course, admin } = await getProviderCourse(user.id, id);
  if (!provider || !course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { title, description, category, credits, credit_type, delivery_mode,
    duration_hours, is_free, price_usd, country_codes, start_date, end_date,
    enrollment_deadline, max_enrollments, status } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const { error } = await admin
    .from("courses")
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      category: category ?? course.category,
      credits: Number(credits),
      credit_type: credit_type ?? course.credit_type,
      delivery_mode: delivery_mode ?? course.delivery_mode,
      duration_hours: duration_hours ?? null,
      is_free: !!is_free,
      price_usd: is_free ? null : price_usd,
      country_codes: country_codes ?? course.country_codes,
      start_date: start_date || null,
      end_date: end_date || null,
      enrollment_deadline: enrollment_deadline || null,
      max_enrollments: max_enrollments ?? null,
      status: status ?? course.status,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "course.updated",
    targetTable: "courses",
    targetId: id,
    metadata: { status },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { provider, course, admin } = await getProviderCourse(user.id, id);
  if (!provider || !course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only allow deleting draft courses with no enrollments
  if (course.status !== "draft") {
    return NextResponse.json({ error: "Only draft courses can be deleted" }, { status: 400 });
  }

  const { count } = await admin
    .from("course_enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", id);

  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "Cannot delete course with enrollments" }, { status: 400 });
  }

  const { error } = await admin.from("courses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
