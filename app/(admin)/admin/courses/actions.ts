"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .limit(1)
    .maybeSingle();

  if (!member) throw new Error("Unauthorized");
  return { user, admin };
}

export async function activateCourse(courseId: string) {
  const { user, admin } = await requireAdmin();

  await admin.from("courses").update({ status: "active" }).eq("id", courseId);

  logAudit({
    actorAuthId: user.id,
    action: "admin.course.activate",
    targetTable: "courses",
    targetId: courseId,
  }).catch(() => {});

  revalidatePath("/admin/courses");
}

export async function draftCourse(courseId: string, reason?: string) {
  const { user, admin } = await requireAdmin();

  await admin.from("courses").update({ status: "draft" }).eq("id", courseId);

  logAudit({
    actorAuthId: user.id,
    action: "admin.course.draft",
    targetTable: "courses",
    targetId: courseId,
    metadata: { reason: reason ?? null },
  }).catch(() => {});

  revalidatePath("/admin/courses");
}

export async function closeCourse(courseId: string) {
  const { user, admin } = await requireAdmin();

  await admin.from("courses").update({ status: "closed" }).eq("id", courseId);

  logAudit({
    actorAuthId: user.id,
    action: "admin.course.close",
    targetTable: "courses",
    targetId: courseId,
  }).catch(() => {});

  revalidatePath("/admin/courses");
}
