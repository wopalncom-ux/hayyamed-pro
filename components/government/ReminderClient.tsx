"use client";

import { useState } from "react";
import { sendReminder, type ReminderResult } from "@/app/(government)/government/reminders/actions";

type Counts = { all: number; red_zone: number; non_compliant: number; at_risk: number; expiring: number };

const AUDIENCES: { value: keyof Counts; label: string; hint: string }[] = [
  { value: "red_zone",      label: "Red zone",       hint: "Non-compliant, at-risk, or license expiring ≤30d" },
  { value: "non_compliant", label: "Non-compliant",  hint: "Below required CME credits" },
  { value: "at_risk",       label: "At risk",        hint: "Close to falling out of compliance" },
  { value: "expiring",      label: "License expiring", hint: "License expires within 30 days" },
  { value: "all",           label: "Everyone",       hint: "All professionals in the jurisdiction" },
];

export default function ReminderClient({ counts, employers, authorityName }: { counts: Counts; employers: string[]; authorityName: string }) {
  const [audience, setAudience] = useState<keyof Counts>("red_zone");
  const [employer, setEmployer] = useState("");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [subject, setSubject] = useState("Action required: your CME compliance");
  const [message, setMessage] = useState(`This is an official reminder from ${authorityName}.\n\nOur records indicate your CME/licensing compliance needs attention. Please log in to Hayya Med Pro to review your status and complete any outstanding requirements before your renewal deadline.`);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ReminderResult | null>(null);

  const audienceCount = counts[audience];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    fd.set("audience", audience);
    fd.set("employer", employer);
    if (email) fd.set("channel_email", "on");
    if (push) fd.set("channel_push", "on");
    try {
      const r = await sendReminder(fd);
      setResult(r);
    } catch {
      setResult({ ok: false, error: "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#16a34a] flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        </div>
        <p className="text-sm font-semibold text-[#15803d]">Reminder queued for {result.audience} professional{result.audience === 1 ? "" : "s"}</p>
        <p className="text-xs text-[#64748b] mt-1">{result.queued} notification{result.queued === 1 ? "" : "s"} queued — delivered within ~5 minutes.</p>
        <button onClick={() => setResult(null)} className="mt-4 text-sm text-[#1a56a0] hover:underline font-medium">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-5">
      {/* Audience */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Audience</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {AUDIENCES.map((a) => (
            <button
              type="button"
              key={a.value}
              onClick={() => setAudience(a.value)}
              className={`text-left border rounded-lg px-3 py-2.5 transition-colors ${audience === a.value ? "border-[#1a56a0] bg-[#f0f6ff] ring-1 ring-[#1a56a0]" : "border-[#e2e8f0] hover:bg-[#f8fafc]"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#111]">{a.label}</span>
                <span className="text-xs font-semibold text-[#1a56a0]">{counts[a.value]}</span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">{a.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Employer narrowing */}
      {employers.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Narrow to employer (optional)</label>
          <select value={employer} onChange={(e) => setEmployer(e.target.value)} className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">Any employer</option>
            <option value="__none__">Unaffiliated only</option>
            {employers.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      )}

      {/* Channels */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Channels</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[#374151]">
            <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} className="rounded border-[#cbd5e1]" /> Email + inbox
          </label>
          <label className="flex items-center gap-2 text-sm text-[#374151]">
            <input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} className="rounded border-[#cbd5e1]" /> Push notification
          </label>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Subject</label>
        <input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={150} className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Message</label>
        <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} maxLength={2000} className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
        <p className="text-xs text-[#64748b] mt-1">{message.length}/2000 · Do not include patient or personal data.</p>
      </div>

      {result?.error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-2.5 text-sm text-[#dc2626]">{result.error}</div>
      )}

      <div className="flex items-center justify-between pt-1">
        <p className="text-sm text-[#64748b]">Will send to <span className="font-semibold text-[#111]">{audienceCount}</span> professional{audienceCount === 1 ? "" : "s"}</p>
        <button type="submit" disabled={busy || audienceCount === 0} className="bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {busy ? "Queueing…" : "Send reminder"}
        </button>
      </div>
    </form>
  );
}
