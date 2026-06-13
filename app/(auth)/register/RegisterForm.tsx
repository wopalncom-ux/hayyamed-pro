"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "", color: "" };
  if (pw.length < 8)   return { score: 1, label: "Too short", color: "#dc2626" };
  let score = 1;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { score: 2, label: "Weak",   color: "#d97706" };
  if (score === 3) return { score: 3, label: "Fair",   color: "#f59e0b" };
  if (score === 4) return { score: 4, label: "Good",   color: "#16a34a" };
  return              { score: 5, label: "Strong", color: "#059669" };
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteOrgName, setInviteOrgName] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    track("signup_started");
    const ref = searchParams.get("ref");
    if (ref) {
      sessionStorage.setItem("referral_code", ref);
      fetch(`/api/referral/lookup?code=${encodeURIComponent(ref)}`)
        .then((r) => r.json())
        .then(({ firstName }: { firstName: string | null }) => {
          if (firstName) {
            setReferrerName(firstName);
            track("referral_banner_shown", { referral_code: ref });
          }
        })
        .catch(() => {});
    }
    const invite = searchParams.get("invite");
    if (invite) {
      sessionStorage.setItem("employer_invite", invite);
      // Fetch org name for the invite banner (public name only)
      const supabase = createClient();
      supabase
        .from("organizations")
        .select("name")
        .eq("id", invite)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.name) setInviteOrgName(data.name);
          else setInviteOrgName("your employer");
        });
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const refCode = sessionStorage.getItem("referral_code") ?? undefined;
    const inviteOrgId = sessionStorage.getItem("employer_invite") ?? undefined;
    const metadata: Record<string, string> = {};
    if (refCode) metadata.referred_by = refCode;
    if (inviteOrgId) metadata.pending_employer_invite = inviteOrgId;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/verify-email`,
        data: Object.keys(metadata).length > 0 ? metadata : undefined,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    track("signup_submitted");
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8">
      {referrerName && (
        <div className="mb-5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-3 flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5" aria-hidden>🎁</span>
          <div className="text-sm">
            <p className="font-semibold text-[#166534]">
              {referrerName} invited you to Hayya Med Pro
            </p>
            <p className="text-[#15803d] mt-0.5">
              You&apos;ll get a <strong>30-day Pro trial</strong> — double the standard 14 days — when you create your account today.
            </p>
          </div>
        </div>
      )}
      {inviteOrgName && (
        <div className="mb-5 bg-[#e8f0fe] border border-[#bfdbfe] rounded-lg px-4 py-3 text-sm text-[#1a56a0]">
          <span className="font-semibold">You've been invited</span> — complete registration to link your account to{" "}
          <span className="font-semibold">{inviteOrgName}</span> on Hayya Med Pro.
        </div>
      )}
      <h2 className="text-xl font-semibold text-[#111] mb-2">Create your account</h2>
      <p className="text-sm text-[#64748b] mb-6">Step 1 of 7 — you can save and continue later</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-1">
            Work email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            placeholder="you@hospital.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 pr-10 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
              placeholder="Min. 8 characters"
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
          {password.length > 0 && (
            <div className="mt-2" aria-live="polite" aria-label={`Password strength: ${strength.label}`}>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: strength.score >= seg + 1 ? strength.color : "#e2e8f0" }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#374151] mb-1">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 pr-10 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#374151] transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a56a0] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-xs text-[#64748b] text-center mt-4">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-[#1a56a0] hover:underline">Terms of Service</Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#1a56a0] hover:underline">Privacy Policy</Link>.
      </p>

      <p className="text-sm text-[#64748b] text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-[#1a56a0] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
