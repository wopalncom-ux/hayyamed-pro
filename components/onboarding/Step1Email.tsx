"use client";

import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

export default function Step1Email({ profile, userId }: { profile: Record<string, unknown> | null; userId: string; authorities?: unknown[] }) {
  const router = useRouter();

  // Step 1 is account creation (done at /register).
  // If user lands here after email verify, push them to step 2.
  if (profile?.onboarding_step && Number(profile.onboarding_step) > 1) {
    router.replace("/onboarding/2");
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#111] mb-2">Account created</h2>
      <p className="text-sm text-[#64748b] mb-6">
        Your email has been verified. Let&apos;s set up your professional profile.
      </p>
      <button
        onClick={() => { track("onboarding_step_completed", { step: 1, step_name: "account" }); router.push("/onboarding/2"); }}
        className="bg-[#1a56a0] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors"
      >
        Continue to Personal Info
      </button>
    </div>
  );
}
