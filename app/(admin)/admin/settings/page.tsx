"use client";

import { useEffect, useState, useTransition } from "react";
import { updatePlatformSettings } from "./actions";

type Setting = { key: string; value: string; description: string | null; updated_at: string };

const SETTING_GROUPS = [
  {
    title: "Pro Plan — Individual",
    keys: [
      { key: "pro_price_monthly",       label: "Monthly price (USD)",           type: "number" },
      { key: "pro_price_annual",         label: "Annual price (USD)",             type: "number" },
      { key: "pro_annual_discount_pct",  label: "Annual discount (%)",            type: "number" },
    ],
  },
  {
    title: "Employer — Clinic tier (≤10 staff)",
    keys: [
      { key: "employer_clinic_monthly",   label: "Monthly price (USD)", type: "number" },
      { key: "employer_clinic_annual",    label: "Annual price (USD)",  type: "number" },
      { key: "employer_clinic_max_staff", label: "Max staff seats",     type: "number" },
    ],
  },
  {
    title: "Employer — Growth tier (≤25 staff)",
    keys: [
      { key: "employer_growth_monthly",   label: "Monthly price (USD)", type: "number" },
      { key: "employer_growth_annual",    label: "Annual price (USD)",  type: "number" },
      { key: "employer_growth_max_staff", label: "Max staff seats",     type: "number" },
    ],
  },
  {
    title: "Employer — Department tier (≤50 staff)",
    keys: [
      { key: "employer_dept_monthly",   label: "Monthly price (USD)", type: "number" },
      { key: "employer_dept_annual",    label: "Annual price (USD)",  type: "number" },
      { key: "employer_dept_max_staff", label: "Max staff seats",     type: "number" },
    ],
  },
  {
    title: "Employer — Hospital tier (≤200 staff)",
    keys: [
      { key: "employer_hospital_monthly",   label: "Monthly price (USD)", type: "number" },
      { key: "employer_hospital_annual",    label: "Annual price (USD)",  type: "number" },
      { key: "employer_hospital_max_staff", label: "Max staff seats",     type: "number" },
    ],
  },
  {
    title: "Annual discount",
    keys: [
      { key: "employer_annual_discount_pct", label: "Employer annual discount (%)", type: "number" },
    ],
  },
  {
    title: "Free tier limits",
    keys: [
      { key: "free_cme_activity_limit", label: "Max CME activities (Free)", type: "number" },
      { key: "free_license_limit",      label: "Max licenses (Free)",       type: "number" },
    ],
  },
];

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [dirty, setDirty]       = useState<Record<string, string>>({});
  const [saved, setSaved]       = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/platform-settings")
      .then((r) => r.json())
      .then(({ settings: rows }: { settings: Setting[] }) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => { map[r.key] = r.value; });
        setSettings(map);
      });
  }, []);

  function handleChange(key: string, value: string) {
    setDirty((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    if (!Object.keys(dirty).length) return;
    startTransition(async () => {
      await updatePlatformSettings(dirty);
      setSettings((prev) => ({ ...prev, ...dirty }));
      setDirty({});
      setSaved(true);
    });
  }

  const get = (key: string) => dirty[key] ?? settings[key] ?? "";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Platform Settings</h1>
          <p className="text-sm text-[#64748b] mt-1">Control all plan prices and feature limits from here.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || !Object.keys(dirty).length}
          className="bg-[#1a56a0] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      <div className="space-y-6">
        {SETTING_GROUPS.map((group) => (
          <div key={group.title} className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-sm font-semibold text-[#111] mb-4 uppercase tracking-wide">{group.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.keys.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-[#64748b] mb-1">{label}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={get(key)}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                  />
                  {dirty[key] !== undefined && (
                    <p className="text-xs text-[#d97706] mt-1">Unsaved: {dirty[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
