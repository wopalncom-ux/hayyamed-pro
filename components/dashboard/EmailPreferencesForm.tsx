"use client";

import { useState, useTransition } from "react";
import { updateEmailPreferences } from "@/app/(dashboard)/dashboard/settings/actions";

interface Prefs {
  email_cme_verified:    boolean;
  email_cme_deadline:    boolean;
  email_license_expiry:  boolean;
  email_trial_reminders: boolean;
  email_employer_tasks:  boolean;
}

const FIELDS: { key: keyof Prefs; label: string; sub: string }[] = [
  {
    key:   "email_cme_verified",
    label: "CME activity verified / rejected",
    sub:   "Email when an admin verifies or rejects a submitted CME activity",
  },
  {
    key:   "email_cme_deadline",
    label: "CME cycle deadline reminders",
    sub:   "Reminder emails at 30 and 7 days before your CME cycle ends",
  },
  {
    key:   "email_license_expiry",
    label: "License expiry reminders",
    sub:   "Email at 90, 60, 30, 14 and 7 days before your license expires",
  },
  {
    key:   "email_trial_reminders",
    label: "Pro trial reminders",
    sub:   "Email when your trial is ending soon and when it has expired",
  },
  {
    key:   "email_employer_tasks",
    label: "Employer compliance tasks",
    sub:   "Email when your employer assigns a compliance task or reminder",
  },
];

export default function EmailPreferencesForm({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [savedKey, setSavedKey] = useState<keyof Prefs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function toggle(key: keyof Prefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setError(null);
    setSavedKey(null);

    startTransition(async () => {
      const result = await updateEmailPreferences(next);
      if (result.error) {
        // Revert on failure
        setPrefs(prefs);
        setError(result.error);
      } else {
        setSavedKey(key);
        setTimeout(() => setSavedKey(null), 1500);
      }
    });
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-[#dc2626] mb-3">{error}</p>
      )}
      <div className="space-y-1">
        {FIELDS.map(({ key, label, sub }) => (
          <div
            key={key}
            className="flex items-start justify-between py-3.5 border-b border-[#f8fafc] last:border-0 gap-4"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111]">{label}</p>
              <p className="text-xs text-[#64748b] mt-0.5">{sub}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {savedKey === key && (
                <span className="text-xs text-[#16a34a]">Saved</span>
              )}
              <button
                role="switch"
                aria-checked={prefs[key]}
                onClick={() => toggle(key)}
                disabled={isPending}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1a56a0] disabled:opacity-50 ${
                  prefs[key] ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                    prefs[key] ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#94a3b8] mt-4">
        Account security emails (password reset, email verification) cannot be disabled.
      </p>
    </div>
  );
}
