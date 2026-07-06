"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import * as postmark from "postmark";

const FROM = process.env.EMAIL_FROM ?? "Hayya Med Pro <noreply@hayyamed.pro>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

function pmClient() {
  return new postmark.ServerClient(process.env.POSTMARK_API_TOKEN!);
}

// ─── Bulk Approve ──────────────────────────────────────────────────────────

export async function bulkApproveRequests(requestIds: string[], organizationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .in("role", ["government_admin"])
    .limit(1)
    .maybeSingle();

  if (!member) return { error: "Not authorized" };

  const { error } = await admin
    .from("employer_link_requests")
    .update({ status: "approved", resolved_at: new Date().toISOString(), resolved_by: user.id })
    .in("id", requestIds)
    .eq("organization_id", organizationId)
    .eq("status", "pending");

  if (error) return { error: "Failed to approve requests" };

  logAudit({
    actorAuthId: user.id,
    action: "government.bulk_approve",
    targetTable: "employer_link_requests",
    targetId: organizationId,
    metadata: { count: requestIds.length },
  }).catch(() => {});

  revalidatePath("/government");
  return { success: true, count: requestIds.length };
}

// ─── Bulk Reject ───────────────────────────────────────────────────────────

export async function bulkRejectRequests(requestIds: string[], organizationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .in("role", ["government_admin"])
    .limit(1)
    .maybeSingle();

  if (!member) return { error: "Not authorized" };

  const { error } = await admin
    .from("employer_link_requests")
    .update({ status: "rejected", resolved_at: new Date().toISOString(), resolved_by: user.id })
    .in("id", requestIds)
    .eq("organization_id", organizationId)
    .eq("status", "pending");

  if (error) return { error: "Failed to reject requests" };

  logAudit({
    actorAuthId: user.id,
    action: "government.bulk_reject",
    targetTable: "employer_link_requests",
    targetId: organizationId,
    metadata: { count: requestIds.length },
  }).catch(() => {});

  revalidatePath("/government");
  return { success: true, count: requestIds.length };
}

// ─── Update Government Settings ────────────────────────────────────────────

export async function updateGovernmentSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (!member) return;

  const authorityCode = (formData.get("authorityCode") as string | null)?.trim().toUpperCase();
  const authoritySubtype = formData.get("authoritySubtype") as string | null;
  const jurisdictionCountry = formData.get("jurisdictionCountry") as string | null;
  const professionScopeRaw = formData.get("professionScope") as string | null;
  const licenseRenewalUrl = formData.get("licenseRenewalUrl") as string | null;

  if (!authorityCode || !authoritySubtype || !jurisdictionCountry) {
    const { redirect } = await import("next/navigation");
    redirect(`/government/settings?error=${encodeURIComponent("Authority code, type and country are required.")}`);
  }

  const professionScope = professionScopeRaw
    ? professionScopeRaw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  await admin.from("government_settings").upsert(
    {
      organization_id: member.organization_id,
      authority_code: authorityCode,
      authority_subtype: authoritySubtype,
      jurisdiction_country: jurisdictionCountry,
      profession_scope: professionScope,
      license_renewal_url: licenseRenewalUrl || null,
    },
    { onConflict: "organization_id" }
  );

  logAudit({
    actorAuthId: user.id,
    action: "government.settings_updated",
    targetTable: "government_settings",
    targetId: member.organization_id,
    metadata: { authorityCode, authoritySubtype, jurisdictionCountry },
  }).catch(() => {});

  const { redirect } = await import("next/navigation");
  redirect("/government/settings?saved=1");
}

// ─── Broadcast Message ─────────────────────────────────────────────────────

