"use client";
import { useState } from "react";

export default function SendReminderButton({
  professionalId,
  staffName,
  completedCredits,
  requiredCredits,
}: {
  professionalId: string;
  staffName: string;
  completedCredits: number | null;
  requiredCredits: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");

  const firstName = staffName.split(" ")[0];
  const defaultMsg = completedCredits !== null && requiredCredits !== null
    ? `Hi ${firstName}, your CPD progress is ${completedCredits}/${requiredCredits} credits. Please complete your remaining ${requiredCredits - completedCredits} credits before your license renewal date.`
    : `Hi ${firstName}, please ensure your CPD credits are up to date for your upcoming license renewal.`;

  function close() {
    setOpen(false);
    setDone(false);
    setMessage("");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/employer/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professional_id: professionalId,
          message: message.trim() || defaultMsg,
        }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(close, 1800);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#d97706] hover:bg-[#fff7ed] px-2 py-1 rounded transition-colors border border-[#fed7aa] whitespace-nowrap"
      >
        Send Reminder
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-[#e2e8f0]" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#111]">Send Compliance Reminder</h2>
                <p className="text-xs text-[#64748b] mt-0.5">{staffName}</p>
              </div>
              <button onClick={close} className="text-[#94a3b8] hover:text-[#374151] text-xl leading-none">×</button>
            </div>

            {done ? (
              <div className="px-6 py-10 text-center">
                <p className="text-[#16a34a] font-medium text-sm">Reminder sent to {firstName} via email and in-app notification.</p>
              </div>
            ) : (
              <form onSubmit={send} className="px-6 py-5 space-y-4">
                {completedCredits !== null && requiredCredits !== null && (
                  <div className="bg-[#f0f7ff] rounded-lg px-4 py-3 text-sm">
                    <span className="text-[#64748b]">Current CPD: </span>
                    <strong className="text-[#1a56a0]">{completedCredits}/{requiredCredits} credits</strong>
                    {requiredCredits - completedCredits > 0 && (
                      <span className="text-[#d97706] ml-2">· {requiredCredits - completedCredits} remaining</span>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={defaultMsg}
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a56a0] resize-none"
                  />
                  <p className="text-[10px] text-[#94a3b8] mt-1">Leave blank to use the default message. Sent via email + in-app notification.</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button type="button" onClick={close} className="text-sm text-[#64748b] hover:text-[#374151]">Cancel</button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#d97706] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#b45309] disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Sending..." : "Send Reminder"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
