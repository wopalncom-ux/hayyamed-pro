"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/verify-email");
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8">
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
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#374151] mb-1">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
          />
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
