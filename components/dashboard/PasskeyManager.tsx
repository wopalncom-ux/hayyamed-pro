"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Key, Plus, Trash2, ShieldCheck } from "lucide-react";

interface PasskeyFactor {
  id: string;
  friendly_name?: string;
  created_at: string;
}

function base64urlToBuffer(b64: string): ArrayBuffer {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const buf = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return buf;
}

function bufferToBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encodeCredential(credential: PublicKeyCredential): string {
  const resp = credential.response as AuthenticatorAttestationResponse;
  return JSON.stringify({
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64url(resp.clientDataJSON),
      attestationObject: bufferToBase64url(resp.attestationObject),
    },
  });
}

function decodeCreationOptions(raw: Record<string, unknown>): PublicKeyCredentialCreationOptions {
  return {
    ...(raw as unknown as PublicKeyCredentialCreationOptions),
    challenge: base64urlToBuffer(raw.challenge as string),
    user: {
      ...((raw.user ?? {}) as PublicKeyCredentialUserEntity),
      id: base64urlToBuffer(((raw.user as Record<string, string>)?.id) ?? ""),
    },
    excludeCredentials: ((raw.excludeCredentials ?? []) as Array<{ id: string; type: string; transports?: AuthenticatorTransport[] }>).map((c) => ({
      ...c,
      type: "public-key" as const,
      id: base64urlToBuffer(c.id),
    })),
  };
}

export default function PasskeyManager() {
  const [supported, setSupported] = useState<boolean>(false);
  const [factors, setFactors] = useState<PasskeyFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
      !!window.PublicKeyCredential
    );
  }, []);

  const loadFactors = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all: any[] = (data as any)?.all ?? [];
    const webauthn = all.filter(
      (f) => f.factor_type === "webauthn" && f.status === "verified"
    ) as PasskeyFactor[];
    setFactors(webauthn);
    setLoading(false);
  }, []);

  useEffect(() => { loadFactors(); }, [loadFactors]);

  async function addPasskey() {
    setEnrolling(true);
    setError(null);
    setSuccess(false);
    const supabase = createClient();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: enrollErr } = await (supabase.auth.mfa as any).enroll({
        factorType: "webauthn",
        friendlyName: `Passkey – ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
      });

      if (enrollErr) throw new Error(enrollErr.message ?? "Enrollment failed");
      if (!data?.webauthn?.credential_creation_options) {
        throw new Error("Passkeys are not yet enabled for this account. Please contact support.");
      }

      const options = decodeCreationOptions(data.webauthn.credential_creation_options as Record<string, unknown>);
      const credential = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential | null;
      if (!credential) throw new Error("Passkey creation was cancelled.");

      const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({
        factorId: data.id,
        code: encodeCredential(credential),
      });

      if (verifyErr) throw new Error(verifyErr.message);
      setSuccess(true);
      await loadFactors();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add passkey. Try again.";
      setError(msg);
    } finally {
      setEnrolling(false);
    }
  }

  async function removePasskey(factorId: string) {
    setRemoving(factorId);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.mfa.unenroll({ factorId });
    if (err) setError(err.message);
    else await loadFactors();
    setRemoving(null);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="h-5 w-40 bg-[#f1f5f9] rounded animate-pulse mb-2" />
        <div className="h-4 w-56 bg-[#f1f5f9] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${factors.length > 0 ? "bg-[#dcfce7]" : "bg-[#f1f5f9]"}`}>
            <Key className={`w-5 h-5 ${factors.length > 0 ? "text-[#16a34a]" : "text-[#64748b]"}`} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#111]">Passkeys</h2>
            <p className="text-xs text-[#64748b]">
              {factors.length > 0
                ? `${factors.length} passkey${factors.length > 1 ? "s" : ""} registered`
                : "Sign in with Face ID, Touch ID, or device PIN — no password needed"}
            </p>
          </div>
        </div>
        {factors.length > 0 && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#16a34a]">
            Active
          </span>
        )}
      </div>

      {!supported && (
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-lg px-4 py-3 text-sm text-[#92400e] mb-4">
          Your browser does not support passkeys. Use Chrome, Safari, or Edge on a modern device.
        </div>
      )}

      {/* Registered passkeys list */}
      {factors.length > 0 && (
        <div className="space-y-2 mb-4">
          {factors.map((f) => (
            <div key={f.id} className="flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#111]">{f.friendly_name ?? "Passkey"}</p>
                  <p className="text-xs text-[#64748b]">
                    Added {f.created_at ? new Date(f.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removePasskey(f.id)}
                disabled={removing === f.id}
                className="text-[#dc2626] hover:text-[#b91c1c] disabled:opacity-50 transition-colors p-1 rounded"
                aria-label="Remove passkey"
              >
                <Trash2 className={`w-4 h-4 ${removing === f.id ? "animate-pulse" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {factors.length === 0 && supported && (
        <p className="text-sm text-[#374151] mb-4">
          Add a passkey to sign in using your device&apos;s biometrics or PIN. Passkeys are faster and more secure than passwords.
        </p>
      )}

      {success && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-3 text-sm text-[#166534] mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          Passkey added successfully. You can now sign in with your device.
        </div>
      )}

      {error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3 text-sm text-[#dc2626] mb-4">
          {error}
        </div>
      )}

      {supported && (
        <button
          onClick={addPasskey}
          disabled={enrolling}
          className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {enrolling ? "Setting up passkey…" : "Add passkey"}
        </button>
      )}
    </div>
  );
}
