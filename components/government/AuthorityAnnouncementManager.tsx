"use client";

import { useState, useTransition } from "react";
import {
  createAuthorityAnnouncement,
  toggleAuthorityAnnouncement,
  deleteAuthorityAnnouncement,
} from "@/app/(government)/government/announcements/actions";

type Announcement = {
  id: string; title: string; message: string; type: string;
  isActive: boolean; ctaLabel: string | null; ctaUrl: string | null;
  startsAt: string; endsAt: string | null;
};

const TYPE_STYLES: Record<string, string> = {
  info: "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  warning: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
  success: "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
  error: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
};

export default function AuthorityAnnouncementManager({ announcements, jurisdiction }: { announcements: Announcement[]; jurisdiction: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(announcements.length === 0);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const r = await createAuthorityAnnouncement(fd);
      if (!r.ok) setError(r.error ?? "Failed to create");
      else { form.reset(); setShowForm(false); }
    });
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <form onSubmit={onCreate} className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#111]">New announcement</h2>
            {announcements.length > 0 && (
              <button type="button" onClick={() => setShowForm(false)} className="text-xs text-[#64748b] hover:text-[#374151]">Cancel</button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Title</label>
            <input name="title" maxLength={150} required className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Message</label>
            <textarea name="message" rows={3} maxLength={500} required className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Type</label>
              <select name="type" defaultValue="info" className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Expires (optional)</label>
              <input type="date" name="ends_at" className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Button label (optional)</label>
              <input name="cta_label" maxLength={40} className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Button URL (optional)</label>
              <input name="cta_url" maxLength={300} placeholder="/cme" className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
            </div>
          </div>
          {error && <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-2.5 text-sm text-[#dc2626]">{error}</div>}
          <div className="flex justify-end">
            <button type="submit" disabled={pending} className="bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors disabled:opacity-50">
              {pending ? "Publishing…" : `Publish to ${jurisdiction}`}
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="bg-[#1a56a0] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors">
          + New announcement
        </button>
      )}

      <div className="space-y-3">
        {announcements.length === 0 && !showForm && (
          <p className="text-sm text-[#64748b] text-center py-6">No announcements yet.</p>
        )}
        {announcements.map((a) => (
          <AnnouncementRow key={a.id} a={a} />
        ))}
      </div>
    </div>
  );
}

function AnnouncementRow({ a }: { a: Announcement }) {
  const [pending, startTransition] = useTransition();
  const style = TYPE_STYLES[a.type] ?? TYPE_STYLES.info;
  return (
    <div className={`rounded-xl border p-4 ${a.isActive ? style : "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{a.title}</p>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase ${a.isActive ? "bg-white/60" : "bg-[#e2e8f0]"}`}>
              {a.isActive ? "Live" : "Off"}
            </span>
          </div>
          <p className="text-xs mt-0.5 opacity-90">{a.message}</p>
          <p className="text-[11px] mt-1 opacity-70">
            {a.endsAt ? `Expires ${a.endsAt.slice(0, 10)}` : "No expiry"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => startTransition(() => { toggleAuthorityAnnouncement(a.id, !a.isActive); })}
            disabled={pending}
            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] disabled:opacity-50"
          >
            {a.isActive ? "Turn off" : "Turn on"}
          </button>
          <button
            onClick={() => { if (confirm("Delete this announcement?")) startTransition(() => { deleteAuthorityAnnouncement(a.id); }); }}
            disabled={pending}
            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#fecaca] text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
