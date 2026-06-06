"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Step7Activate({ profile, userId }: { profile: Record<string, unknown> | null; userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleActivate() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("professional_profiles")
      .update({ onboarding_complete: true, onboarding_step: 7, profile_completion_pct: 80 })
      .eq("auth_id", userId);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#111] mb-2">You&apos;re all set!</h2>
        <p className="text-sm text-[#64748b]">
          Your Hayya Med PRO profile is ready. Your CME wallet is active and your license countdown has started.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <SummaryItem label="Profile" value={String(profile?.full_name ?? "—")} />
        <SummaryItem label="Profession" value={String(profile?.profession ?? "—")} />
        <SummaryItem label="Specialty" value={String(profile?.specialty ?? "—")} />
        <SummaryItem label="License" value={String(profile?.license_number ?? "—")} />
        <SummaryItem label="Authority" value={String(profile?.licensing_authority ?? "—")} />
      </div>

      <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] mb-6">
        Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with your relevant regulatory body (e.g. QCHP).
      </div>

      <button
        onClick={handleActivate}
        disabled={loading}
        className="w-full bg-[#1a56a0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
      >
        {loading ? "Activating..." : "Go to Dashboard"}
      </button>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#f0f4f8]">
      <span className="text-sm text-[#64748b]">{label}</span>
      <span className="text-sm font-medium text-[#111]">{value}</span>
    </div>
  );
}
