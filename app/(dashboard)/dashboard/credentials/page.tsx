import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";
import CredentialsVault from "@/components/dashboard/CredentialsVault";

export const metadata = {
  title: "Credentials Vault — Hayya Med Pro",
  description: "Track the expiry of your medical license, BLS/ACLS, malpractice insurance, Dataflow, visa and more — all in one place.",
};

const FREE_LIMIT = 3;

export default async function CredentialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [{ data: credentials }, plan] = await Promise.all([
    admin
      .from("professional_credentials")
      .select("id, credential_type, title, issuing_authority, credential_number, issue_date, expiry_date, document_url, notes")
      .eq("professional_id", user.id)
      .order("expiry_date", { ascending: true, nullsFirst: false }),
    getUserPlan(user.id),
  ]);

  return (
    <CredentialsVault
      initialCredentials={credentials ?? []}
      pro={isPro(plan)}
      freeLimit={FREE_LIMIT}
    />
  );
}
