"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

async function requireEmployerAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) throw new Error("Not an employer admin.");
  return { user, admin, orgId: (member as { organization_id: string }).organization_id };
}

export async function requireCourse(courseId: string, dueDate?: string, note?: string) {
  const { user, admin, orgId } = await requireEmployerAdmin();

  const { error } = await admin.from("employer_required_courses").upsert({
    org_id: orgId,
    course_id: courseId,
    assigned_by: user.id,
    due_date: dueDate || null,
    note: note || null,
  }, { onConflict: "org_id,course_id" });

  if (error) throw new Error(error.message);

  await logAudit({
    actorAuthId: user.id,
    action: "employer.require_course",
    targetTable: "employer_required_courses",
    metadata: { courseId, dueDate, orgId },
  });

  revalidatePath("/employer/required-training");
  revalidatePath("/dashboard/marketplace/my-courses");
}

export async function unrequireCourse(requirementId: string) {
  const { user, admin, orgId } = await requireEmployerAdmin();

  const { data: req } = await admin
    .from("employer_required_courses")
    .select("org_id")
    .eq("id", requirementId)
    .maybeSingle();

  if (!req || req.org_id !== orgId) throw new Error("Requirement not found.");

  await admin.from("employer_required_courses").delete().eq("id", requirementId);

  await logAudit({
    actorAuthId: user.id,
    action: "employer.unrequire_course",
    targetTable: "employer_required_courses",
    metadata: { requirementId, orgId },
  });

  revalidatePath("/employer/required-training");
  revalidatePath("/dashboard/marketplace/my-courses");
}
