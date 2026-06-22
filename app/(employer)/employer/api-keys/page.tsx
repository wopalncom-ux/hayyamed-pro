import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ApiKeysClient from "./ApiKeysClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "API Keys" };

export default async function ApiKeysPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) redirect("/employer/register");

  const { data: keys } = await admin
    .from("api_keys")
    .select("id, name, key_prefix, scopes, last_used_at, expires_at, is_active, created_at")
    .eq("organization_id", member.organization_id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return <ApiKeysClient initialKeys={keys ?? []} />;
}
