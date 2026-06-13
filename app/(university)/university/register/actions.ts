"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logAudit } from "@/lib/audit";
import { sendUniversityWelcomeEmail, sendUniversityRegistrationAdminEmail } from "@/lib/email";

const RegisterSchema = z.object({
  orgName:       z.string().min(2, "University name must be at least 2 characters").max(200),
  orgSubtype:    z.enum(["medical_school", "nursing_college", "pharmacy_college", "health_sciences", "other"]),
  city:          z.string().min(1, "City is required").max(100),
  country:       z.string().length(2, "Country code must be 2 letters").toUpperCase(),
  contactName:   z.string().max(200).optional(),
  contactRole:   z.string().max(100).optional(),
  facultyCount:  z.string().max(10).optional(),
});

export async function registerUniversity(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    orgName:      formData.get("orgName") as string,
    orgSubtype:   formData.get("orgSubtype") as string,
    city:         formData.get("city") as string,
    country:      formData.get("country") as string,
    contactName:  (formData.get("contactName") as string) || undefined,
    contactRole:  (formData.get("contactRole") as string) || undefined,
    facultyCount: (formData.get("facultyCount") as string) || undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/university/register?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { orgName, orgSubtype, city, country, contactName, contactRole, facultyCount } = parsed.data;
  const admin = createAdminClient();

  // Already a university_admin → go to portal
  const { data: existing } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "university_admin")
    .maybeSingle();

  if (existing) redirect("/university");

  // Create organization (unverified — admin verifies and activates billing separately)
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: orgName, type: "university", city, country, verified: false })
    .select("id")
    .single();

  if (orgError || !org) {
    redirect(`/university/register?error=${encodeURIComponent(orgError?.message ?? "Failed to create organization")}`);
  }

  // Grant university_admin role immediately
  const { error: memberError } = await admin
    .from("organization_members")
    .insert({ auth_id: user.id, organization_id: org.id, role: "university_admin" });

  if (memberError) {
    await admin.from("organizations").delete().eq("id", org.id);
    redirect(`/university/register?error=${encodeURIComponent(memberError.message)}`);
  }

  logAudit({
    actorAuthId: user.id,
    action: "university.organization_registered",
    targetTable: "organizations",
    targetId: org.id,
    metadata: { name: orgName, subtype: orgSubtype, city, country, contactName, contactRole, facultyCount },
  });

  // Fire-and-forget: welcome email to registrant + admin notification
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("email, full_name")
    .eq("auth_id", user.id)
    .maybeSingle();
  const adminName = profile?.full_name ?? contactName ?? "University Administrator";
  if (profile?.email) {
    sendUniversityWelcomeEmail({
      to: profile.email,
      adminName,
      universityName: orgName,
    }).catch(() => {});
  }
  sendUniversityRegistrationAdminEmail({
    universityName: orgName,
    adminName,
    city,
    country,
    facultyCount,
    contactName,
    contactRole,
  }).catch(() => {});

  redirect("/university?setup=complete");
}
