import { createAdminClient } from "@/lib/supabase/server";

/**
 * Check whether a feature flag is enabled for a given subscription plan.
 * Returns false on any error — fail closed is safe for feature gating.
 *
 * @param key   The feature flag key (matches feature_flags.key)
 * @param plan  The user's current plan ('free' | 'pro' | 'employer' | 'master_admin' | 'super_admin')
 */
export async function isFeatureEnabled(key: string, plan?: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("feature_flags")
      .select("enabled, enabled_plans")
      .eq("key", key)
      .maybeSingle();

    if (!data || !data.enabled) return false;
    // null enabled_plans = available to all users regardless of plan
    if (!data.enabled_plans) return true;
    if (!plan) return false;
    return (data.enabled_plans as string[]).includes(plan);
  } catch {
    return false;
  }
}

/**
 * Check whether a kill-switch flag is active (feature should be disabled).
 * Inverse of isFeatureEnabled — used for blocking flags like 'coming_soon_mode'.
 */
export async function isKillSwitchActive(key: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("feature_flags")
      .select("enabled")
      .eq("key", key)
      .maybeSingle();
    return !!(data?.enabled);
  } catch {
    return false;
  }
}
