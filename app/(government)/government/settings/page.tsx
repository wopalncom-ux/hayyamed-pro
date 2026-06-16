import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateGovernmentSettings } from "./actions";

export const metadata = { title: "Authority Settings — Hayya Med Pro" };

type SearchParams = Promise<{ saved?: string; error?: string }>;

const AUTHORITY_SUBTYPES = [
  { value: "national_authority",  label: "National Authority" },
  { value: "regional_authority",  label: "Regional Authority" },
  { value: "specialty_board",     label: "Specialty Board" },
  { value: "accreditation_body",  label: "Accreditation Body" },
  { value: "health_ministry",     label: "Ministry of Health" },
] as const;

const COUNTRY_OPTIONS = [
  { code: "QA", label: "Qatar" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "AE", label: "UAE" },
  { code: "KW", label: "Kuwait" },
  { code: "BH", label: "Bahrain" },
  { code: "OM", label: "Oman" },
  { code: "GB", label: "United Kingdom" },
  { code: "IN", label: "India" },
  { code: "AU", label: "Australia" },
  { code: "EG", label: "Egypt" },
  { code: "JO", label: "Jordan" },
];

export default async function GovernmentSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const { saved, error: errorMsg } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name, verified)")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) redirect("/government/register");

  const { data: settings } = await admin
    .from("government_settings")
    .select("*")
    .eq("organization_id", member.organization_id)
    .maybeSingle();

  const _orgs = member.organizations as { name: string; verified: boolean }[] | { name: string; verified: boolean } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string; verified: boolean } | null);
  const orgName = org?.name ?? "Your Authority";

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Authority Settings</h1>
        <p className="text-sm text-[#64748b] mt-1">{orgName}</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] text-sm font-medium px-4 py-3 rounded-lg mb-5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Settings saved successfully.
        </div>
      )}
      {errorMsg && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-sm font-medium px-4 py-3 rounded-lg mb-5">
          {decodeURIComponent(errorMsg)}
        </div>
      )}

      <form action={updateGovernmentSettings} className="space-y-6">
        {/* Authority identity */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[#111]">Authority Identity</h2>

          <div>
            <label htmlFor="authorityCode" className="block text-sm font-medium text-[#374151] mb-1.5">
              Authority Code <span className="text-[#dc2626]">*</span>
            </label>
            <input
              id="authorityCode"
              name="authorityCode"
              type="text"
              required
              minLength={2}
              maxLength={20}
              defaultValue={settings?.authority_code ?? ""}
              placeholder="e.g. QCHP, SCFHS, DHA"
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            />
            <p className="text-xs text-[#94a3b8] mt-1">Abbreviated identifier used in reports and certificates.</p>
          </div>

          <div>
            <label htmlFor="authoritySubtype" className="block text-sm font-medium text-[#374151] mb-1.5">
              Authority Type <span className="text-[#dc2626]">*</span>
            </label>
            <select
              id="authoritySubtype"
              name="authoritySubtype"
              required
              defaultValue={settings?.authority_subtype ?? "national_authority"}
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            >
              {AUTHORITY_SUBTYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="jurisdictionCountry" className="block text-sm font-medium text-[#374151] mb-1.5">
              Jurisdiction Country <span className="text-[#dc2626]">*</span>
            </label>
            <select
              id="jurisdictionCountry"
              name="jurisdictionCountry"
              required
              defaultValue={settings?.jurisdiction_country ?? "QA"}
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            >
              {COUNTRY_OPTIONS.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scope */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[#111]">Professional Scope</h2>

          <div>
            <label htmlFor="professionScope" className="block text-sm font-medium text-[#374151] mb-1.5">
              Regulated Professions
            </label>
            <input
              id="professionScope"
              name="professionScope"
              type="text"
              maxLength={500}
              defaultValue={(settings?.profession_scope ?? []).join(", ")}
              placeholder="e.g. physician, nurse, pharmacist, dentist"
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            />
            <p className="text-xs text-[#94a3b8] mt-1">
              Comma-separated list. Leave blank to cover all professions.
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[#111]">External Links</h2>

          <div>
            <label htmlFor="licenseRenewalUrl" className="block text-sm font-medium text-[#374151] mb-1.5">
              License Renewal URL
            </label>
            <input
              id="licenseRenewalUrl"
              name="licenseRenewalUrl"
              type="url"
              maxLength={500}
              defaultValue={settings?.license_renewal_url ?? ""}
              placeholder="https://www.qchp.org.qa/renewal"
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            />
            <p className="text-xs text-[#94a3b8] mt-1">
              Shown to professionals whose license is expiring soon as a direct renewal link.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto text-sm font-semibold bg-[#1a56a0] text-white px-6 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
