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

export async function approveUnverifiedRequest(
  requestId: string,
  orgName: string,
  orgType: string,
  professionalId: string
) {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();

  const { data: newOrg, error: orgError } = await admin
    .from("organizations")
    .insert({ name: orgName, type: orgType, country: "Qatar", city: "Doha", verified: true })
    .select("id")
    .single();

  if (orgError) return { error: orgError.message };

  const { error: updateError } = await admin
    .from("employer_link_requests")
    .update({
      organization_id: newOrg.id,
      unverified_employer_name: null,
      status: "approved",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) return { error: updateError.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "link_request.admin_approved_unverified",
    targetTable: "employer_link_requests",
    targetId: requestId,
    metadata: { orgName, orgType, newOrgId: newOrg.id, professionalId },
  });

  revalidatePath("/admin/link-requests");
  return { error: null };
}

export async function rejectAdminRequest(requestId: string) {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("employer_link_requests")
    .update({ status: "rejected", resolved_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "link_request.admin_rejected",
    targetTable: "employer_link_requests",
    targetId: requestId,
  });

  revalidatePath("/admin/link-requests");
  return { error: null };
}

export async function approveVerifiedRequest(requestId: string) {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("employer_link_requests")
    .update({ status: "approved", resolved_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "link_request.admin_approved_verified",
    targetTable: "employer_link_requests",
    targetId: requestId,
  });

  revalidatePath("/admin/link-requests");
  return { error: null };
}
