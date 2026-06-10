"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sends code as a query param; exchange it for a session
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setError("Invalid or expired reset link. Please request a new one.");
        else setReady(true);
      });
    } else {
      // Check if already has a recovery session (hash-based flow)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
        else setError("Invalid or expired reset link. Please request a new one.");
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) { setError(error.message); return; }

    router.push("/dashboard");
    router.refresh();
  }

  if (!ready && !error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 text-center">
        <p className="text-sm text-[#64748b]">Verifying reset link...</p>
      </div>
    );
  }

  if (error && !ready) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 text-center">
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <a href="/forgot-password" className="text-sm text-[#1a56a0] hover:underline">
          Request a new reset link
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8">
      <h2 className="text-xl font-semibold text-[#111] mb-6">Set new password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">New password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
            placeholder="Min. 8 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Confirm password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
            placeholder="Repeat password"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
