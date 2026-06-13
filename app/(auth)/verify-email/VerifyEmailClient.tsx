"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

export default function VerifyEmailClient({ email }: { email: string | null }) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendEmail, setResendEmail] = useState(email ?? "");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        track("signup_completed");
        setVerified(true);
        setTimeout(() => router.push("/onboarding/1"), 800);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
        track("signup_completed");
        setVerified(true);
        setTimeout(() => router.push("/onboarding/1"), 800);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function handleResend() {
    const emailToSend = resendEmail.trim();
    if (!emailToSend) return;
    setResendStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: emailToSend,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/verify-email` },
    });
    setResendStatus(error ? "error" : "sent");
  }

  if (verified) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 text-center">
        <div className="w-12 h-12 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#111] mb-2">Email verified!</h2>
        <p className="text-sm text-[#64748b]">Taking you to set up your profile…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 text-center">
      <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#111] mb-2">Check your email</h2>
      <p className="text-sm text-[#64748b] mb-6">
        We sent a verification link{email ? ` to ${email}` : ""}. Click it to activate your account and start setup.
      </p>

      {/* Resend section */}
      {resendStatus === "sent" ? (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-[#16a34a] font-medium">Email resent — check your inbox (and spam folder).</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {!email && (
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            />
          )}
          <button
            onClick={handleResend}
            disabled={resendStatus === "sending" || !resendEmail.trim()}
            className="w-full border border-[#1a56a0] text-[#1a56a0] py-2.5 rounded-lg text-sm font-medium hover:bg-[#f0f7ff] disabled:opacity-50 transition-colors"
          >
            {resendStatus === "sending" ? "Sending…" : "Resend verification email"}
          </button>
          {resendStatus === "error" && (
            <p className="text-xs text-[#dc2626]">Could not resend — try again or contact support.</p>
          )}
        </div>
      )}

      <p className="text-xs text-[#94a3b8]">
        Wrong email?{" "}
        <a href="/register" className="text-[#1a56a0] hover:underline">Start over with a different address</a>
      </p>
    </div>
  );
}
