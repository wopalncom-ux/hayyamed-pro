"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Settings</h1>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Privacy Settings</h2>
          <p className="text-sm text-[#64748b] mb-4">
            Control what information your employer can see on their dashboard.
          </p>
          <a href="/onboarding/6" className="text-sm text-[#1a56a0] hover:underline">
            Manage privacy settings
          </a>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Employer Link</h2>
          <p className="text-sm text-[#64748b] mb-4">
            Manage your employer linking requests.
          </p>
          <a href="/onboarding/4" className="text-sm text-[#1a56a0] hover:underline">
            Manage employer link
          </a>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Account</h2>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="text-sm text-[#dc2626] hover:underline disabled:opacity-50"
          >
            {loading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
