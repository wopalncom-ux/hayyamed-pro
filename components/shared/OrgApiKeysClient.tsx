"use client";

import { useState, useTransition, useCallback } from "react";

export type ScopeOption = { label: string; desc: string };

type ApiKey = {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

function SecretReveal({ fullKey }: { fullKey: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 bg-[#0f1f3d] rounded-xl p-4">
      <p className="text-xs font-semibold text-[#fcd34d] mb-2">
        Copy your API key now — it will never be shown again.
      </p>
      <div className="flex items-center gap-2">
        <code className="text-xs text-[#a5f3fc] font-mono break-all flex-1">{fullKey}</code>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(fullKey); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function KeyCard({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (id: string) => Promise<void> }) {
  const [confirm, setConfirm] = useState(false);
  const [revoking, startRevoke] = useTransition();
  const isExpired = apiKey.expires_at && new Date(apiKey.expires_at) < new Date();
  const lastUsed  = apiKey.last_used_at
    ? new Date(apiKey.last_used_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Never";

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-semibold text-[#0f1f3d]">{apiKey.name}</p>
            {isExpired ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#dc2626]">Expired</span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d]">Active</span>
            )}
          </div>
          <code className="text-xs text-[#64748b] font-mono">{apiKey.key_prefix}••••••••••••</code>
        </div>
        {!confirm ? (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#fee2e2] text-[#dc2626] hover:bg-[#fef2f2] transition-colors flex-shrink-0"
          >
            Revoke
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-[#dc2626]">Sure?</span>
            <button
              type="button"
              disabled={revoking}
              onClick={() => startRevoke(() => onRevoke(apiKey.id))}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#dc2626] text-white hover:bg-[#b91c1c]"
            >
              {revoking ? "…" : "Yes"}
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="text-xs text-[#64748b]">Cancel</button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {apiKey.scopes.map((s) => (
          <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0f7ff] text-[#1a56a0] border border-[#bfdbfe]">
            {s}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-[#64748b] pt-3 border-t border-[#f8fafc]">
        <span>Last used: <span className="text-[#64748b]">{lastUsed}</span></span>
        {apiKey.expires_at && (
          <span>Expires: <span className="text-[#64748b]">{new Date(apiKey.expires_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span></span>
        )}
        <span>Created: <span className="text-[#64748b]">{new Date(apiKey.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span></span>
      </div>
    </div>
  );
}

function CreateKeyForm({
  scopeOptions,
  apiEndpoint,
  onCreated,
}: {
  scopeOptions: Record<string, ScopeOption>;
  apiEndpoint: string;
  onCreated: (key: ApiKey, fullKey: string) => void;
}) {
  const defaultScope = Object.keys(scopeOptions)[0];
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<Set<string>>(new Set([defaultScope]));
  const [expiresInDays, setExpiresInDays] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggleScope = (s: string) => {
    setScopes((prev) => { const n = new Set(prev); if (n.has(s)) n.delete(s); else n.add(s); return n; });
  };

  const submit = () => {
    if (!name.trim() || scopes.size === 0) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          scopes: Array.from(scopes),
          ...(expiresInDays ? { expires_in_days: parseInt(expiresInDays) } : {}),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Failed to create key");
        return;
      }
      const { key } = await res.json();
      const { full_key, ...rest } = key;
      onCreated(rest, full_key);
      setName(""); setScopes(new Set([defaultScope])); setExpiresInDays("");
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <h3 className="text-sm font-semibold text-[#0f1f3d] mb-4">Generate new API key</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="key-name" className="block text-xs font-semibold text-[#374151] mb-1">
            Key name <span className="text-[#dc2626]">*</span>
          </label>
          <input
            id="key-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. LMS Integration, Reporting System"
            maxLength={100}
            className="w-full text-sm px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0]"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#374151] mb-2">Scopes <span className="text-[#dc2626]">*</span></p>
          <div className="space-y-2">
            {Object.entries(scopeOptions).map(([key, { label, desc }]) => (
              <label key={key} className={`flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border transition-colors ${scopes.has(key) ? "border-[#1a56a0] bg-[#f0f7ff]" : "border-[#e2e8f0] hover:border-[#bfdbfe]"}`}>
                <input
                  type="checkbox"
                  checked={scopes.has(key)}
                  onChange={() => toggleScope(key)}
                  className="mt-0.5 rounded border-[#e2e8f0] text-[#1a56a0]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#0f1f3d]">{label}</p>
                  <p className="text-[10px] text-[#64748b]">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="expires" className="block text-xs font-semibold text-[#374151] mb-1">Expiry (optional)</label>
          <select
            id="expires"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
          >
            <option value="">Never expires</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">1 year</option>
          </select>
        </div>
        {error && <p className="text-xs text-[#dc2626]">{error}</p>}
        <button
          type="button"
          disabled={pending || !name.trim() || scopes.size === 0}
          onClick={submit}
          className="w-full bg-[#1a56a0] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {pending ? "Generating…" : "Generate key"}
        </button>
      </div>
    </div>
  );
}

export default function OrgApiKeysClient({
  initialKeys,
  scopeOptions,
  apiEndpoint,
  description,
}: {
  initialKeys: ApiKey[];
  scopeOptions: Record<string, ScopeOption>;
  apiEndpoint: string;
  description: string;
}) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [newKeyData, setNewKeyData] = useState<{ key: ApiKey; fullKey: string } | null>(null);

  const handleCreated = useCallback((key: ApiKey, fullKey: string) => {
    setKeys((prev) => [key, ...prev]);
    setNewKeyData({ key, fullKey });
  }, []);

  const handleRevoke = useCallback(async (id: string) => {
    await fetch(apiEndpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setKeys((prev) => prev.filter((k) => k.id !== id));
    if (newKeyData?.key.id === id) setNewKeyData(null);
  }, [apiEndpoint, newKeyData]);

  const activeKeys = keys.filter((k) => k.is_active);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f1f3d] mb-1">API Keys</h1>
        <p className="text-sm text-[#64748b]">{description}</p>
      </div>

      {newKeyData && (
        <div className="mb-6">
          <SecretReveal fullKey={newKeyData.fullKey} />
          <button
            type="button"
            onClick={() => setNewKeyData(null)}
            className="mt-2 text-xs text-[#64748b] hover:text-[#374151] underline"
          >
            I&apos;ve saved my key — dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {activeKeys.length === 0 && !newKeyData && (
            <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] rounded-xl px-5 py-8 text-center">
              <p className="text-sm font-medium text-[#374151] mb-1">No API keys yet</p>
              <p className="text-xs text-[#64748b]">Generate a key to start integrating with your systems.</p>
            </div>
          )}
          {activeKeys.map((key) => (
            <KeyCard key={key.id} apiKey={key} onRevoke={handleRevoke} />
          ))}
        </div>
        <div className="space-y-4">
          {activeKeys.length < 10 && (
            <CreateKeyForm scopeOptions={scopeOptions} apiEndpoint={apiEndpoint} onCreated={handleCreated} />
          )}
          <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-[#1e40af] mb-2">Authentication</p>
            <p className="text-xs text-[#1e40af] mb-2">
              Pass your key as the <code className="bg-[#dbeafe] px-1 rounded font-mono">X-Api-Key</code> header on every request.
            </p>
            <pre className="text-[10px] text-[#1e40af] bg-[#dbeafe] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`curl https://hayyamed.pro/api/v1/faculty \\
  -H "X-Api-Key: hmp_live_YOUR_KEY"`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
