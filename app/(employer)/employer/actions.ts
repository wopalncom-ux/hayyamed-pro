"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { sendLinkApprovedEmail, sendLinkRejectedEmail } from "@/lib/email";
import { EMPLOYER_TIERS, type EmployerTierKey } from "@/lib/paddle";

export async function approveLinkRequest(requestId: string, organizationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return { error: "Not authorized" };

  // Enforce tier staff limit — look up subscription then count current approved staff
  const [subRes, staffCountRes] = await Promise.all([
    admin
      .from("subscriptions")
      .select("employer_tier")
      .eq("professional_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle(),
    admin
      .from("employer_link_requests")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "approved"),
  ]);

  const tierKey = (subRes.data?.employer_tier ?? "clinic") as EmployerTierKey;
  const maxStaff = EMPLOYER_TIERS[tierKey]?.maxStaff ?? 10;
  const currentStaff = staffCountRes.count ?? 0;

  if (currentStaff >= maxStaff) {
    return { error: `Staff limit reached for your ${EMPLOYER_TIERS[tierKey]?.label ?? "current"} plan (${maxStaff} staff). Upgrade your plan to add more staff.` };
  }

  const { data: request } = await admin
    .from("employer_link_requests")
    .select("professional_id, organizations(name)")
    .eq("id", requestId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  const { error } = await admin
    .from("employer_link_requests")
    .update({ status: "approved", resolved_at: new Date().toISOString(), resolved_by: user.id })
    .eq("id", requestId)
    .eq("organization_id", organizationId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "link_request.approved",
    targetTable: "employer_link_requests",
    targetId: requestId,
    metadata: { organizationId, resolvedBy: user.id },
  });

  // Fire-and-forget: notify the professional their link was approved
  if (request?.professional_id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgs = (request as any).organizations;
    const orgName = (Array.isArray(orgs) ? orgs[0]?.name : orgs?.name) ?? "your employer";
    Promise.resolve(
      admin.from("professional_profiles")
        .select("email, full_name")
        .eq("auth_id", request.professional_id)
        .maybeSingle()
    ).then(({ data: pro }) => {
      if (pro?.email) {
        sendLinkApprovedEmail({
          to: pro.email,
          name: pro.full_name ?? "Healthcare Professional",
          orgName,
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  revalidatePath("/employer");
  return { error: null };
}

export async function rejectLinkRequest(requestId: string, organizationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return { error: "Not authorized" };

  const { data: request } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("id", requestId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  const { error } = await admin
    .from("employer_link_requests")
    .update({ status: "rejected", resolved_at: new Date().toISOString(), resolved_by: user.id })
    .eq("id", requestId)
    .eq("organization_id", organizationId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "link_request.rejected",
    targetTable: "employer_link_requests",
    targetId: requestId,
    metadata: { organizationId, resolvedBy: user.id },
  });

  // Fire-and-forget: notify the professional their request was rejected
  if (request?.professional_id) {
    Promise.resolve(
      admin.from("professional_profiles")
        .select("email, full_name")
        .eq("auth_id", request.professional_id)
        .maybeSingle()
    ).then(({ data: pro }) => {
      if (pro?.email) {
        sendLinkRejectedEmail({
          to: pro.email,
          name: pro.full_name ?? "Healthcare Professional",
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  revalidatePath("/employer");
  return { error: null };
}