export async function broadcastMessage(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (!member) return { error: "Not authorized" };

  const subject = (formData.get("subject") as string | null)?.trim();
  const body = (formData.get("body") as string | null)?.trim();
  const audience = (formData.get("audience") as string | null) ?? "all";

  if (!subject || !body) return { error: "Subject and message body are required" };
  if (subject.length > 200) return { error: "Subject too long (max 200 characters)" };
  if (body.length > 2000) return { error: "Message too long (max 2000 characters)" };

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string } | null);
  const orgName = org?.name ?? "Your Authority";

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const approvedIds = (approved ?? []).map((r) => r.professional_id);
  if (approvedIds.length === 0) return { error: "No registered professionals to message" };

  let targetIds = approvedIds;
  if (audience === "non_compliant" || audience === "at_risk") {
    const { data: wallets } = await admin
      .from("cme_wallets")
      .select("professional_id")
      .in("professional_id", approvedIds)
      .eq("compliance_status", audience);
    targetIds = (wallets ?? []).map((w) => w.professional_id);
  }

  if (targetIds.length === 0) return { error: "No professionals match the selected audience" };

  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, full_name, email")
    .in("auth_id", targetIds);

  const safeBody = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const client = pmClient();
  let sent = 0;
  let failed = 0;

  for (const profile of profiles ?? []) {
    if (!profile.email) continue;
    try {
      await client.sendEmail({
        From: FROM,
        To: profile.email,
        Subject: `[${orgName}] ${subject}`,
        HtmlBody: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px">
            <div style="background:#1a56a0;padding:20px 28px;border-radius:12px 12px 0 0">
              <span style="color:white;font-size:18px;font-weight:700">${orgName}</span>
            </div>
            <div style="background:white;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;margin:0 0 16px">Dear ${profile.full_name ?? "Healthcare Professional"},</p>
              <div style="color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap">${safeBody}</div>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0"/>
              <p style="color:#64748b;font-size:12px;margin:0">This message was sent by ${orgName} via Hayya Med Pro.</p>
            </div>
          </div>`,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  logAudit({
    actorAuthId: user.id,
    action: "government.broadcast_sent",
    targetTable: "organizations",
    targetId: orgId,
    metadata: { subject, audience, sent, failed },
  }).catch(() => {});

  return { success: true, sent, failed };
}

// ─── Invite Team Member ────────────────────────────────────────────────────

export async function inviteTeamMember(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (!member) return { error: "Only the primary government admin can invite team members" };

  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const accessLevel = (formData.get("accessLevel") as string | null) ?? "read_only";

  if (!email) return { error: "Email is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Invalid email address" };

  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string } | null);
  const orgName = org?.name ?? "Your Authority";
  const orgId = member.organization_id;

  const { data: targetProfile } = await admin
    .from("professional_profiles")
    .select("auth_id, full_name")
    .eq("email", email)
    .maybeSingle();

  if (!targetProfile) {
    return { error: "No Hayya Med Pro account found with that email. They must register first at hayyamed.pro." };
  }

  const { data: existing } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", targetProfile.auth_id)
    .eq("organization_id", orgId)
    .limit(1)
    .maybeSingle();

  if (existing) return { error: "This person is already a team member of your authority" };

  // government_staff = read-only view, government_admin = full admin
  const role = accessLevel === "admin" ? "government_admin" : "government_staff";

  const { error: insertError } = await admin.from("organization_members").insert({
    auth_id: targetProfile.auth_id,
    organization_id: orgId,
    role,
  });

  if (insertError) return { error: "Failed to add team member" };

  const client = pmClient();
  await client.sendEmail({
    From: FROM,
    To: email,
    Subject: `You've been added to ${orgName} on Hayya Med Pro`,
    HtmlBody: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px">
        <div style="background:#1a56a0;padding:20px 28px;border-radius:12px 12px 0 0">
          <span style="color:white;font-size:18px;font-weight:700">Hayya Med Pro</span>
        </div>
        <div style="background:white;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:15px;margin:0 0 16px">Dear ${targetProfile.full_name ?? "Team Member"},</p>
          <p style="color:#374151;font-size:14px;line-height:1.6">You have been added to <strong>${orgName}</strong> as a <strong>${accessLevel === "admin" ? "Government Admin" : "Staff (Read-only)"}</strong> on Hayya Med Pro.</p>
          <div style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/government" style="background:#1a56a0;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Open Dashboard</a>
          </div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
          <p style="color:#64748b;font-size:12px;margin:0">Hayya Med Pro · Healthcare Professional Platform</p>
        </div>
      </div>`,
  }).catch(() => {});

  logAudit({
    actorAuthId: user.id,
    action: "government.team_member_invited",
    targetTable: "organization_members",
    targetId: orgId,
    metadata: { email, role, orgName },
  }).catch(() => {});

  revalidatePath("/government/team");
  return { success: true };
}

// ─── Remove Team Member ────────────────────────────────────────────────────

export async function removeTeamMember(memberId: string, organizationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: self } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (!self) return { error: "Only the primary government admin can remove team members" };
  if (self.id === memberId) return { error: "You cannot remove yourself" };

  await admin
    .from("organization_members")
    .delete()
    .eq("id", memberId)
    .eq("organization_id", organizationId)
    .neq("role", "government_admin"); // prevent removing primary admin

  logAudit({
    actorAuthId: user.id,
    action: "government.team_member_removed",
    targetTable: "organization_members",
    targetId: organizationId,
    metadata: { memberId },
  }).catch(() => {});

  revalidatePath("/government/team");
  return { success: true };
}
