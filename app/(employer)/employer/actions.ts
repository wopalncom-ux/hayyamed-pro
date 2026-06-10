"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

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

  revalidatePath("/employer");
  return { error: null };
}
