"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Credential = {
  id: string;
  credential_type: string;
  title: string;
  issuing_authority: string | null;
  credential_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  document_url: string | null;
  notes: string | null;
};

const TYPES: { value: string; label: string }[] = [
  { value: "medical_license", label: "Medical License" },
  { value: "bls", label: "BLS" },
  { value: "acls", label: "ACLS" },
  { value: "pals", label: "PALS" },
  { value: "nrp", label: "NRP" },
  { value: "atls", label: "ATLS" },
  { value: "malpractice_insurance", label: "Malpractice / Indemnity Insurance" },
  { value: "dataflow_psv", label: "Dataflow PSV Report" },
  { value: "good_standing", label: "Certificate of Good Standing" },
  { value: "passport", label: "Passport" },
  { value: "visa", label: "Visa / Residency" },
  { value: "qid", label: "QID / National ID" },
  { value: "degree", label: "Degree Certificate" },
  { value: "board_certification", label: "Board Certification" },
  { value: "other", label: "Other" },
];
const typeLabel = (v: string) => TYPES.find((t) => t.value === v)?.label ?? "Other";

type Status = { key: "expired" | "soon" | "valid" | "none"; label: string; cls: string; dot: string };
function statusOf(expiry: string | null): Status {
  if (!expiry) return { key: "none", label: "No expiry", cls: "bg-slate-100 text-slate-600", dot: "#94a3b8" };
  const days = Math.ceil((new Date(expiry + "T00:00:00").getTime() - Date.now()) / 86400000);
  if (days < 0) return { key: "expired", label: `Expired ${Math.abs(days)}d ago`, cls: "bg-red-50 text-[#dc2626]", dot: "#dc2626" };
  if (days <= 60) return { key: "soon", label: `Expires in ${days}d`, cls: "bg-amber-50 text-[#d97706]", dot: "#d97706" };
  return { key: "valid", label: `Valid · ${days}d left`, cls: "bg-green-50 text-[#16a34a]", dot: "#16a34a" };
}

const EMPTY = {
  credential_type: "medical_license",
  title: "",
  issuing_authority: "",
  credential_number: "",
  issue_date: "",
  expiry_date: "",
  notes: "",
};

