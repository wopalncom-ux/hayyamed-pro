import { createAdminClient } from "./supabase/server";

// Read all platform settings into a key→value map (server-side only)
export async function getPlatformSettings(): Promise<Record<string, string>> {
  const admin = createAdminClient();
  const { data } = await admin.from("platform_settings").select("key, value");
  if (!data) return {};
  return Object.fromEntries(data.map(({ key, value }) => [key, value]));
}

// Read a single setting with a typed default fallback
export async function getSetting(key: string, defaultValue: string): Promise<string> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data?.value ?? defaultValue;
}

// Pricing helpers — return numeric values with DB defaults matching migration 016
export async function getPricing() {
  const s = await getPlatformSettings();
  const n = (k: string, fallback: number) => parseFloat(s[k] ?? String(fallback));
  return {
    pro: {
      monthly:         n("pro_price_monthly", 6),
      annual:          n("pro_price_annual",  61.20),
      annualDiscountPct: n("pro_annual_discount_pct", 15),
    },
    employer: {
      annualDiscountPct: n("employer_annual_discount_pct", 15),
      clinic:     { monthly: n("employer_clinic_monthly", 50),   annual: n("employer_clinic_annual", 510),   maxStaff: parseInt(s["employer_clinic_max_staff"]     ?? "10") },
      growth:     { monthly: n("employer_growth_monthly", 100),  annual: n("employer_growth_annual", 1020),  maxStaff: parseInt(s["employer_growth_max_staff"]     ?? "25") },
      department: { monthly: n("employer_dept_monthly",   180),  annual: n("employer_dept_annual",   1836),  maxStaff: parseInt(s["employer_dept_max_staff"]       ?? "50") },
      hospital:   { monthly: n("employer_hospital_monthly", 350), annual: n("employer_hospital_annual", 3570), maxStaff: parseInt(s["employer_hospital_max_staff"] ?? "200") },
    },
    free: {
      cmeActivityLimit: parseInt(s["free_cme_activity_limit"] ?? "10"),
      licenseLimit:     parseInt(s["free_license_limit"]      ?? "1"),
    },
  };
}
