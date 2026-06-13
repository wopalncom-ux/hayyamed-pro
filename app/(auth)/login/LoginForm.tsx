"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { track, identifyUser } from "@/lib/analytics";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Reject any next= value that isn't a same-origin relative path to prevent open redirect.
  const rawNext = searchParams.get("next") ?? "";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const errorMessages: Record<string, string> = {
    "verification-failed": "Your verification link is invalid or has expired. Please register again.",
  };
  const [error, setError] = useState<string | null>(
    errorMessages[searchParams.get("error") ?? ""] ?? null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailUnconfirmed(false);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      track("login_failed");
      // Supabase returns "Email not confirmed" for unverified accounts
      if (error.message.toLowerCase().includes("email not confirmed") || error.message.toLowerCase().includes("email_not_confirmed")) {
        setEmailUnconfirmed(true);
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    if (data.user) identifyUser(data.user.id);
    track("login_completed");
    router.push(next);
    router.refresh();
  }

  async function handleResend() {
    if (!email || resendSent) return;
    setResendLoading(true);
    const supabase = createClient();
    await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${APP_URL}/auth/callback?next=/verify-email` },
    });
    setResendLoading(false);
    setResendSent(true);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8">
      <h2 className="text-xl font-semibold text-[#111] mb-6">Sign in to your account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-[#1a56a0] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 pr-10 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#374151] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {emailUnconfirmed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-3 text-sm">
            <p className="text-yellow-800 font-medium mb-1">Email not verified</p>
            <p className="text-yellow-700 text-xs mb-2">
              Check your inbox for the verification link, or resend it below.
            </p>
            {resendSent ? (
              <p className="text-xs text-[#16a34a] font-medium">Verification email sent — check your inbox.</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || !email}
                className="text-xs text-[#1a56a0] font-medium hover:underline disabled:opacity-50"
              >
                {resendLoading ? "Sending…" : "Resend verification email →"}
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a56a0] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-[#64748b] text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#1a56a0] font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
