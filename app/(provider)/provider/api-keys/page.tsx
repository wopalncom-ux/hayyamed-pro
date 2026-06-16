import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import OrgApiKeysClient from "@/components/shared/OrgApiKeysClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "API Keys — Provider Portal" };

const SCOPE_OPTIONS = {
  "read:courses":     { label: "Read Courses",     desc: "List your courses with enrollment counts and completion rates" },
  "read:enrollments": { label: "Read Enrollments", desc: "List individual enrollments with learner compliance status for LMS sync" },
};

export default async function ProviderApiKeysPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("created_by", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) redirect("/provider/register");

  const { data: keys } = await admin
    .from("api_keys")
    .select("id, name, key_prefix, scopes, last_used_at, expires_at, is_active, created_at")
    .eq("organization_id", provider.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <OrgApiKeysClient
      initialKeys={keys ?? []}
      scopeOptions={SCOPE_OPTIONS}
      apiEndpoint="/api/provider/api-keys"
      description="Connect your LMS, CRM, or reporting system to Hayya Med Pro to sync course enrollments and completion data automatically."
    />
  );
}
