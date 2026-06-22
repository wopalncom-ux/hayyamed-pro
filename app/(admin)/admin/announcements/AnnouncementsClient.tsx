"use client";
import { useState } from "react";

type Announcement = {
  id: string; title: string; message: string; type: string; target_audience: string;
  is_active: boolean; dismissible: boolean; cta_label: string | null; cta_url: string | null;
  starts_at: string; ends_at: string | null; created_at: string;
};

const TYPE_STYLES: Record<string, { bg: string; border: string; icon: string; label: string }> = {
  info:    { bg: "bg-blue-50",   border: "border-blue-200",  icon: "ℹ️",  label: "Info" },
  warning: { bg: "bg-amber-50",  border: "border-amber-200", icon: "⚠️",  label: "Warning" },
  success: { bg: "bg-green-50",  border: "border-green-200", icon: "✅",  label: "Success" },
  error:   { bg: "bg-red-50",    border: "border-red-200",   icon: "🚨",  label: "Error" },
};

const AUDIENCE_LABELS: Record<string, string> = {
  all: "All Users", pro: "Pro+", free: "Free Users", employer: "Employer Admins",
};

const blank = {
  title: "", message: "", type: "info", target_audience: "all",
  is_active: true, dismissible: true, cta_label: "", cta_url: "",
  starts_at: new Date().toISOString().slice(0, 16), ends_at: "",
};

type Props = { initial: Announcement[] };

