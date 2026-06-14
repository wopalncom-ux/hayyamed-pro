"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, ShieldOff, Smartphone, Download, RefreshCw, X } from "lucide-react";

type Step = "idle" | "setup-qr" | "setup-verify" | "setup-codes" | "disabling";

interface Factor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: string;
}

export default function MFAManager() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("idle");

  // Setup wizard state
  const [enrollData, setEnrollData] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Recovery codes
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [recoveryCount, setRecoveryCount] = useState<number | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState<string | null>(null);

  const loadFactors = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = (data?.totp ?? []).filter((f) => f.status === "verified");
    setFactors(verified);

    if (verified.length > 0) {
      // Count remaining recovery codes
      const { count } = await supabase
        .from("mfa_recovery_codes")
        .select("id", { count: "exact", head: true })
        .is("used_at", null);
      setRecoveryCount(count ?? 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadFactors(); }, [loadFactors]);

  async function startEnrollment() {
    setStep("setup-qr");
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Hayya Med Pro",
    });

    if (error || !data) {
      setStep("idle");
      return;
    }

    setEnrollData({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }

  async function verifyEnrollment(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollData) return;
    setVerifyError(null);
    setVerifyLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrollData.factorId,
      code: verifyCode.replace(/\s/g, ""),
    });

    if (error) {
      setVerifyError("Invalid code. Try again.");
      setVerifyLoading(false);
      return;
    }

    // MFA enabled — generate recovery codes
    setVerifyLoading(false);
    await generateRecoveryCodes(true);
  }

  async function generateRecoveryCodes(afterEnroll = false) {
    setRecoveryLoading(true);
    const res = await fetch("/api/auth/mfa/recovery", { method: "GET" });
    if (res.ok) {
      const { codes } = await res.json();
      setRecoveryCodes(codes ?? []);
      if (afterEnroll) setStep("setup-codes");
    }
    setRecoveryLoading(false);
  }

  async function disableMFA() {
    if (!factors[0]) return;
    setDisableError(null);
    setDisableLoading(true);

    const res = await fetch("/api/auth/mfa/unenroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factorId: factors[0].id }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDisableError(body.error ?? "Could not disable 2FA. Try again.");
      setDisableLoading(false);
      return;
    }

    setDisableLoading(false);
    setStep("idle");
    await loadFactors();
  }

  function copyRecoveryCodes() {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
  }

  function downloadRecoveryCodes() {
    const blob = new Blob(
      ["Hayya Med Pro — 2FA Recovery Codes\nGenerated: " + new Date().toLocaleDateString() + "\n\n" + recoveryCodes.join("\n") + "\n\nKeep these safe. Each code can only be used once."],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hayyamed-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function cancelSetup() {
    // Unenroll if in-progress
    if (enrollData) {
      const supabase = createClient();
      supabase.auth.mfa.unenroll({ factorId: enrollData.factorId }).catch(() => {});
    }
    setEnrollData(null);
    setVerifyCode("");
    setVerifyError(null);
    setRecoveryCodes([]);
    setStep("idle");
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="h-5 w-48 bg-[#f1f5f9] rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-[#f1f5f9] rounded animate-pulse" />
      </div>
    );
  }

  const isEnabled = factors.length > 0;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isEnabled ? "bg-[#dcfce7]" : "bg-[#f1f5f9]"}`}>
            {isEnabled
              ? <ShieldCheck className="w-5 h-5 text-[#16a34a]" />
              : <ShieldOff className="w-5 h-5 text-[#94a3b8]" />
            }
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#111]">Two-Factor Authentication</h2>
            <p className="text-xs text-[#64748b]">
              {isEnabled ? "2FA is active — your account is protected" : "Add an extra layer of security to your account"}
            </p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isEnabled ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
          {isEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {/* ── Idle: not enabled ── */}
      {!isEnabled && step === "idle" && (
        <div>
          <p className="text-sm text-[#374151] mb-4">
            Use an authenticator app (Google Authenticator, Authy, 1Password) to generate a time-based one-time code at every login.
          </p>
          <button
            onClick={startEnrollment}
            className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            Enable authenticator app
          </button>
        </div>
      )}

      {/* ── Setup: show QR ── */}
      {step === "setup-qr" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[#111]">Step 1 — Scan this QR code</p>
            <button onClick={cancelSetup} className="text-[#94a3b8] hover:text-[#374151]"><X className="w-4 h-4" /></button>
          </div>
          {enrollData ? (
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={enrollData.qrCode} alt="MFA QR code" className="w-44 h-44 border border-[#e2e8f0] rounded-lg p-2" />
              <div className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-center">
                <p className="text-xs text-[#64748b] mb-1">Can&apos;t scan? Enter this key manually:</p>
                <p className="text-xs font-mono text-[#111] break-all">{enrollData.secret}</p>
              </div>
              <button
                onClick={() => setStep("setup-verify")}
                className="w-full bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors"
              >
                I&apos;ve scanned it → Next
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-44">
              <div className="w-8 h-8 border-2 border-[#1a56a0] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* ── Setup: verify ── */}
      {step === "setup-verify" && enrollData && (
        <form onSubmit={verifyEnrollment}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-[#111]">Step 2 — Enter the 6-digit code</p>
            <button type="button" onClick={cancelSetup} className="text-[#94a3b8] hover:text-[#374151]"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-[#64748b] mb-4">
            Open your authenticator app and enter the code for Hayya Med Pro.
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            maxLength={6}
            required
            placeholder="000000"
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm text-center tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-[#1a56a0] mb-3"
          />
          {verifyError && (
            <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg mb-3">{verifyError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep("setup-qr")}
              className="flex-1 border border-[#e2e8f0] text-[#374151] py-2.5 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={verifyLoading || verifyCode.replace(/\s/g, "").length < 6}
              className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {verifyLoading ? "Verifying…" : "Verify & enable"}
            </button>
          </div>
        </form>
      )}

      {/* ── Setup: show recovery codes ── */}
      {step === "setup-codes" && (
        <div>
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-[#c2410c] mb-1">Save your recovery codes</p>
            <p className="text-xs text-[#92400e]">
              Each code works once. If you lose your phone, use one to access your account. Store them somewhere safe — they won&apos;t be shown again.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {recoveryCodes.map((c) => (
              <div key={c} className="bg-[#f8fafc] border border-[#e2e8f0] rounded px-3 py-2 text-sm font-mono text-[#111] text-center">
                {c}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={copyRecoveryCodes}
              className="flex-1 border border-[#e2e8f0] text-[#374151] py-2 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors"
            >
              Copy all
            </button>
            <button
              onClick={downloadRecoveryCodes}
              className="flex-1 inline-flex items-center justify-center gap-1.5 border border-[#e2e8f0] text-[#374151] py-2 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .txt
            </button>
          </div>
          <button
            onClick={() => { setStep("idle"); setRecoveryCodes([]); loadFactors(); }}
            className="w-full bg-[#16a34a] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#15803d] transition-colors"
          >
            Done — 2FA is now active
          </button>
        </div>
      )}

      {/* ── Enabled: show status ── */}
      {isEnabled && step === "idle" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-3">
            <ShieldCheck className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
            <p className="text-sm text-[#166534]">
              Authenticator app active. Your account requires a code at every login.
            </p>
          </div>

          {recoveryCount !== null && (
            <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
              <div>
                <p className="text-sm font-medium text-[#111]">Recovery codes</p>
                <p className="text-xs text-[#64748b]">{recoveryCount} unused code{recoveryCount !== 1 ? "s" : ""} remaining</p>
              </div>
              <button
                onClick={() => generateRecoveryCodes(false)}
                disabled={recoveryLoading}
                className="inline-flex items-center gap-1.5 text-sm text-[#1a56a0] font-medium hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${recoveryLoading ? "animate-spin" : ""}`} />
                Regenerate
              </button>
            </div>
          )}

          {/* Regenerated codes display */}
          {recoveryCodes.length > 0 && (
            <div>
              <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-lg p-3 mb-3">
                <p className="text-xs text-[#92400e]">New recovery codes generated. Your previous codes are now invalid. Save these.</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {recoveryCodes.map((c) => (
                  <div key={c} className="bg-[#f8fafc] border border-[#e2e8f0] rounded px-3 py-2 text-sm font-mono text-[#111] text-center">
                    {c}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <button onClick={copyRecoveryCodes} className="flex-1 border border-[#e2e8f0] text-[#374151] py-2 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors">Copy</button>
                <button onClick={downloadRecoveryCodes} className="flex-1 inline-flex items-center justify-center gap-1 border border-[#e2e8f0] text-[#374151] py-2 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-colors"><Download className="w-3.5 h-3.5" />Download</button>
              </div>
              <button onClick={() => setRecoveryCodes([])} className="text-xs text-[#94a3b8] hover:text-[#64748b] w-full text-center">Hide codes</button>
            </div>
          )}

          {disableError && (
            <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{disableError}</p>
          )}

          <button
            onClick={disableMFA}
            disabled={disableLoading}
            className="inline-flex items-center gap-2 text-sm text-[#dc2626] hover:text-[#b91c1c] font-medium disabled:opacity-50 transition-colors"
          >
            <ShieldOff className="w-4 h-4" />
            {disableLoading ? "Disabling…" : "Disable two-factor authentication"}
          </button>
        </div>
      )}
    </div>
  );
}
