"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logAudit } from "@/lib/audit";
import { sendGovernmentWelcomeEmail, sendGovernmentRegistrationAdminEmail } from "@/lib/email";

const AUTHORITY_SUBTYPES = [
  "national_authority",
  "regional_authority",
  "specialty_board",
  "accreditation_body",
  "health_ministry",
] as const;

const RegisterSchema = z.object({
  orgName:             z.string().min(2, "Authority name must be at least 2 characters").max(200),
  authorityCode:       z.string().max(20).optional(),
  authoritySubtype:    z.enum(AUTHORITY_SUBTYPES),
  jurisdictionCountry: z.string().length(2, "Country code must be 2 letters").toUpperCase(),
  contactName:         z.string().max(200).optional(),
  contactRole:         z.string().max(100).optional(),
});

export async function registerGovernmentAuthority(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    orgName:             formData.get("orgName") as string,
    authorityCode:       (formData.get("authorityCode") as string) || undefined,
    authoritySubtype:    formData.get("authoritySubtype") as string,
    jurisdictionCountry: formData.get("jurisdictionCountry") as string,
    contactName:         (formData.get("contactName") as string) || undefined,
    contactRole:         (formData.get("contactRole") as string) || undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/government/register?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { orgName, authorityCode, authoritySubtype, jurisdictionCountry, contactName, contactRole } = parsed.data;
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (existing) redirect("/government");

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: orgName,
      type: "regulatory_body",
      city: "—",
      country: jurisdictionCountry,
      verified: false,
    })
    .select("id")
    .single();

  if (orgError || !org) {
    redirect(`/government/register?error=${encodeURIComponent(orgError?.message ?? "Failed to create organization")}`);
  }

  const { error: memberError } = await admin
    .from("organization_members")
    .insert({ auth_id: user.id, organization_id: org.id, role: "government_admin" });

  if (memberError) {
    await admin.from("organizations").delete().eq("id", org.id);
    redirect(`/government/register?error=${encodeURIComponent(memberError.message)}`);
  }

  await admin.from("government_settings").insert({
    organization_id: org.id,
    jurisdiction_country: jurisdictionCountry,
    authority_code: authorityCode ?? null,
    authority_subtype: authoritySubtype,
  });

  logAudit({
    actorAuthId: user.id,
    action: "government.authority_registered",
    targetTable: "organizations",
    targetId: org.id,
    metadata: { name: orgName, authorityCode, authoritySubtype, jurisdictionCountry, contactName, contactRole },
  });

  const { data: profile } = await admin
    .from("professional_profiles")
    .select("email, full_name")
    .eq("auth_id", user.id)
    .maybeSingle();
  const adminName = profile?.full_name ?? contactName ?? "Administrator";
  if (profile?.email) {
    sendGovernmentWelcomeEmail({ to: profile.email, adminName, authorityName: orgName }).catch(() => {});
  }
  sendGovernmentRegistrationAdminEmail({
    authorityName: orgName,
    authorityCode,
    adminName,
    jurisdictionCountry,
    contactName,
    contactRole,
  }).catch(() => {});

  redirect("/government?setup=complete");
}
