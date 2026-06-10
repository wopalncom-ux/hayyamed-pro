"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { track, identifyUser } from "@/lib/analytics";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      track("login_failed");
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) identifyUser(data.user.id);
    track("login_completed");
    router.push("/dashboard");
    router.refresh();
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
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
