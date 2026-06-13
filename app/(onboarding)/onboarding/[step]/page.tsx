import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { toCountryCode } from "@/lib/countryCode";
import Step1Email from "@/components/onboarding/Step1Email";
import Step2Personal from "@/components/onboarding/Step2Personal";
import Step3Professional from "@/components/onboarding/Step3Professional";
import Step4Employer from "@/components/onboarding/Step4Employer";
import Step5Cme from "@/components/onboarding/Step5Cme";
import Step6Privacy from "@/components/onboarding/Step6Privacy";
import Step7Activate from "@/components/onboarding/Step7Activate";

const STEP_LABELS = [
  "Account",
  "Personal Info",
  "Professional Info",
  "Employer",
  "CME Setup",
  "Privacy",
  "Activate",
];

const STEP_COMPONENTS = [
  Step1Email,
  Step2Personal,
  Step3Professional,
  Step4Employer,
  Step5Cme,
  Step6Privacy,
  Step7Activate,
];

export default async function OnboardingStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepParam } = await params;
  const stepNum = parseInt(stepParam, 10);

  if (isNaN(stepNum) || stepNum < 1 || stepNum > 7) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("professional_profiles")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  // Profile profession label → rules engine profession_code
  const PROFESSION_TO_CODE: Record<string, string> = {
    "Doctor (MD/MBBS)": "physician", "Specialist Doctor": "physician",
    "Consultant": "physician", "Dentist": "dentist",
    "Pharmacist": "pharmacist", "Nurse": "nurse",
  };

  const [{ data: authorities }, cmeRulesResult] = await Promise.all([
    stepNum === 3
      ? admin.from("licensing_authorities").select("id, abbreviation, authority_name, country").eq("is_active", true).order("country").order("authority_name")
      : Promise.resolve({ data: [] }),
    stepNum === 5
      ? (async () => {
          const countryCode = toCountryCode(String(profile?.country_of_residence ?? "Qatar"));
          const profCode = PROFESSION_TO_CODE[String(profile?.profession ?? "")] ?? "ahp";
          const { data } = await admin
            .from("country_compliance_rules")
            .select("total_credits_required, cycle_years, credit_terminology, profession_code")
            .eq("country_code", countryCode)
            .in("profession_code", [profCode, "all"]);
          return (
            data?.find((r) => r.profession_code === profCode) ??
            data?.find((r) => r.profession_code === "all") ??
            null
          );
        })()
      : Promise.resolve(null),
  ]);

  if (profile?.onboarding_complete) redirect("/dashboard");

  const StepComponent = STEP_COMPONENTS[stepNum - 1];

  // Referred users earn a 30-day trial; others get 14 days
  const trialDays = (user.user_metadata?.referred_by as string | undefined) ? 30 : 14;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[#64748b] mb-2">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={i + 1 === stepNum ? "text-[#1a56a0] font-medium" : i + 1 < stepNum ? "text-[#16a34a]" : ""}
            >
              {i + 1 < stepNum ? "✓" : i + 1 === stepNum ? label : ""}
            </span>
          ))}
        </div>
        <div className="w-full bg-[#e2e8f0] rounded-full h-1.5">
          <div
            className="bg-[#1a56a0] h-1.5 rounded-full transition-all"
            style={{ width: `${((stepNum - 1) / 6) * 100}%` }}
          />
        </div>
        <p className="text-sm text-[#64748b] mt-2">Step {stepNum} of 7 — {STEP_LABELS[stepNum - 1]}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8">
        {stepNum === 5 ? (
          <Step5Cme profile={profile} userId={user.id} cmeRules={cmeRulesResult} />
        ) : stepNum === 7 ? (
          <Step7Activate profile={profile} userId={user.id} trialDays={trialDays} />
        ) : (
          <StepComponent profile={profile} userId={user.id} authorities={authorities ?? []} />
        )}
      </div>
    </div>
  );
}
