import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { registerGovernmentAuthority } from "./actions";

export const metadata = {
  title: "Register Authority — Hayya Med Pro",
};

const AUTHORITY_SUBTYPES = [
  { value: "national_authority", label: "National Licensing Authority" },
  { value: "health_ministry",    label: "Ministry of Health" },
  { value: "regional_authority", label: "Regional / Emirate Authority" },
  { value: "specialty_board",    label: "Specialty Board / College" },
  { value: "accreditation_body", label: "CME Accreditation Body" },
];

const COUNTRIES = [
  { code: "QA", name: "Qatar" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "EG", name: "Egypt" },
  { code: "JO", name: "Jordan" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "US", name: "United States" },
];

export default async function GovernmentRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: formError } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: existingMember } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (existingMember) redirect("/government");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-start justify-center pt-12 px-4 pb-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <a href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</a>
          <div className="mt-4 mb-3">
            <div className="inline-flex items-center gap-2 bg-[#1a56a0] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Government Portal
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#111] mb-1">Register your regulatory authority</h1>
          <p className="text-sm text-[#64748b]">
            Monitor jurisdiction-wide healthcare professional compliance across CME, licensing, and renewal cycles.
          </p>
        </div>

        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5">i</span>
          <div>
            <p className="text-sm font-semibold text-[#1e40af]">Enterprise licensing — billed via government contract</p>
            <p className="text-xs text-[#374151] mt-0.5">
              Government authority accounts are set up via an institutional agreement. Your dashboard is active immediately.
              Our team will contact you within 1 business day to confirm details and arrange verification.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8">
          {formError && (
            <div className="mb-5 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-sm text-[#dc2626]">
              {decodeURIComponent(formError)}
            </div>
          )}
          <form action={registerGovernmentAuthority} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Authority name <span className="text-[#dc2626]">*</span>
              </label>
              <input
                name="orgName"
                required
                placeholder="e.g. Qatar Council for Healthcare Practitioners"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  Authority code
                </label>
                <input
                  name="authorityCode"
                  placeholder="e.g. QCHP, SCFHS, DHA"
                  maxLength={20}
                  className={inputCls}
                />
                <p className="text-xs text-[#64748b] mt-1">Short official abbreviation</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  Jurisdiction <span className="text-[#dc2626]">*</span>
                </label>
                <select name="jurisdictionCountry" required className={inputCls}>
                  <option value="">— Select country —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Authority type <span className="text-[#dc2626]">*</span>
              </label>
              <select name="authoritySubtype" required className={inputCls}>
                <option value="">— Select type —</option>
                {AUTHORITY_SUBTYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="border-t border-[#f1f5f9] pt-5">
              <p className="text-xs text-[#64748b] mb-4">Your contact details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Your name</label>
                  <input name="contactName" placeholder="Full name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Your role</label>
                  <input name="contactRole" placeholder="e.g. Head of CME Affairs" className={inputCls} />
                </div>
              </div>
            </div>

            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
              <p className="text-xs text-[#374151] leading-relaxed">
                Healthcare professionals opt in to link their accounts with your authority. CME and licensing data is
                visible only where professionals have given consent. All data access is logged for audit compliance.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a56a0] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1547a0] transition-colors"
            >
              Register authority
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#64748b] mt-6">
          Are you a healthcare professional?{" "}
          <a href="/dashboard" className="text-[#1a56a0] hover:underline">
            Go to your dashboard
          </a>
        </p>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white";
