import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import FeatureFlagsClient from "./FeatureFlagsClient";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  if (!data) redirect("/dashboard");
  return user;
}

export default async function FeatureFlagsPage() {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: flags } = await admin
    .from("feature_flags")
    .select("key, enabled, enabled_plans, rollout_pct, description, updated_at")
    .order("key");

  return <FeatureFlagsClient flags={flags ?? []} />;
}
