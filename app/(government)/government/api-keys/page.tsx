import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import OrgApiKeysClient from "@/components/shared/OrgApiKeysClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "API Keys — Regulatory Authority Portal" };

const SCOPE_OPTIONS = {
  "read:registry":   { label: "Read Registry",   desc: "List professionals registered with your authority, filtered by profession, status, and country" },
  "read:compliance": { label: "Read Compliance", desc: "Aggregate CME compliance data by profession and country" },
};

export default async function GovernmentApiKeysPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (!member) redirect("/government/register");

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
      apiEndpoint="/api/government/api-keys"
      description="Integrate your regulatory information system or licensing portal with the Hayya Med Pro professional registry via authenticated API calls."
    />
  );
}
