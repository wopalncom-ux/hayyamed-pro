"use client";

import { useState, useRef, useActionState } from "react";
import { broadcastMessage } from "@/app/(government)/government/actions";
import Link from "next/link";

type State = { success?: boolean; sent?: number; failed?: number; error?: string } | null;

export default function BroadcastClient({
  organizationId,
  authorityCode,
  cycleMonths,
  creditsRequired,
  daysUntilCycleEnd,
}: {
  organizationId: string;
  authorityCode: string;
  cycleMonths: number;
  creditsRequired: number;
  daysUntilCycleEnd: number;
}) {
  const [state, formAction, isPending] = useActionState(broadcastMessage, null as State);
  const formRef = useRef<HTMLFormElement>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");

  const [draftOpen, setDraftOpen] = useState(false);
  const [draftIntent, setDraftIntent] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  if (state?.success && formRef.current) {
    formRef.current.reset();
    setSubject("");
    setBody("");
  }

  async function generateDraft() {
    if (!draftIntent.trim() || drafting) return;
    setDrafting(true);
    setDraftError(null);

    try {
      const res = await fetch("/api/ai/draft-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          intent: draftIntent.trim(),
          audience,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Draft failed");

      setSubject(data.draft.subject);
      setBody(data.draft.body);
      setDraftOpen(false);
      setDraftIntent("");
    } catch (e) {
      setDraftError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setDrafting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/government" className="text-sm text-[#64748b] hover:text-[#374151] transition-colors">
          ← Dashboard
        </Link>
        <span className="text-[#e2e8f0]">/</span>
        <h1 className="text-lg font-semibold text-[#111]">Broadcast Message</h1>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <p className="text-sm text-[#64748b] mb-6">
            Send an email message directly to healthcare professionals registered under your authority. Messages are sent from Hayya Med Pro on behalf of your authority.
          </p>

          {state?.success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-sm text-[#16a34a] font-medium">
              ✓ Message sent to {state.sent} professional{state.sent !== 1 ? "s" : ""}
              {state.failed ? ` (${state.failed} failed)` : ""}
            </div>
          )}
          {state?.error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-sm text-[#dc2626]">
              {state.error}
            </div>
          )}

          <form action={formAction} ref={formRef} className="space-y-5">
            {/* Audience */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Send to</label>
              <select
                name="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] bg-white focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none"
              >
                <option value="all">All registered professionals</option>
                <option value="at_risk">At-risk professionals only</option>
                <option value="non_compliant">Non-compliant professionals only</option>
              </select>
              <p className="text-xs text-[#64748b] mt-1">
                Messages are only sent to professionals who have registered with your authority.
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Subject <span className="text-[#dc2626]">*</span>
              </label>
              <input
                name="subject"
                type="text"
                required
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., CME Renewal Deadline Reminder — Action Required"
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Message <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                name="body"
                required
                maxLength={2000}
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here. Plain text only. Each professional will be addressed by name."
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none resize-y"
              />
              <p className="text-xs text-[#64748b] mt-1">Max 2,000 characters. Emails include your authority name in the sender display name.</p>
            </div>

            {/* Email preview */}
            <div className="bg-[#f8fafc] rounded-lg p-4 text-xs text-[#64748b] border border-[#e2e8f0]">
              <p className="font-medium text-[#374151] mb-1">Email preview:</p>
              <p>From: <span className="text-[#374151]">Hayya Med Pro</span></p>
              <p>Subject: <span className="text-[#374151]">[{authorityCode}] — {subject || "[your subject]"}</span></p>
              <p>To: <span className="text-[#374151]">Healthcare professional&apos;s email</span></p>
            </div>

            <div className="flex items-center justify-between pt-2 gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setDraftOpen(true)}
                className="flex items-center gap-2 text-sm px-4 py-2.5 border border-[#1a56a0] text-[#1a56a0] rounded-lg hover:bg-[#f0f4ff] transition-colors font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                AI Draft
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <p className="text-xs text-[#64748b]">All messages are logged for audit compliance.</p>
                <button
                  type="submit"
                  disabled={isPending}
                  className="text-sm px-6 py-2.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors font-medium"
                >
                  {isPending ? "Sending…" : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* AI Draft Modal */}
      {draftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#111]">AI Email Drafter</h2>
                  <span className="text-[10px] bg-[#e8f0fe] text-[#1a56a0] px-1.5 py-0.5 rounded font-medium">Claude Haiku</span>
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">Describe what you want to say — AI writes the email</p>
              </div>
              <button onClick={() => setDraftOpen(false)} className="text-[#94a3b8] hover:text-[#64748b]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  What do you want to communicate?
                </label>
                <textarea
                  value={draftIntent}
                  onChange={(e) => setDraftIntent(e.target.value)}
                  placeholder='e.g., "Remind non-compliant physicians their renewal deadline is in 45 days and they need to complete CME credits"'
                  rows={4}
                  maxLength={500}
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none resize-none"
                />
                <p className="text-xs text-[#64748b] mt-1">
                  Audience: <strong>{audience === "all" ? "All professionals" : audience === "at_risk" ? "At-risk professionals" : "Non-compliant professionals"}</strong> · {cycleMonths}-month cycle · {creditsRequired} credits required
                </p>
              </div>

              {draftError && (
                <div className="text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
                  {draftError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setDraftOpen(false)}
                  className="flex-1 text-sm px-4 py-2.5 border border-[#e2e8f0] text-[#64748b] rounded-lg hover:bg-[#f8fafc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateDraft}
                  disabled={drafting || !draftIntent.trim()}
                  className="flex-1 text-sm px-4 py-2.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {drafting ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Drafting…
                    </>
                  ) : "Generate Draft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
