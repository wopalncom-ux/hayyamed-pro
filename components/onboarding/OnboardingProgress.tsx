"use client";

import { useTranslations } from "next-intl";

export default function OnboardingProgress({ stepNum }: { stepNum: number }) {
  const t = useTranslations("onboarding");

  const STEP_LABELS = [
    t("step_account"),
    t("step_personal"),
    t("step_professional"),
    t("step_employer"),
    t("step_cme"),
    t("step_privacy"),
    t("step_activate"),
  ];

  return (
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
      <p className="text-sm text-[#64748b] mt-2">
        {t("step_progress", { step: stepNum, label: STEP_LABELS[stepNum - 1] })}
      </p>
    </div>
  );
}
