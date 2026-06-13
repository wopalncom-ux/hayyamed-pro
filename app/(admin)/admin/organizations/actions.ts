"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

export async function verifyOrganization(orgId: string): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("organizations")
    .update({ verified: true })
    .eq("id", orgId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "organization.verified",
    targetTable: "organizations",
    targetId: orgId,
  });

  revalidatePath("/admin/organizations");
  return {};
}

export async function unverifyOrganization(orgId: string): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("organizations")
    .update({ verified: false })
    .eq("id", orgId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "organization.unverified",
    targetTable: "organizations",
    targetId: orgId,
  });

  revalidatePath("/admin/organizations");
  return {};
}
