"use client";

import { useState, useTransition } from "react";

interface PushPrefs {
  push_license_expiry:    boolean;
  push_cme_deadline:      boolean;
  push_employer_tasks:    boolean;
  push_compliance_alerts: boolean;
}

const CATEGORIES: { key: keyof PushPrefs; label: string; description: string }[] = [
  {
    key: "push_license_expiry",
    label: "License expiry reminders",
    description: "Alerts when a license is expiring within 30, 14, and 7 days",
  },
  {
    key: "push_cme_deadline",
    label: "CME deadline alerts",
    description: "Reminders when your CME cycle deadline is approaching",
  },
  {
    key: "push_employer_tasks",
    label: "Employer task assignments",
    description: "Notifications when your employer assigns a new training task",
  },
  {
    key: "push_compliance_alerts",
    label: "Compliance status alerts",
    description: "Alerts when your compliance status changes to at-risk or non-compliant",
  },
];

export default function PushPreferencesForm({ initial }: { initial: PushPrefs }) {
  const [prefs, setPrefs] = useState<PushPrefs>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function toggle(key: keyof PushPrefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const res = await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: next[key] }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? "Failed to save");
        setPrefs(prefs);
      }
    });
  }

  return (
    <div className="space-y-3">
      {CATEGORIES.map(({ key, label, description }) => (
        <div key={key} className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#111]">{label}</p>
            <p className="text-xs text-[#64748b] mt-0.5">{description}</p>
          </div>
          <button
            role="switch"
            aria-checked={prefs[key]}
            onClick={() => toggle(key)}
            disabled={isPending}
            className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30 disabled:opacity-60 ${
              prefs[key] ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                prefs[key] ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      ))}
      {saved && <p className="text-xs text-[#16a34a]">Saved</p>}
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
    </div>
  );
}
