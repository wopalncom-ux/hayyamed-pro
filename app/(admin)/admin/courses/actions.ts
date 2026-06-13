"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
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
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();

  if (!member) throw new Error("Unauthorized");
  return { user, admin };
}

export async function activateCourse(courseId: string) {
  const { user, admin } = await requireAdmin();

  await admin.from("courses").update({ status: "active" }).eq("id", courseId);

  await admin.from("audit_logs").insert({
    actor_id: user.id,
    action: "admin.course.activate",
    target_type: "course",
    target_id: courseId,
    metadata: {},
  });

  revalidatePath("/admin/courses");
}

export async function draftCourse(courseId: string, reason?: string) {
  const { user, admin } = await requireAdmin();

  await admin.from("courses").update({ status: "draft" }).eq("id", courseId);

  await admin.from("audit_logs").insert({
    actor_id: user.id,
    action: "admin.course.draft",
    target_type: "course",
    target_id: courseId,
    metadata: { reason: reason ?? null },
  });

  revalidatePath("/admin/courses");
}

export async function closeCourse(courseId: string) {
  const { user, admin } = await requireAdmin();

  await admin.from("courses").update({ status: "closed" }).eq("id", courseId);

  await admin.from("audit_logs").insert({
    actor_id: user.id,
    action: "admin.course.close",
    target_type: "course",
    target_id: courseId,
    metadata: {},
  });

  revalidatePath("/admin/courses");
}
