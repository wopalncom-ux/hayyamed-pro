import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const VALID_CATEGORIES = ["conference", "online", "workshop", "journal", "teaching", "simulation", "mandatory", "patient_safety", "other"] as const;
type ValidCategory = typeof VALID_CATEGORIES[number];

function toCmeCategory(deliveryMode: string): ValidCategory {
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
    .select("id, course_id, professional_id, status, courses(title, credits, delivery_mode, training_providers(created_by, name))")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (!enrollment) return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  if (enrollment.status === "completed") return NextResponse.json({ error: "Already completed" }, { status: 409 });

  const course = Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses as {
    title: string; credits: number; delivery_mode: string;
    training_providers: { created_by: string; name: string } | { created_by: string; name: string }[] | null;
  } | null;

  const providerObj = course
    ? (Array.isArray(course.training_providers) ? course.training_providers[0] : course.training_providers as { created_by: string; name: string } | null)
    : null;

  if (providerObj?.created_by !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  if (!course) return NextResponse.json({ error: "Course data missing" }, { status: 500 });

  const now = new Date().toISOString();

  await admin
    .from("course_enrollments")
    .update({ status: "completed", completed_at: now, credits_issued: course.credits })
    .eq("id", enrollmentId);

  // Issue CME credits to the learner's wallet
  const { data: wallet } = await admin
    .from("cme_wallets")
    .select("id, required_credits")
    .eq("professional_id", enrollment.professional_id)
    .maybeSingle();

  if (wallet) {
    await admin.from("cme_activities").insert({
      wallet_id: wallet.id,
      professional_id: enrollment.professional_id,
      title: course.title,
      provider: providerObj?.name ?? null,
      activity_date: now.split("T")[0],
      credits: course.credits,
      category: toCmeCategory(course.delivery_mode),
      verification_status: "verified",
      employer_visible: true,
    });

    const { data: updatedWallet } = await admin
      .from("cme_wallets")
      .select("completed_credits")
      .eq("id", wallet.id)
      .single();

    if (updatedWallet) {
      const ratio = updatedWallet.completed_credits / wallet.required_credits;
      const newStatus = ratio >= 1 ? "compliant" : ratio >= 0.75 ? "at_risk" : "non_compliant";
      await admin.from("cme_wallets").update({ compliance_status: newStatus }).eq("id", wallet.id);
    }
  }

  await logAudit({
    actorAuthId: user.id,
    action: "provider.mark_complete",
    targetTable: "course_enrollments",
    targetId: enrollmentId,
    metadata: { professionalId: enrollment.professional_id, credits: course.credits },
  });

  return NextResponse.json({ ok: true, creditsIssued: course.credits });
}
