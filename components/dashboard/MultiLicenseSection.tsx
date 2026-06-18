"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type License = {
  id: string;
  license_number: string;
  licensing_authority: string;
  country_code: string;
  profession: string | null;
  specialty: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  notes: string | null;
  is_primary: boolean;
};

const GCC_AUTHORITIES = [
  "QCHP / DHP-AS (Qatar)",
  "SCFHS (Saudi Arabia)",
  "DHA (Dubai)",
  "DOH (Abu Dhabi)",
  "MOH (Kuwait)",
  "NHRA (Bahrain)",
  "OMSB (Oman)",
  "GMC (United Kingdom)",
  "NMC (United Kingdom)",
  "AHPRA (Australia)",
  "AMC (Australia)",
  "NMC (India)",
  "Pakistan Medical Commission (PMC)",
  "SLMC (Sri Lanka)",
  "Other",
];

const COUNTRY_OPTIONS = [
  { code: "QA", name: "Qatar" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "UAE" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "PK", name: "Pakistan" },
  { code: "LK", name: "Sri Lanka" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "EG", name: "Egypt" },
  { code: "JO", name: "Jordan" },
  { code: "LB", name: "Lebanon" },
  { code: "SY", name: "Syria" },
  { code: "IQ", name: "Iraq" },
  { code: "IR", name: "Iran" },
];

function urgency(expiryDate: string | null): { label: string; color: string; days: number | null } {
  if (!expiryDate) return { label: "No expiry set", color: "text-[#64748b]", days: null };
  const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000);
  if (days < 0) return { label: "Expired", color: "text-[#dc2626]", days };
  if (days <= 30) return { label: `${days}d — Urgent`, color: "text-[#dc2626]", days };
  if (days <= 90) return { label: `${days}d — Upcoming`, color: "text-[#d97706]", days };
  return { label: `${days}d remaining`, color: "text-[#16a34a]", days };
}

const EMPTY_FORM = {
  license_number: "",
  licensing_authority: "",
  country_code: "QA",
  profession: "",
  specialty: "",
  issue_date: "",
  expiry_date: "",
  notes: "",
  is_primary: false,
};

