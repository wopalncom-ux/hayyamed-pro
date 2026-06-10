"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function VerifyEmailPage() {
  useEffect(() => { track("signup_completed"); }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 text-center">
      <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#111] mb-2">Check your email</h2>
      <p className="text-sm text-[#64748b] mb-6">
        We sent a verification link to your email address. Click the link to activate your account and continue setup.
      </p>
      <p className="text-xs text-[#64748b]">
        Didn&apos;t receive it? Check your spam folder or{" "}
        <a href="/register" className="text-[#1a56a0] hover:underline">try again</a>.
      </p>
    </div>
  );
}
