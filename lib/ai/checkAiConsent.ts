import { createAdminClient } from "@/lib/supabase/server";

export async function checkAiConsent(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profile_privacy_settings")
    .select("ai_data_consent")
    .eq("professional_id", userId)
    .maybeSingle();
  return data?.ai_data_consent === true;
}
