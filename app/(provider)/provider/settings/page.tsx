import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Provider Settings — Hayya Med Pro" };

export default async function ProviderSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("*")
    .eq("created_by", user.id)
    .eq("status", "active")
    .single();

  if (!provider) redirect("/provider/register");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Provider Settings</h1>

      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4 max-w-xl">
        <div>
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Organization</p>
          <p className="text-sm font-semibold text-[#111]">{provider.name}</p>
        </div>
        <div>
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Country</p>
          <p className="text-sm text-[#374151]">{provider.country_code}</p>
        </div>
        {provider.contact_email && (
          <div>
            <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Contact Email</p>
            <p className="text-sm text-[#374151]">{provider.contact_email}</p>
          </div>
        )}
        {provider.website_url && (
          <div>
            <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Website</p>
            <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1a56a0] hover:underline">
              {provider.website_url}
            </a>
          </div>
        )}
        {provider.is_accredited && (
          <div>
            <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Accreditation</p>
            <p className="text-sm text-[#374151]">{provider.accreditor ?? "Accredited"}</p>
          </div>
        )}
        <div className="pt-2 border-t border-[#f1f5f9]">
          <p className="text-xs text-[#94a3b8]">
            To update your organization details, contact{" "}
            <a href="mailto:support@hayyamed.com" className="text-[#1a56a0] hover:underline">
              support@hayyamed.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