export default function MultiLicenseSection({ initialLicenses }: { initialLicenses: License[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
    setShowForm(true);
  }

  function openEdit(l: License) {
    setEditId(l.id);
    setForm({
      license_number: l.license_number,
      licensing_authority: l.licensing_authority,
      country_code: l.country_code,
      profession: l.profession ?? "",
      specialty: l.specialty ?? "",
      issue_date: l.issue_date ?? "",
      expiry_date: l.expiry_date ?? "",
      notes: l.notes ?? "",
      is_primary: l.is_primary,
    });
    setError(null);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
  }

  async function handleSave() {
    if (!form.license_number.trim() || !form.licensing_authority.trim()) {
      setError("License number and authority are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      license_number:      form.license_number.trim(),
      licensing_authority: form.licensing_authority.trim(),
      country_code:        form.country_code,
      profession:          form.profession.trim() || null,
      specialty:           form.specialty.trim() || null,
      issue_date:          form.issue_date || null,
      expiry_date:         form.expiry_date || null,
      notes:               form.notes.trim() || null,
      is_primary:          form.is_primary,
    };

    const url = editId ? `/api/licenses/${editId}` : "/api/licenses";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const body = await res.json();
      setError(typeof body.error === "string" ? body.error : "Failed to save license.");
      return;
    }

    // Refresh data from server
    startTransition(() => router.refresh());
    setShowForm(false);
    setEditId(null);

    // Optimistic update
    const { license } = await res.json();
    if (editId) {
      setLicenses((prev) => prev.map((l) => l.id === editId ? license : (form.is_primary ? { ...l, is_primary: false } : l)));
    } else {
      setLicenses((prev) => [...(form.is_primary ? prev.map((l) => ({ ...l, is_primary: false })) : prev), license]);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/licenses/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setLicenses((prev) => prev.filter((l) => l.id !== id));
      startTransition(() => router.refresh());
    }
  }

  const inputCls = "w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] text-[#111] bg-white";
  const labelCls = "block text-xs font-medium text-[#64748b] mb-1";

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#111]">My Licenses</h2>
          <p className="text-xs text-[#64748b] mt-0.5">Track all your active professional licenses across GCC authorities.</p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 text-xs font-semibold bg-[#1a56a0] text-white px-3 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add License
          </button>
        )}
      </div>

      {/* License cards */}
      {licenses.length === 0 && !showForm && (
        <div className="px-6 py-10 text-center">
          <div className="w-10 h-10 bg-[#f0f4f8] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#111] mb-1">No licenses added yet</p>
          <p className="text-xs text-[#64748b] max-w-xs mx-auto mb-4">
            Add your professional licenses to track renewal deadlines across all GCC authorities.
          </p>
          <button onClick={openAdd} className="text-sm text-[#1a56a0] font-semibold hover:underline">
            Add your first license →
          </button>
        </div>
      )}

      {licenses.length > 0 && (
        <div className="divide-y divide-[#f1f5f9]">
          {licenses.map((lic) => {
            const { label, color, days } = urgency(lic.expiry_date);
            const isExpiringSoon = days !== null && days <= 30;
            return (
              <div key={lic.id} className={`px-6 py-4 flex items-center justify-between gap-4 ${isExpiringSoon ? "bg-[#fff7ed]" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold text-[#111]">{lic.licensing_authority}</p>
                    {lic.is_primary && (
                      <span className="text-[10px] font-semibold bg-[#e8f0fe] text-[#1a56a0] px-2 py-0.5 rounded-full">Primary</span>
                    )}
                    <span className="text-[10px] font-medium text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-full">{lic.country_code}</span>
                  </div>
                  <p className="text-xs text-[#64748b]">
                    #{lic.license_number}
                    {lic.profession && ` · ${lic.profession}`}
                    {lic.specialty && ` · ${lic.specialty}`}
                  </p>
                  {lic.expiry_date && (
                    <p className={`text-xs font-medium mt-0.5 ${color}`}>
                      Expires {new Date(lic.expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {label}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(lic)}
                    className="text-xs text-[#64748b] hover:text-[#1a56a0] font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lic.id)}
                    disabled={deletingId === lic.id}
                    className="text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition-colors disabled:opacity-50"
                  >
                    {deletingId === lic.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <div className="px-6 py-5 border-t border-[#e2e8f0] bg-[#fafbfc]">
          <h3 className="text-sm font-semibold text-[#111] mb-4">{editId ? "Edit License" : "Add New License"}</h3>
          {error && (
            <div className="mb-4 text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>License Number *</label>
              <input
                className={inputCls}
                value={form.license_number}
                onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))}
                placeholder="e.g. QCHP-12345"
              />
            </div>
            <div>
              <label className={labelCls}>Licensing Authority *</label>
              <input
                list="authority-list"
                className={inputCls}
                value={form.licensing_authority}
                onChange={(e) => setForm((f) => ({ ...f, licensing_authority: e.target.value }))}
                placeholder="e.g. QCHP / DHP-AS"
              />
              <datalist id="authority-list">
                {GCC_AUTHORITIES.map((a) => <option key={a} value={a} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <select
                className={inputCls}
                value={form.country_code}
                onChange={(e) => setForm((f) => ({ ...f, country_code: e.target.value }))}
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Profession</label>
              <input
                className={inputCls}
                value={form.profession}
                onChange={(e) => setForm((f) => ({ ...f, profession: e.target.value }))}
                placeholder="e.g. Physician"
              />
            </div>
            <div>
              <label className={labelCls}>Specialty</label>
              <input
                className={inputCls}
                value={form.specialty}
                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                placeholder="e.g. Cardiology"
              />
            </div>
            <div />
            <div>
              <label className={labelCls}>Issue Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.issue_date}
                onChange={(e) => setForm((f) => ({ ...f, issue_date: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>Expiry Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.expiry_date}
                onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Notes (optional)</label>
              <input
                className={inputCls}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="e.g. Renewal in progress"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="is_primary"
              checked={form.is_primary}
              onChange={(e) => setForm((f) => ({ ...f, is_primary: e.target.checked }))}
              className="accent-[#1a56a0]"
            />
            <label htmlFor="is_primary" className="text-sm text-[#374151] cursor-pointer">
              Set as primary license (shown on dashboard and public profile)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || isPending}
              className="text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving…" : editId ? "Save changes" : "Add license"}
            </button>
            <button
              onClick={cancelForm}
              className="text-sm text-[#64748b] hover:text-[#111] font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
