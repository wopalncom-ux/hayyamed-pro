"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const AUTHORITY_SUBTYPES = [
  "national_authority",
  "regional_authority",
  "specialty_board",
  "accreditation_body",
  "health_ministry",
] as const;

const SettingsSchema = z.object({
  authorityCode: z.string().min(2).max(20).toUpperCase(),
  authoritySubtype: z.enum(AUTHORITY_SUBTYPES),
  jurisdictionCountry: z.string().length(2).toUpperCase(),
  professionScope: z.string().max(500),
  licenseRenewalUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export async function updateGovernmentSettings(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) redirect("/government/register");

  const raw = {
    authorityCode: formData.get("authorityCode")?.toString() ?? "",
    authoritySubtype: formData.get("authoritySubtype")?.toString() ?? "national_authority",
    jurisdictionCountry: formData.get("jurisdictionCountry")?.toString() ?? "",
    professionScope: formData.get("professionScope")?.toString() ?? "",
    licenseRenewalUrl: formData.get("licenseRenewalUrl")?.toString() ?? "",
  };

  const parsed = SettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    redirect(`/government/settings?error=${encodeURIComponent(first ?? "Invalid input")}`);
  }

  const { authorityCode, authoritySubtype, jurisdictionCountry, professionScope, licenseRenewalUrl } = parsed.data;

  const professions = professionScope
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await admin
    .from("government_settings")
    .upsert(
      {
        organization_id: member.organization_id,
        authority_code: authorityCode,
        authority_subtype: authoritySubtype,
        jurisdiction_country: jurisdictionCountry,
        profession_scope: professions.length > 0 ? professions : null,
        license_renewal_url: licenseRenewalUrl || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "organization_id" }
    );

  if (error) {
    console.error("government_settings upsert error", error);
    redirect("/government/settings?error=Failed+to+save+settings");
  }

  logAudit({
    actorAuthId: user.id,
    action: "government.settings_updated",
    targetTable: "government_settings",
    targetId: member.organization_id,
    metadata: { authorityCode, authoritySubtype, jurisdictionCountry },
  }).catch(() => {});

  redirect("/government/settings?saved=1");
}
