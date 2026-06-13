"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

const PRIVACY_FIELDS = [
  { id: "employer_can_view_cme_summary", label: "CME credit summary", description: "Total credits earned and compliance status", defaultOn: true },
  { id: "employer_can_view_license_expiry", label: "License expiry date", description: "When your license expires", defaultOn: true },
  { id: "employer_can_view_profile_details", label: "Profile details", description: "Your name, profession, and specialty", defaultOn: true },
  { id: "employer_can_view_detailed_cme_activities", label: "Detailed CME activities", description: "Individual course names, providers, and dates", defaultOn: false },
  { id: "employer_can_view_certificates", label: "CME certificates", description: "Uploaded certificate files", defaultOn: false },
];

export default function Step6Privacy({ profile, userId }: { profile: Record<string, unknown> | null; userId: string; authorities?: unknown[] }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(PRIVACY_FIELDS.map(f => [f.id, f.defaultOn]))
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: privError } = await supabase.from("profile_privacy_settings").upsert({
      professional_id: userId,
      ...settings,
    }, { onConflict: "professional_id" });

    if (privError) { setError(privError.message); setLoading(false); return; }

    await supabase.from("professional_profiles").update({ onboarding_step: 7 }).eq("auth_id", userId);
    track("onboarding_step_completed", { step: 6, step_name: "privacy", employer_visible: Object.values(settings).filter(Boolean).length });
    router.push("/onboarding/7");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-1">Privacy Settings</h2>
      <p className="text-sm text-[#64748b] mb-4">
        Choose what your employer can see on their compliance dashboard. You can change these anytime in Settings.
      </p>

      <div className="space-y-3">
        {PRIVACY_FIELDS.map(field => (
          <div key={field.id} className="flex items-start gap-3 p-4 border border-[#e2e8f0] rounded-lg">
            <input
              type="checkbox"
              id={field.id}
              checked={settings[field.id]}
              onChange={(e) => setSettings(s => ({ ...s, [field.id]: e.target.checked }))}
              className="mt-0.5 w-4 h-4 rounded border-[#e2e8f0] text-[#1a56a0] focus:ring-[#1a56a0]"
            />
            <div>
              <label htmlFor={field.id} className="text-sm font-medium text-[#111] cursor-pointer">{field.label}</label>
              <p className="text-xs text-[#64748b] mt-0.5">{field.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#64748b]">
        Your employer cannot edit your profile or certificates. They can only view what you allow here.
      </p>

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/5")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          Back
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
