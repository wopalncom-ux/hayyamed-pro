"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const AUTHORITIES = [
  "QCHP", "SCFHS", "DHA", "DOH", "NHRA", "OMSB", "MOH Kuwait",
  "GMC", "NMC", "AHPRA", "NMC India", "Other",
];

export { AUTHORITIES };

export async function updateLicenseDetails(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const licenseNumber    = (formData.get("license_number")     as string ?? "").trim();
  const licensingAuth    = (formData.get("licensing_authority") as string ?? "").trim();
  const licenseExpiry    = (formData.get("license_expiry")      as string ?? "").trim();
  const profession       = (formData.get("profession")          as string ?? "").trim();
  const specialty        = (formData.get("specialty")           as string ?? "").trim();

  if (!licenseNumber) return { error: "License number is required" };

  // Validate expiry date if provided
  if (licenseExpiry) {
    const d = new Date(licenseExpiry);
    if (isNaN(d.getTime())) return { error: "Invalid expiry date" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("professional_profiles")
    .update({
      license_number:      licenseNumber,
      licensing_authority: licensingAuth || null,
      license_expiry:      licenseExpiry || null,
      profession:          profession   || null,
      specialty:           specialty    || null,
      updated_at:          new Date().toISOString(),
    })
    .eq("auth_id", user.id);

  if (error) return { error: error.message };

  logAudit({
    actorAuthId: user.id,
    action: "profile.license_updated",
    targetTable: "professional_profiles",
    metadata: { license_number: licenseNumber, licensing_authority: licensingAuth },
  });

  revalidatePath("/dashboard/licenses");
  return {};
}
