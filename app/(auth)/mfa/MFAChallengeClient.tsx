"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, KeyRound } from "lucide-react";

type Mode = "totp" | "recovery";

export default function MFAChallengeClient({ destination }: { destination: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("totp");

  async function handleTOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totpFactor = factors?.totp?.[0];

    if (!totpFactor) {
      // No MFA factor found — session is fine, just redirect
      router.push(destination);
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: totpFactor.id,
      code: code.replace(/\s/g, ""),
    });

    if (error) {
      setError("Invalid code. Check your authenticator app and try again.");
      setLoading(false);
      return;
    }

    router.push(destination);
    router.refresh();
  }

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/mfa/recovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.replace(/[\s-]/g, "").toUpperCase() }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Invalid recovery code.");
      setLoading(false);
      return;
    }

    // MFA factor removed server-side — redirect
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-[#1a56a0]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#111]">Two-Factor Authentication</h2>
          <p className="text-xs text-[#64748b]">
            {mode === "totp"
              ? "Enter the 6-digit code from your authenticator app"
              : "Enter one of your 8-character recovery codes"}
          </p>
        </div>
      </div>

      {mode === "totp" ? (
        <form onSubmit={handleTOTP} className="space-y-4">
          <div>
            <label htmlFor="totp-code" className="block text-sm font-medium text-[#374151] mb-1">
              Authenticator code
            </label>
            <input
              id="totp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
              placeholder="000000"
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm text-center tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.replace(/\s/g, "").length < 6}
            className="w-full bg-[#1a56a0] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Verifying…" : "Verify and sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRecovery} className="space-y-4">
          <div>
            <label htmlFor="recovery-code" className="block text-sm font-medium text-[#374151] mb-1">
              Recovery code
            </label>
            <input
              id="recovery-code"
              type="text"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="XXXX-XXXX"
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm text-center tracking-[0.2em] font-mono focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
            />
            <p className="text-xs text-[#64748b] mt-1">
              Using a recovery code will disable 2FA. Re-enable it in Settings afterward.
            </p>
          </div>

          {error && (
            <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.replace(/[\s-]/g, "").length < 8}
            className="w-full bg-[#1a56a0] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Verifying…" : "Use recovery code"}
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-[#f1f5f9] text-center">
        {mode === "totp" ? (
          <button
            onClick={() => { setMode("recovery"); setCode(""); setError(null); }}
            className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Use a recovery code instead
          </button>
        ) : (
          <button
            onClick={() => { setMode("totp"); setCode(""); setError(null); }}
            className="text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors"
          >
            ← Back to authenticator code
          </button>
        )}
      </div>
    </div>
  );
}
