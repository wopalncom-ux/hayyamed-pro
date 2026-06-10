"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { calcProfileCompletion } from "@/lib/profileCompletion";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const ALLOWED_PRIVACY_FIELDS = new Set([
  "employer_can_view_cme_summary",
  "employer_can_view_certificates",
  "employer_can_view_license_expiry",
  "employer_can_view_detailed_cme_activities",
]);

export async function updatePrivacySetting(field: string, value: boolean) {
  if (!ALLOWED_PRIVACY_FIELDS.has(field)) return { error: "Invalid field" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profile_privacy_settings")
    .upsert(
      { professional_id: user.id, [field]: value },
      { onConflict: "professional_id" }
    );

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "privacy_settings.updated",
    targetTable: "profile_privacy_settings",
    targetId: user.id,
    metadata: { field, value },
  });

  revalidatePath("/dashboard/settings");
  return { error: null };
}

export async function updateProfessionalProfile({
  fullName,
  mobile,
  profession,
  specialty,
  licenseNumber,
  licensingAuthority,
  licenseExpiry,
}: {
  fullName: string;
  mobile: string;
  profession: string;
  specialty: string;
  licenseNumber: string;
  licensingAuthority: string;
  licenseExpiry: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("professional_profiles")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  const merged = {
    ...existing,
    full_name: fullName.trim() || existing?.full_name,
    mobile: mobile.trim() || existing?.mobile,
    profession: profession.trim() || existing?.profession,
    specialty: specialty.trim() || existing?.specialty,
    license_number: licenseNumber.trim() || existing?.license_number,
    licensing_authority: licensingAuthority.trim() || existing?.licensing_authority,
    license_expiry: licenseExpiry || existing?.license_expiry,
  };

  const [{ data: wallet }, { data: link }] = await Promise.all([
    admin.from("cme_wallets").select("id").eq("professional_id", user.id).maybeSingle(),
    admin.from("employer_link_requests").select("id").eq("professional_id", user.id).eq("status", "approved").maybeSingle(),
  ]);

  const pct = calcProfileCompletion(merged as Record<string, unknown>, {
    hasCmeWallet: !!wallet,
    hasEmployerLink: !!link,
  });

  const { error } = await admin
    .from("professional_profiles")
    .update({
      full_name: merged.full_name,
      mobile: merged.mobile,
      profession: merged.profession,
      specialty: merged.specialty,
      license_number: merged.license_number,
      licensing_authority: merged.licensing_authority,
      license_expiry: merged.license_expiry,
      profile_completion_pct: pct,
    })
    .eq("auth_id", user.id);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "profile.updated",
    targetTable: "professional_profiles",
    targetId: user.id,
    metadata: { fields: ["full_name", "mobile", "profession", "specialty", "license_number", "licensing_authority", "license_expiry"] },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/licenses");
  return { error: null };
}
