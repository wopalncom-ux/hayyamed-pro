"use client";

import { useState } from "react";
import { updatePrivacySetting } from "@/app/(dashboard)/dashboard/settings/actions";

const TOGGLES = [
  { field: "employer_can_view_cme_summary", label: "CME summary" },
  { field: "employer_can_view_certificates", label: "Certificates" },
  { field: "employer_can_view_license_expiry", label: "License expiry" },
  { field: "employer_can_view_detailed_cme_activities", label: "Detailed CME activities" },
  { field: "employer_can_view_profile_details", label: "Profile details" },
];

type PrivacySettings = Record<string, boolean>;

export default function PrivacyToggles({ initial }: { initial: PrivacySettings }) {
  const [values, setValues] = useState<PrivacySettings>(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleToggle(field: string) {
    const newVal = !values[field];
    setValues((prev) => ({ ...prev, [field]: newVal }));
    setSaving(field);
    setSaved(null);

    const result = await updatePrivacySetting(field, newVal);
    setSaving(null);

    if (result?.error) {
      // Revert on error
      setValues((prev) => ({ ...prev, [field]: !newVal }));
    } else {
      setSaved(field);
      setTimeout(() => setSaved(null), 1500);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#64748b] mb-3">
        Control what information your employer can see on their compliance dashboard.
      </p>
      {TOGGLES.map(({ field, label }) => (
        <div key={field} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
          <span className="text-sm text-[#374151]">{label}</span>
          <div className="flex items-center gap-2">
            {saved === field && (
              <span className="text-xs text-[#16a34a]">Saved</span>
            )}
            <button
              onClick={() => handleToggle(field)}
              disabled={saving === field}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${
                values[field] ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"
              }`}
              role="switch"
              aria-checked={values[field]}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  values[field] ? "translate-x-[18px]" : "translate-x-[3px]"
                }`}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
