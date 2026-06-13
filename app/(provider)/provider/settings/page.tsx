import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProviderSettingsForm from "@/components/provider/ProviderSettingsForm";

export const metadata = { title: "Provider Settings — Hayya Med Pro" };

export default async function ProviderSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name, description, website_url, contact_email, country_code, is_accredited, accreditor")
    .eq("created_by", user.id)
    .eq("status", "active")
    .single();

  if (!provider) redirect("/provider/register");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Provider Settings</h1>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 max-w-xl">
        <ProviderSettingsForm provider={provider} />
      </div>
    </div>
  );
}
