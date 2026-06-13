"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const RegisterSchema = z.object({
  orgName:     z.string().min(2, "Organization name must be at least 2 characters").max(200),
  orgType:     z.enum(["hospital", "clinic", "pharmacy", "laboratory", "university", "government", "other"]),
  city:        z.string().min(1, "City is required").max(100),
  country:     z.string().length(2, "Country code must be 2 letters").toUpperCase(),
  contactName: z.string().max(200).optional(),
  contactRole: z.string().max(100).optional(),
});

export async function registerEmployer(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    orgName:     formData.get("orgName") as string,
    orgType:     formData.get("orgType") as string,
    city:        formData.get("city") as string,
    country:     formData.get("country") as string,
    contactName: (formData.get("contactName") as string) || undefined,
    contactRole: (formData.get("contactRole") as string) || undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/employer/register?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { orgName, orgType, city, country } = parsed.data;
  const admin = createAdminClient();

  // Already an employer_admin → go to portal
  const { data: existing } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (existing) redirect("/employer");

  // Server-side gate: must have an active employer subscription
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("professional_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  if (!sub || sub.plan !== "employer") {
    redirect("/pricing?source=employer_register_gate");
  }

  // Create organization (unverified — admin must verify)
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: orgName, type: orgType, city, country, verified: false })
    .select("id")
    .single();

  if (orgError || !org) {
    redirect(`/employer/register?error=${encodeURIComponent(orgError?.message ?? "Failed to create organization")}`);
  }

  // Grant employer_admin role
  const { error: memberError } = await admin
    .from("organization_members")
    .insert({ auth_id: user.id, organization_id: org.id, role: "employer_admin" });

  if (memberError) {
    await admin.from("organizations").delete().eq("id", org.id);
    redirect(`/employer/register?error=${encodeURIComponent(memberError.message)}`);
  }

  logAudit({
    actorAuthId: user.id,
    action: "employer.organization_registered",
    targetTable: "organizations",
    targetId: org.id,
    metadata: { name: orgName, type: orgType, city, country },
  });

  redirect("/employer?setup=complete");
}
