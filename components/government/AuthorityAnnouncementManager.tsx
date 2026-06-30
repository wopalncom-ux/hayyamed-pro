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
  attachmentUrl: string | null; attachmentName: string | null;
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
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(announcements.length === 0);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Upload attachment first (if any), then attach its public URL to the form data.
    const file = fd.get("attachment") as File | null;
    fd.delete("attachment");
    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) { setError("File too large (max 10 MB)"); return; }
      setUploading(true);
      try {
        const up = new FormData();
        up.set("file", file);
        const res = await fetch("/api/government/announcements/upload", { method: "POST", body: up });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Attachment upload failed"); setUploading(false); return; }
        fd.set("attachment_url", data.url);
        fd.set("attachment_name", data.name);
      } catch {
        setError("Attachment upload failed"); setUploading(false); return;
      }
      setUploading(false);
    }

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
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Attach document (optional)</label>
            <input
              type="file"
              name="attachment"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-[#374151] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-[#e2e8f0] file:bg-[#f8fafc] file:text-[#374151] file:text-sm file:font-medium hover:file:bg-[#f1f5f9] file:cursor-pointer"
            />
            <p className="text-xs text-[#64748b] mt-1">PDF circular or image · max 10 MB. Shown to users as a download link.</p>
          </div>
          {error && <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-2.5 text-sm text-[#dc2626]">{error}</div>}
          <div className="flex justify-end">
            <button type="submit" disabled={pending || uploading} className="bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors disabled:opacity-50">
              {uploading ? "Uploading…" : pending ? "Publishing…" : `Publish to ${jurisdiction}`}
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
          {a.attachmentUrl && (
            <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium mt-1 underline opacity-90">
              📎 {a.attachmentName ?? "Attachment"}
            </a>
          )}
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
