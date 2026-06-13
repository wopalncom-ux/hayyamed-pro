import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const VALID_CATEGORIES = [
  "conference", "online", "workshop", "journal", "teaching",
  "simulation", "mandatory", "patient_safety", "other",
] as const;
type ValidCategory = typeof VALID_CATEGORIES[number];

function toCmeCategory(courseCategory: string | null, deliveryMode: string): ValidCategory {
  if (courseCategory && (VALID_CATEGORIES as readonly string[]).includes(courseCategory)) {
    return courseCategory as ValidCategory;
  }
  if (deliveryMode === "in_person") return "conference";
  if (deliveryMode === "online") return "online";
  if (deliveryMode === "hybrid") return "workshop";
  return "other";
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { enrollmentId } = await req.json();
  if (!enrollmentId) return NextResponse.json({ error: "enrollmentId required" }, { status: 400 });

  const admin = createAdminClient();

  const { data: enrollment } = await admin
    .from("course_enrollments")
    .select("id, course_id, professional_id, status, courses(title, credits, category, delivery_mode, training_providers(name))")
    .eq("id", enrollmentId)
    .eq("professional_id", user.id)
    .maybeSingle();

  if (!enrollment) return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  if (enrollment.status === "completed") return NextResponse.json({ error: "Already completed" }, { status: 409 });
  if (enrollment.status === "cancelled") return NextResponse.json({ error: "Enrollment is cancelled" }, { status: 400 });

  const course = Array.isArray(enrollment.courses)
    ? enrollment.courses[0]
    : enrollment.courses as {
        title: string; credits: number; category: string | null;
        delivery_mode: string;
        training_providers: { name: string } | { name: string }[] | null;
      } | null;

  if (!course) return NextResponse.json({ error: "Course data missing" }, { status: 500 });

  const providerObj = Array.isArray(course.training_providers)
    ? course.training_providers[0]
    : course.training_providers as { name: string } | null;

  const today = new Date().toISOString().split("T")[0];

  // Get user's primary wallet (is_primary column added in migration 026;
  // fallback: any wallet for backward compat before migration runs)
  const { data: wallet } = await admin
    .from("cme_wallets")
    .select("id")
    .eq("professional_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!wallet) {
    // No wallet — still mark complete, just skip CME credit
    await admin
      .from("course_enrollments")
      .update({ status: "completed", completed_at: new Date().toISOString(), credits_issued: course.credits })
      .eq("id", enrollmentId);

    return NextResponse.json({ ok: true, creditsIssued: 0, note: "No CME wallet — set up your compliance wallet to receive credits." });
  }

  // Insert verified CME activity (DB trigger updates wallet.completed_credits automatically)
  const { data: activity, error: activityErr } = await admin
    .from("cme_activities")
    .insert({
      wallet_id: wallet.id,
      professional_id: user.id,
      title: course.title,
      provider: providerObj?.name ?? null,
      activity_date: today,
      credits: course.credits,
      category: toCmeCategory(course.category, course.delivery_mode),
      verification_status: "verified",
      employer_visible: true,
    })
    .select("id")
    .single();

  if (activityErr) return NextResponse.json({ error: activityErr.message }, { status: 500 });

  // Mark enrollment complete, link the auto-created CME activity
  const { error: updateErr } = await admin
    .from("course_enrollments")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      credits_issued: course.credits,
      cme_activity_id: activity.id,
    })
    .eq("id", enrollmentId);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "course.completed",
    targetTable: "course_enrollments",
    targetId: enrollmentId,
    metadata: { courseId: enrollment.course_id, credits: course.credits, activityId: activity.id },
  });

  return NextResponse.json({ ok: true, creditsIssued: course.credits });
}
