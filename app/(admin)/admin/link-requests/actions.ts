"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { sendLinkApprovedEmail, sendLinkRejectedEmail } from "@/lib/email";

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

async function getProfessionalEmailAndName(authId: string): Promise<{ email: string; name: string } | null> {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("email, full_name")
    .eq("auth_id", authId)
    .maybeSingle();
  if (!profile?.email) return null;
  return { email: profile.email, name: profile.full_name ?? "Healthcare Professional" };
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

  // Fire-and-forget email — never crash the action over email
  getProfessionalEmailAndName(professionalId).then((pro) => {
    if (pro) sendLinkApprovedEmail({ to: pro.email, name: pro.name, orgName }).catch(() => {});
  });

  revalidatePath("/admin/link-requests");
  return { error: null };
}

export async function rejectAdminRequest(requestId: string) {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();

  // Fetch request before updating so we can notify the professional
  const { data: request } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("id", requestId)
    .maybeSingle();

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

  if (request?.professional_id) {
    getProfessionalEmailAndName(request.professional_id).then((pro) => {
      if (pro) sendLinkRejectedEmail({ to: pro.email, name: pro.name }).catch(() => {});
    });
  }

  revalidatePath("/admin/link-requests");
  return { error: null };
}

export async function approveVerifiedRequest(requestId: string) {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();

  // Fetch request + org name before updating
  const { data: request } = await admin
    .from("employer_link_requests")
    .select("professional_id, organizations(name)")
    .eq("id", requestId)
    .maybeSingle();

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

  if (request?.professional_id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgName = (request as any).organizations?.name ?? "your employer";
    getProfessionalEmailAndName(request.professional_id).then((pro) => {
      if (pro) sendLinkApprovedEmail({ to: pro.email, name: pro.name, orgName }).catch(() => {});
    });
  }

  revalidatePath("/admin/link-requests");
  return { error: null };
}
