import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
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

  if (profile?.onboarding_complete) redirect("/dashboard");

  const StepComponent = STEP_COMPONENTS[stepNum - 1];

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
        <StepComponent profile={profile} userId={user.id} />
      </div>
    </div>
  );
}
