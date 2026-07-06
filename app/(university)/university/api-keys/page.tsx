import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import OrgApiKeysClient from "@/components/shared/OrgApiKeysClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "API Keys — University Portal" };

const SCOPE_OPTIONS = {
  "read:faculty":    { label: "Read Faculty",    desc: "List linked faculty members with names, professions, and departments" },
  "read:compliance": { label: "Read Compliance", desc: "Query CME compliance status, credit progress, and gaps for all faculty" },
};

export default async function UniversityApiKeysPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "university_admin")
    .limit(1)
    .maybeSingle();

  if (!member) redirect("/university/register");

  const { data: keys } = await admin
    .from("api_keys")
    .select("id, name, key_prefix, scopes, last_used_at, expires_at, is_active, created_at")
    .eq("organization_id", member.organization_id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <OrgApiKeysClient
      initialKeys={keys ?? []}
      scopeOptions={SCOPE_OPTIONS}
      apiEndpoint="/api/university/api-keys"
      description="Connect your LMS, student information system, or reporting tools to Hayya Med Pro via authenticated API calls."
    />
  );
}