export default function AnnouncementsClient({ initial }: Props) {
  const [items, setItems]   = useState<Announcement[]>(initial);
  const [form, setForm]     = useState<typeof blank>({ ...blank });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const now = new Date();
  const isLive = (a: Announcement) =>
    a.is_active && new Date(a.starts_at) <= now && (!a.ends_at || new Date(a.ends_at) >= now);

  const resetForm = () => { setForm({ ...blank }); setEditing(null); setShowForm(false); setError(null); };

  const openEdit = (a: Announcement) => {
    setForm({
      title: a.title, message: a.message, type: a.type, target_audience: a.target_audience,
      is_active: a.is_active, dismissible: a.dismissible,
      cta_label: a.cta_label ?? "", cta_url: a.cta_url ?? "",
      starts_at: a.starts_at.slice(0, 16), ends_at: a.ends_at?.slice(0, 16) ?? "",
    });
    setEditing(a.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.message) { setError("Title and message are required."); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        ...form,
        cta_label: form.cta_label || null,
        cta_url: form.cta_url || null,
        ends_at: form.ends_at || null,
        starts_at: new Date(form.starts_at).toISOString(),
      };
      if (editing) {
        const res = await fetch(`/api/admin/announcements?id=${editing}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setItems((prev) => prev.map((i) => i.id === editing ? json.data : i));
      } else {
        const res = await fetch("/api/admin/announcements", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setItems((prev) => [json.data, ...prev]);
      }
      resetForm();
    } catch (e) { setError((e as Error).message); }
    setSaving(false);
  };

  const handleToggle = async (id: string, is_active: boolean) => {
    const res = await fetch(`/api/admin/announcements?id=${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active }),
    });
    if (res.ok) setItems((prev) => prev.map((i) => i.id === id ? { ...i, is_active } : i));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement permanently?")) return;
    const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const s = TYPE_STYLES[form.type] ?? TYPE_STYLES.info;

  return (
    <div className="space-y-6">
      {/* Create button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-[#1a56a0] text-white text-sm font-medium rounded-xl hover:bg-[#1547a0] transition-colors">
          + New Announcement
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0f172a]">{editing ? "Edit Announcement" : "New Announcement"}</h2>
            <button onClick={resetForm} className="text-[#94a3b8] hover:text-[#374151] text-xl leading-none">×</button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#374151] mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Scheduled Maintenance Tonight"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#374151] mb-1">Message</label>
              <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Full announcement text shown to users…"
                rows={3}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]">
                {Object.entries(TYPE_STYLES).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Audience</label>
              <select value={form.target_audience} onChange={(e) => setForm((p) => ({ ...p, target_audience: e.target.value }))}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]">
                {Object.entries(AUDIENCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Starts At</label>
              <input type="datetime-local" value={form.starts_at} onChange={(e) => setForm((p) => ({ ...p, starts_at: e.target.value }))}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Ends At <span className="text-[#94a3b8]">(optional)</span></label>
              <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm((p) => ({ ...p, ends_at: e.target.value }))}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">CTA Button Label <span className="text-[#94a3b8]">(optional)</span></label>
              <input value={form.cta_label} onChange={(e) => setForm((p) => ({ ...p, cta_label: e.target.value }))}
                placeholder="e.g. Learn more"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">CTA URL <span className="text-[#94a3b8]">(optional)</span></label>
              <input value={form.cta_url} onChange={(e) => setForm((p) => ({ ...p, cta_url: e.target.value }))}
                placeholder="/dashboard or https://…"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:border-[#1a56a0]" />
            </div>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="accent-[#1a56a0]" />
                <span className="text-xs text-[#374151]">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.dismissible} onChange={(e) => setForm((p) => ({ ...p, dismissible: e.target.checked }))}
                  className="accent-[#1a56a0]" />
                <span className="text-xs text-[#374151]">Dismissible by user</span>
              </label>
            </div>
          </div>

          {/* Live preview */}
          <div className="px-6 pb-4">
            <p className="text-xs font-semibold text-[#374151] mb-2">Dashboard Preview</p>
            <div className={`rounded-xl border p-4 flex gap-3 ${s.bg} ${s.border}`}>
              <span className="text-lg flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0f172a]">{form.title || "Announcement title"}</p>
                <p className="text-xs text-[#374151] mt-0.5">{form.message || "Announcement message will appear here."}</p>
                {form.cta_label && <a className="inline-block mt-2 text-xs font-medium text-[#1a56a0] underline">{form.cta_label}</a>}
              </div>
              {form.dismissible && <button className="text-[#94a3b8] text-lg leading-none flex-shrink-0">×</button>}
            </div>
          </div>

          {error && <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">{error}</div>}

          <div className="px-6 pb-5 flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 bg-[#1a56a0] text-white text-sm font-medium rounded-xl hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : editing ? "Save Changes" : "Publish Announcement"}
            </button>
            <button onClick={resetForm} className="px-5 py-2.5 border border-[#e2e8f0] text-[#64748b] text-sm rounded-xl hover:bg-[#f8fafc]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {items.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-3xl mb-3">📢</p>
          <p className="text-[#64748b] text-sm">No announcements yet. Create one to notify your users.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => {
            const st = TYPE_STYLES[a.type] ?? TYPE_STYLES.info;
            const live = isLive(a);
            return (
              <div key={a.id} className={`rounded-xl border p-5 ${live ? `${st.bg} ${st.border}` : "bg-white border-[#e2e8f0] opacity-60"}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{st.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-[#0f172a]">{a.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${live ? "bg-[#16a34a] text-white" : "bg-[#94a3b8] text-white"}`}>
                        {live ? "LIVE" : a.is_active ? "SCHEDULED" : "PAUSED"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b]">{AUDIENCE_LABELS[a.target_audience]}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b]">{st.label}</span>
                    </div>
                    <p className="text-xs text-[#374151]">{a.message}</p>
                    {a.cta_label && <p className="text-[10px] text-[#1a56a0] mt-1">CTA: {a.cta_label} → {a.cta_url}</p>}
                    <p className="text-[10px] text-[#94a3b8] mt-2">
                      From {new Date(a.starts_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {a.ends_at && ` → ${new Date(a.ends_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
                      {!a.ends_at && " · No expiry"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(a.id, !a.is_active)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${a.is_active ? "border-[#d97706] text-[#d97706] hover:bg-amber-50" : "border-[#16a34a] text-[#16a34a] hover:bg-green-50"}`}>
                      {a.is_active ? "Pause" : "Activate"}
                    </button>
                    <button onClick={() => openEdit(a)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium border border-[#e2e8f0] text-[#374151] hover:bg-[#f0f4f8]">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(a.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium border border-red-200 text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
