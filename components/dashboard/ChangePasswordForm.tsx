"use client";

import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setNewPassword("");
    setConfirm("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-[#374151] mb-1">New password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full text-sm px-3 py-2 pr-10 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#1a56a0]"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#374151] transition-colors"
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {newPassword.length > 0 && (
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
        <label className="block text-xs font-medium text-[#374151] mb-1">Confirm new password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Repeat new password"
            className="w-full text-sm px-3 py-2 pr-10 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#1a56a0]"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#374151] transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
      {success && <p className="text-xs text-[#16a34a]">Password updated successfully.</p>}

      <button
        type="submit"
        disabled={loading}
        className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