export default function CredentialsVault({
  initialCredentials,
  pro,
  freeLimit,
}: {
  initialCredentials: Credential[];
  pro: boolean;
  freeLimit: number;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Credential[]>(initialCredentials);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atFreeLimit = !pro && items.length >= freeLimit;

  const stats = useMemo(() => {
    let expired = 0, soon = 0, valid = 0;
    for (const c of items) {
      const s = statusOf(c.expiry_date).key;
      if (s === "expired") expired++;
      else if (s === "soon") soon++;
      else if (s === "valid") valid++;
    }
    return { expired, soon, valid };
  }, [items]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setError(null);
    setShowForm(true);
  };
  const openEdit = (c: Credential) => {
    setEditing(c);
    setForm({
      credential_type: c.credential_type,
      title: c.title,
      issuing_authority: c.issuing_authority ?? "",
      credential_number: c.credential_number ?? "",
      issue_date: c.issue_date ?? "",
      expiry_date: c.expiry_date ?? "",
      notes: c.notes ?? "",
    });
    setError(null);
    setShowForm(true);
  };

  const refresh = async () => {
    const res = await fetch("/api/credentials");
    if (res.ok) setItems((await res.json()).credentials ?? []);
  };

  const save = async () => {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setBusy(true); setError(null);
    const payload = {
      credential_type: form.credential_type,
      title: form.title.trim(),
      issuing_authority: form.issuing_authority.trim() || null,
      credential_number: form.credential_number.trim() || null,
      issue_date: form.issue_date || null,
      expiry_date: form.expiry_date || null,
      notes: form.notes.trim() || null,
    };
    try {
      const res = editing
        ? await fetch(`/api/credentials/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/credentials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || j.error || "Could not save"); setBusy(false); return;
      }
      setShowForm(false);
      await refresh();
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: Credential) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    await fetch(`/api/credentials/${c.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((x) => x.id !== c.id));
    router.refresh();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111] tracking-tight">Credentials Vault</h1>
          <p className="text-sm text-[#64748b] mt-1 max-w-xl">
            Keep every professional document in one place and never miss a renewal — license, BLS/ACLS, malpractice insurance, Dataflow, visa and more.
          </p>
        </div>
        {!atFreeLimit && (
          <button onClick={openAdd} className="shrink-0 rounded-lg bg-[#1a56a0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#16498a] transition-colors">
            + Add credential
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Expired", value: stats.expired, color: "#dc2626" },
          { label: "Expiring ≤60d", value: stats.soon, color: "#d97706" },
          { label: "Valid", value: stats.valid, color: "#16a34a" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#e2e8f0] bg-white p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#64748b] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Free-tier limit notice */}
      {atFreeLimit && (
        <div className="rounded-xl border border-[#1a56a0]/20 bg-[#f0f4f8] p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-[#1f2937]">
            <span className="font-semibold">You’ve reached the free limit of {freeLimit} credentials.</span>{" "}
            Upgrade to Pro for unlimited credentials and automatic expiry reminders.
          </div>
          <Link href="/pricing" className="shrink-0 rounded-lg bg-[#1a56a0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16498a]">
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white p-10 text-center">
          <div className="text-sm text-[#64748b]">No credentials yet. Add your medical license, BLS/ACLS, insurance or visa to start tracking expiries.</div>
          <button onClick={openAdd} className="mt-4 rounded-lg bg-[#1a56a0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16498a]">+ Add your first credential</button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((c) => {
            const st = statusOf(c.expiry_date);
            return (
              <div key={c.id} className="rounded-xl border border-[#e2e8f0] bg-white p-4 flex items-center gap-4">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: st.dot }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#111] truncate">{c.title}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-[#64748b]">{typeLabel(c.credential_type)}</span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5 truncate">
                    {c.issuing_authority || "—"}
                    {c.credential_number ? ` · #${c.credential_number}` : ""}
                    {c.expiry_date ? ` · expires ${c.expiry_date}` : ""}
                  </div>
                </div>
                <span className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                <div className="shrink-0 flex items-center gap-1">
                  <button onClick={() => openEdit(c)} className="text-xs text-[#1a56a0] hover:underline px-2 py-1">Edit</button>
                  <button onClick={() => remove(c)} className="text-xs text-[#dc2626] hover:underline px-2 py-1">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-[#94a3b8] mt-6 leading-relaxed">
        Hayya Med Pro helps you track your credentials and renewal readiness. It does not issue or renew credentials —
        always verify final requirements with your relevant authority.
      </p>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#111] mb-4">{editing ? "Edit credential" : "Add credential"}</h2>
            {error && <div className="mb-3 rounded-lg bg-red-50 text-[#dc2626] text-sm px-3 py-2">{error}</div>}
            <div className="space-y-3">
              <Field label="Type">
                <select value={form.credential_type} onChange={(e) => setForm({ ...form, credential_type: e.target.value })} className={inputCls}>
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Title *">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. QCHP Medical License" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Issuing authority"><input value={form.issuing_authority} onChange={(e) => setForm({ ...form, issuing_authority: e.target.value })} placeholder="e.g. QCHP" className={inputCls} /></Field>
                <Field label="Reference / number"><input value={form.credential_number} onChange={(e) => setForm({ ...form, credential_number: e.target.value })} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Issue date"><input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className={inputCls} /></Field>
                <Field label="Expiry date"><input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className={inputCls} /></Field>
              </div>
              <Field label="Notes"><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className={inputCls} /></Field>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={save} disabled={busy} className="rounded-lg bg-[#1a56a0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#16498a] disabled:opacity-60">
                {busy ? "Saving…" : editing ? "Save changes" : "Add credential"}
              </button>
              <button onClick={() => setShowForm(false)} className="rounded-lg border border-[#e2e8f0] px-4 py-2.5 text-sm font-medium text-[#64748b] hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#1a56a0] focus:ring-1 focus:ring-[#1a56a0]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[#64748b] mb-1">{label}</span>
      {children}
    </label>
  );
}
