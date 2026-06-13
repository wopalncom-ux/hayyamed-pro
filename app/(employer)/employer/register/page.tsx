import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { registerEmployer } from "./actions";

export const metadata = {
  title: "Register as Employer — Hayya Med Pro",
};

const ORG_TYPES = [
  { value: "hospital",    label: "Hospital" },
  { value: "clinic",      label: "Clinic / Medical Center" },
  { value: "pharmacy",    label: "Pharmacy" },
  { value: "laboratory",  label: "Laboratory / Diagnostics" },
  { value: "university",  label: "University / Medical School" },
  { value: "government",  label: "Government / Regulatory Body" },
  { value: "other",       label: "Other Healthcare Organization" },
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

export default async function EmployerRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; welcome?: string }>;
}) {
  const { error: formError, welcome } = await searchParams;
  const isPostPurchase = welcome === "1";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // If already an employer_admin → go to dashboard
  const [existingMember, subRes] = await Promise.all([
    admin
      .from("organization_members")
      .select("id")
      .eq("auth_id", user.id)
      .eq("role", "employer_admin")
      .maybeSingle(),
    admin
      .from("subscriptions")
      .select("plan, status")
      .eq("professional_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle(),
  ]);

  if (existingMember.data) redirect("/employer");

  // Must have an active employer subscription to access registration
  if (!subRes.data || subRes.data.plan !== "employer") {
    redirect("/pricing?source=employer_register_gate");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-start justify-center pt-12 px-4 pb-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</span>
          {isPostPurchase ? (
            <>
              <div className="mt-4 mb-3">
                <div className="inline-flex items-center gap-2 bg-[#d97706] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  ✓ Employer plan active — Step 1 of 2
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#111] mb-1">Register your organization</h1>
              <p className="text-sm text-[#64748b]">
                Last step before you can see your team&apos;s compliance. Takes 2 minutes.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#111] mt-3 mb-1">Register Your Organization</h1>
              <p className="text-sm text-[#64748b]">
                Set up your employer account to manage staff CME compliance and licensing.
              </p>
            </>
          )}
        </div>

        {isPostPurchase && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-5 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#15803d]">Payment confirmed — employer plan is active</p>
              <p className="text-xs text-[#64748b] mt-0.5">
                Register your organization below, then share a link with your staff to start tracking compliance.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8">
          {formError && (
            <div className="mb-5 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-sm text-[#dc2626]">
              {decodeURIComponent(formError)}
            </div>
          )}
          <form action={registerEmployer} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Organization name <span className="text-[#dc2626]">*</span>
              </label>
              <input
                name="orgName"
                required
                placeholder="e.g. Hamad Medical Corporation"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Organization type <span className="text-[#dc2626]">*</span>
              </label>
              <select name="orgType" required className={inputCls}>
                <option value="">— Select type —</option>
                {ORG_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  City <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  name="city"
                  required
                  placeholder="e.g. Doha"
                  className={inputCls}
                />
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
              <p className="text-xs text-[#64748b] mb-4">Your contact details (optional)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Your name</label>
                  <input name="contactName" placeholder="Full name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Your role</label>
                  <input name="contactRole" placeholder="e.g. HR Director" className={inputCls} />
                </div>
              </div>
            </div>

            <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-lg p-4">
              <p className="text-xs text-[#374151] leading-relaxed">
                Your organization will be registered and you&apos;ll have immediate access to the employer dashboard.
                Our team will verify your organization details within 1–2 business days.
                You can start adding staff and managing compliance right away.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a56a0] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1547a0] transition-colors"
            >
              Register organization
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
