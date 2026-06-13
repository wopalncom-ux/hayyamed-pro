import { createAdminClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StaffImportClient from "./StaffImportClient";

export const metadata = { title: "Import Staff — Employer" };

export default async function StaffImportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("org_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) redirect("/employer/register");

  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Your Organization";

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Import Staff</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Upload a CSV to bulk-add healthcare professionals to <strong>{orgName}</strong>.
          Existing Hayya Med Pro users are linked automatically; new emails receive an invitation.
        </p>
      </div>

      {/* CSV format guide */}
      <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-[#1a56a0] mb-2">CSV format</h2>
        <p className="text-xs text-[#374151] mb-2">Required column: <code className="bg-white px-1 py-0.5 rounded border border-[#e2e8f0]">email</code></p>
        <p className="text-xs text-[#374151] mb-3">Optional columns: <code className="bg-white px-1 py-0.5 rounded border border-[#e2e8f0]">first_name</code>, <code className="bg-white px-1 py-0.5 rounded border border-[#e2e8f0]">last_name</code>, <code className="bg-white px-1 py-0.5 rounded border border-[#e2e8f0]">department</code></p>
        <pre className="text-xs bg-white border border-[#e2e8f0] rounded p-3 overflow-x-auto text-[#374151]">{`email,first_name,last_name,department
dr.ali@hospital.qa,Ali,Al-Rashid,Cardiology
dr.sara@clinic.qa,Sara,Mohammed,Emergency
nurse.james@hospital.qa,James,Smith,ICU`}</pre>
        <p className="text-xs text-[#64748b] mt-2">Maximum 200 rows per import. Comma or semicolon delimited.</p>
      </div>

      <StaffImportClient />
    </div>
  );
}
