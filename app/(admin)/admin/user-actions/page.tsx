"use client";
import { useState } from "react";

type UserResult = {
  auth_id: string; full_name: string; profession: string; country_of_residence: string;
  onboarding_complete: boolean; onboarding_step: number; profile_completion_pct: number; created_at: string;
  subscription: { plan: string; status: string } | null;
  wallet: { completed_credits: number; required_credits: number; compliance_status: string } | null;
  cme_count: number;
};

type ActionResult = { success?: boolean; message?: string; error?: string; data?: unknown };

export default function UserActionsPage() {
  const [search, setSearch]       = useState("");
  const [users, setUsers]         = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected]   = useState<UserResult | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody]   = useState("");
  const [trialDays, setTrialDays]   = useState(7);
  const [running, setRunning]       = useState(false);
  const [result, setResult]         = useState<ActionResult | null>(null);
  const [exportJson, setExportJson] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (search.length < 2) return;
    setSearching(true); setUsers([]); setSelected(null); setResult(null);
    const res = await fetch(`/api/admin/user-actions?search=${encodeURIComponent(search)}`);
    const json = await res.json();
    setUsers(json.users ?? []);
    setSearching(false);
  };

  const runAction = async (action: string, params: Record<string, unknown> = {}) => {
    if (!selected) return;
    setRunning(true); setResult(null); setExportJson(null);
    const res = await fetch("/api/admin/user-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_id: selected.auth_id, action, params }),
    });
    const json: ActionResult = await res.json();
    if (action === "export_data" && json.data) {
      setExportJson(JSON.stringify(json.data, null, 2));
    }
    setResult(json);
    setRunning(false);
    setActiveAction(null);
  };

  const downloadExport = () => {
    if (!exportJson || !selected) return;
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_export_${selected.auth_id.slice(-8)}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">User Quick Actions</h1>
        <p className="text-[#64748b] mt-1">Look up any user and perform admin operations — email, trial, onboarding, GDPR export.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or paste auth_id (UUID)…"
          className="flex-1 border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56a0]" />
        <button type="submit" disabled={searching || search.length < 2}
          className="px-6 py-3 bg-[#1a56a0] text-white text-sm font-medium rounded-xl hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Results */}
      {users.length > 0 && !selected && (
        <div className="space-y-2 mb-6">
          {users.map((u) => (
            <button key={u.auth_id} onClick={() => { setSelected(u); setResult(null); setActiveAction(null); }}
              className="w-full text-left bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a56a0]/10 flex items-center justify-center text-sm font-bold text-[#1a56a0] flex-shrink-0">
                  {u.full_name?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0f172a]">{u.full_name ?? "—"}</p>
                  <p className="text-xs text-[#64748b] capitalize">{u.profession ?? "—"} · {u.country_of_residence ?? "—"}</p>
                </div>
                <div className="flex gap-2 text-xs flex-shrink-0">
                  <span className={`px-2 py-1 rounded-full font-medium ${u.onboarding_complete ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fef9c3] text-[#92400e]"}`}>
                    {u.onboarding_complete ? "Onboarded" : `Step ${u.onboarding_step ?? 1}/7`}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[#f1f5f9] text-[#374151]">
                    {u.subscription ? `${u.subscription.plan} · ${u.subscription.status}` : "Free"}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[#f1f5f9] text-[#374151]">{u.cme_count} CME</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {users.length === 0 && search.length >= 2 && !searching && (
        <div className="text-center py-10 text-[#64748b] text-sm">No users found matching &quot;{search}&quot;</div>
      )}

      {/* User detail + actions */}
      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#0f172a]">User Profile</h2>
                <button onClick={() => { setSelected(null); setUsers([]); setSearch(""); }}
                  className="text-xs text-[#64748b] hover:text-[#374151]">← Back</button>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#1a56a0]/10 flex items-center justify-center text-xl font-bold text-[#1a56a0] mb-4">
                {selected.full_name?.charAt(0) ?? "?"}
              </div>
              <p className="text-base font-bold text-[#0f172a]">{selected.full_name}</p>
              <p className="text-xs text-[#64748b] capitalize mt-0.5">{selected.profession} · {selected.country_of_residence}</p>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#64748b]">Auth ID</span><span className="font-mono text-[#374151]">{selected.auth_id.slice(-8)}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Joined</span><span className="text-[#374151]">{new Date(selected.created_at).toLocaleDateString("en-GB")}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Onboarding</span>
                  <span className={selected.onboarding_complete ? "text-[#16a34a] font-medium" : "text-[#d97706]"}>
                    {selected.onboarding_complete ? "Complete" : `Step ${selected.onboarding_step ?? 1}/7`}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-[#64748b]">Profile</span><span className="text-[#374151]">{selected.profile_completion_pct ?? 0}%</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Plan</span><span className="text-[#374151] capitalize">{selected.subscription ? `${selected.subscription.plan} (${selected.subscription.status})` : "Free"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">CME entries</span><span className="text-[#374151]">{selected.cme_count}</span></div>
                {selected.wallet && (
                  <>
                    <div className="flex justify-between"><span className="text-[#64748b]">Credits</span><span className="text-[#374151]">{selected.wallet.completed_credits}/{selected.wallet.required_credits}</span></div>
                    <div className="flex justify-between"><span className="text-[#64748b]">Compliance</span>
                      <span className={selected.wallet.compliance_status === "compliant" ? "text-[#16a34a] font-medium" : "text-[#dc2626] font-medium"}>
                        {selected.wallet.compliance_status}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {result && (
              <div className={`rounded-xl border p-4 text-sm ${result.error ? "bg-red-50 border-red-200 text-red-700" : "bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]"}`}>
                <p className="font-semibold">{result.error ? "Error" : "✓ Done"}</p>
                <p className="text-xs mt-1">{result.error ?? result.message}</p>
                {exportJson && (
                  <button onClick={downloadExport}
                    className="mt-2 text-xs px-3 py-1.5 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d]">
                    Download JSON
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action panel */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-[#0f172a]">Admin Actions</h2>

            {/* Quick actions */}
            {[
              { id: "complete_onboarding", label: "✅ Mark Onboarding Complete", desc: "Sets onboarding_complete=true, step=7", danger: false, confirm: true },
              { id: "reset_onboarding",    label: "↩ Reset Onboarding to Step 1", desc: "Clears onboarding_complete, resets step to 1", danger: true, confirm: true },
              { id: "export_data",         label: "📦 Export Full User Data (GDPR)", desc: "Downloads profile, CME, subscriptions, audit log as JSON", danger: false, confirm: false },
            ].map((act) => (
              <div key={act.id} className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">{act.label}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{act.desc}</p>
                  </div>
                  <button
                    onClick={() => { if (act.confirm && !confirm(`Run: ${act.label}?`)) return; runAction(act.id); }}
                    disabled={running}
                    className={`ml-4 px-4 py-2 text-xs font-medium rounded-lg transition-colors flex-shrink-0 ${
                      act.danger ? "border border-red-200 text-red-600 hover:bg-red-50" : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
                    } disabled:opacity-50`}>
                    {running && activeAction === act.id ? "Running…" : "Run"}
                  </button>
                </div>
              </div>
            ))}

            {/* Grant trial */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
              <p className="text-sm font-medium text-[#0f172a] mb-1">🎁 Grant Pro Trial</p>
              <p className="text-xs text-[#64748b] mb-3">Upsert a Pro subscription in trialing status. Does not charge the user.</p>
              <div className="flex items-center gap-3">
                <input type="number" min={1} max={90} value={trialDays} onChange={(e) => setTrialDays(parseInt(e.target.value))}
                  className="w-24 border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56a0]" />
                <span className="text-xs text-[#64748b]">days</span>
                <button onClick={() => runAction("grant_trial", { days: trialDays })} disabled={running}
                  className="px-4 py-2 bg-[#1a56a0] text-white text-xs font-medium rounded-lg hover:bg-[#1547a0] disabled:opacity-50">
                  Grant Trial
                </button>
              </div>
            </div>

            {/* Send email */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
              <p className="text-sm font-medium text-[#0f172a] mb-1">✉️ Send Custom Email</p>
              <p className="text-xs text-[#64748b] mb-3">Send a one-off email directly to this user via Postmark.</p>
              {activeAction === "send_email" ? (
                <div className="space-y-3">
                  <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject line…"
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
                  <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Email body (plain HTML accepted)…"
                    rows={4}
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0] resize-none" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => runAction("send_email", { subject: emailSubject, html_body: emailBody })}
                      disabled={running || !emailSubject || !emailBody}
                      className="px-4 py-2 bg-[#1a56a0] text-white text-xs font-medium rounded-lg disabled:opacity-50">
                      {running ? "Sending…" : "Send Email"}
                    </button>
                    <button onClick={() => { setActiveAction(null); setEmailSubject(""); setEmailBody(""); }}
                      className="px-4 py-2 border border-[#e2e8f0] text-[#64748b] text-xs rounded-lg hover:bg-[#f0f4f8]">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setActiveAction("send_email")}
                  className="px-4 py-2 bg-[#1a56a0] text-white text-xs font-medium rounded-lg hover:bg-[#1547a0]">
                  Compose Email
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
