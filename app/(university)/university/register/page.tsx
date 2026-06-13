import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { registerUniversity } from "./actions";

export const metadata = {
  title: "Register University — Hayya Med Pro",
};

const ORG_SUBTYPES = [
  { value: "medical_school",    label: "Medical School / College of Medicine" },
  { value: "nursing_college",   label: "College of Nursing" },
  { value: "pharmacy_college",  label: "College of Pharmacy" },
  { value: "health_sciences",   label: "College of Health Sciences" },
  { value: "other",             label: "Other Health Professions School" },
];

const FACULTY_SIZES = [
  { value: "1-50",     label: "1–50 faculty" },
  { value: "51-200",   label: "51–200 faculty" },
  { value: "201-500",  label: "201–500 faculty" },
  { value: "500+",     label: "500+ faculty" },
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

export default async function UniversityRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: formError } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // If already a university_admin → go to dashboard
  const { data: existingMember } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "university_admin")
    .maybeSingle();

  if (existingMember) redirect("/university");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-start justify-center pt-12 px-4 pb-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</a>
          <div className="mt-4 mb-3">
            <div className="inline-flex items-center gap-2 bg-[#1a56a0] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              🎓 University Portal
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#111] mb-1">Register your institution</h1>
          <p className="text-sm text-[#64748b]">
            Manage faculty and alumni CME compliance across your entire medical school.
          </p>
        </div>

        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-[#1e40af]">Enterprise billing — no credit card required</p>
            <p className="text-xs text-[#374151] mt-0.5">
              University accounts are billed via annual institutional contract.
              Your dashboard is active immediately. Our team will contact you within 1 business day to confirm details.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8">
          {formError && (
            <div className="mb-5 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-sm text-[#dc2626]">
              {decodeURIComponent(formError)}
            </div>
          )}
          <form action={registerUniversity} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Institution name <span className="text-[#dc2626]">*</span>
              </label>
              <input
                name="orgName"
                required
                placeholder="e.g. Weill Cornell Medicine – Qatar"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Institution type <span className="text-[#dc2626]">*</span>
              </label>
              <select name="orgSubtype" required className={inputCls}>
                <option value="">— Select type —</option>
                {ORG_SUBTYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Approximate faculty size
              </label>
              <select name="facultyCount" className={inputCls}>
                <option value="">— Select range —</option>
                {FACULTY_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  City <span className="text-[#dc2626]">*</span>
                </label>
                <input name="city" required placeholder="e.g. Doha" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  Country <span className="text-[#dc2626]">*</span>
                </label>
                <select name="country" required className={inputCls}>
                  <option value="">— Select —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
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
                  <input name="contactRole" placeholder="e.g. CME Director" className={inputCls} />
                </div>
              </div>
            </div>

            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
              <p className="text-xs text-[#374151] leading-relaxed">
                Your institution dashboard is activated immediately. Faculty can link their existing Hayya Med Pro
                accounts to your institution, or register via your invitation link. CME compliance data is only
                visible where faculty have given consent.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a56a0] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1547a0] transition-colors"
            >
              Register institution
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-6">
          Already a healthcare professional?{" "}
          <a href="/dashboard" className="text-[#1a56a0] hover:underline">
            Go to your dashboard
          </a>
        </p>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white";
