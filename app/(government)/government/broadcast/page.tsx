"use client";

import { useActionState, useRef } from "react";
import { broadcastMessage } from "@/app/(government)/government/actions";
import Link from "next/link";

type State = { success?: boolean; sent?: number; failed?: number; error?: string } | null;

const initialState: State = null;

export default function BroadcastPage() {
  const [state, formAction, isPending] = useActionState(broadcastMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on success
  if (state?.success && formRef.current) {
    formRef.current.reset();
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
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Send to
              </label>
              <select
                name="audience"
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
                placeholder="Write your message here. Plain text only. Each professional will be addressed by name."
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none resize-y"
              />
              <p className="text-xs text-[#64748b] mt-1">Max 2,000 characters. Emails include your authority name in the sender display name.</p>
            </div>

            {/* Preview */}
            <div className="bg-[#f8fafc] rounded-lg p-4 text-xs text-[#64748b] border border-[#e2e8f0]">
              <p className="font-medium text-[#374151] mb-1">Email preview:</p>
              <p>From: <span className="text-[#374151]">Hayya Med Pro</span></p>
              <p>Subject: <span className="text-[#374151]">[Your Authority] — [your subject]</span></p>
              <p>To: <span className="text-[#374151]">Healthcare professional&apos;s email</span></p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[#64748b]">
                All messages are logged for audit compliance.
              </p>
              <button
                type="submit"
                disabled={isPending}
                className="text-sm px-6 py-2.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors font-medium"
              >
                {isPending ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
