"use client";
import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

const SEGMENTS = [
  { value: "all",                    label: "All onboarded users",         hasFilter: false, note: "Every user who completed onboarding" },
  { value: "free",                   label: "Free users",                  hasFilter: false, note: "Onboarded, no paid plan" },
  { value: "pro",                    label: "Paid subscribers",            hasFilter: false, note: "Active or trialing paid plans" },
  { value: "country",                label: "By country",                  hasFilter: true,  note: "Filter by country of residence" },
  { value: "profession",             label: "By profession",               hasFilter: true,  note: "Filter by profession (e.g. Physician)" },
  { value: "churn_risk",             label: "Churn risk",                  hasFilter: false, note: "Onboarded users with no CME activity in 30 days" },
  { value: "incomplete_onboarding",  label: "Incomplete onboarding",       hasFilter: false, note: "Users who never finished onboarding" },
];

const TEMPLATES = [
  {
    label: "Free → Pro upgrade nudge",
    subject: "Your CME compliance is one step away from complete",
    from_name: "Hayya Med Pro",
    html: `<p>Hi there,</p><p>You've been tracking CME activities on Hayya Med Pro — great work. Upgrading to Pro unlocks your full compliance PDF report, gap analysis, and multi-country tracking.</p><p><a href="https://hayyamed.pro/billing">Start your Pro trial &rarr;</a></p><p>— Hayya Med Pro Team</p>`,
    text: "Hi there,\n\nYou've been tracking CME activities on Hayya Med Pro — great work. Upgrading to Pro unlocks your full compliance PDF report, gap analysis, and multi-country tracking.\n\nStart your Pro trial: https://hayyamed.pro/billing\n\n— Hayya Med Pro Team",
  },
  {
    label: "Re-engagement (30d inactive)",
    subject: "Your CME renewal deadline is approaching",
    from_name: "Hayya Med Pro",
    html: `<p>Hi there,</p><p>It's been a while since you logged any CME activities. Many licensing authorities have annual minimum requirements — don't wait until the last minute.</p><p><a href="https://hayyamed.pro/cme">Log your latest activity &rarr;</a></p><p>— Hayya Med Pro Team</p>`,
    text: "Hi there,\n\nIt's been a while since you logged any CME activities. Many licensing authorities have annual minimum requirements — don't wait until the last minute.\n\nLog your latest activity: https://hayyamed.pro/cme\n\n— Hayya Med Pro Team",
  },
  {
    label: "Finish your onboarding",
    subject: "Complete your Hayya Med Pro setup",
    from_name: "Hayya Med Pro",
    html: `<p>Hi there,</p><p>You signed up for Hayya Med Pro but haven't finished setting up your profile. It takes less than 3 minutes — and it unlocks your CME tracker, compliance dashboard, and licensing readiness tools.</p><p><a href="https://hayyamed.pro/onboarding/1">Complete your profile &rarr;</a></p><p>— Hayya Med Pro Team</p>`,
    text: "Hi there,\n\nYou signed up for Hayya Med Pro but haven't finished setting up your profile. It takes less than 3 minutes.\n\nComplete your profile: https://hayyamed.pro/onboarding/1\n\n— Hayya Med Pro Team",
  },
];

export default function EmailCampaignsPage() {
  const [segment, setSegment]     = useState("free");
  const [filter, setFilter]       = useState("");
  const [preview, setPreview]     = useState<number | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [fromName, setFromName]   = useState("Hayya Med Pro");
  const [subject, setSubject]     = useState("");
  const [htmlBody, setHtmlBody]   = useState("");
  const [textBody, setTextBody]   = useState("");

  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending]     = useState(false);
  const [result, setResult]       = useState<{ sent: number; failed: number; message: string } | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const seg = SEGMENTS.find((s) => s.value === segment)!;

  useEffect(() => {
    setPreview(null);
    setConfirmed(false);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoadingPreview(true);
      const params = new URLSearchParams({ segment, filter });
      const res = await fetch(`/api/admin/email-campaigns?${params}`);
      if (res.ok) { const j = await res.json(); setPreview(j.target_count ?? 0); }
      setLoadingPreview(false);
    }, 400);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [segment, filter]);

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setSubject(t.subject); setFromName(t.from_name);
    setHtmlBody(t.html); setTextBody(t.text);
  };

  const handleSend = async () => {
    if (!subject || !htmlBody || !segment || !confirmed) return;
    setSending(true); setSendError(null); setResult(null);
    const res = await fetch("/api/admin/email-campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, from_name: fromName, html_body: htmlBody, text_body: textBody, segment, filter }),
    });
    const json = await res.json();
    if (!res.ok) { setSendError(json.error ?? "Send failed"); setSending(false); return; }
    setResult(json); setSending(false); setConfirmed(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Email Campaign Manager</h1>
        <p className="text-[#64748b] mt-1">Compose and send targeted emails to user segments via Postmark. Every send is audit-logged.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: segment + compose */}
        <div className="lg:col-span-2 space-y-5">
          {/* Templates */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <h2 className="text-xs font-semibold text-[#0f172a] mb-3 uppercase tracking-wide">Quick Templates</h2>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button key={t.label} onClick={() => applyTemplate(t)}
                  className="px-3 py-1.5 text-xs bg-[#f0f4f8] text-[#374151] rounded-lg hover:bg-[#e2e8f0] transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Segment */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <h2 className="text-xs font-semibold text-[#0f172a] mb-3 uppercase tracking-wide">Target Segment</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {SEGMENTS.map((s) => (
                <button key={s.value} onClick={() => { setSegment(s.value); setFilter(""); }}
                  className={`p-3 rounded-xl border text-left transition-all ${segment === s.value ? "border-[#1a56a0] bg-[#eff6ff]" : "border-[#e2e8f0] hover:border-[#94a3b8]"}`}>
                  <p className={`text-xs font-medium ${segment === s.value ? "text-[#1a56a0]" : "text-[#374151]"}`}>{s.label}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5 leading-tight">{s.note}</p>
                </button>
              ))}
            </div>
            {seg.hasFilter && (
              <input value={filter} onChange={(e) => setFilter(e.target.value)}
                placeholder={`Filter value (e.g. ${segment === "country" ? "Qatar" : "Physician"})…`}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a56a0]" />
            )}
          </div>

          {/* Compose */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 space-y-4">
            <h2 className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide">Compose Email</h2>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">From Name</label>
              <input value={fromName} onChange={(e) => setFromName(e.target.value)}
                placeholder="Hayya Med Pro"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Subject Line</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Your CME compliance report is ready"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
              <p className="text-[10px] text-[#94a3b8] mt-1">{subject.length}/80 chars · ideal &lt;60</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">HTML Body</label>
              <textarea value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} rows={8}
                placeholder="<p>Hi there,</p><p>…</p>"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-xs font-mono outline-none focus:border-[#1a56a0] resize-y" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Plain Text Body <span className="text-[#94a3b8] font-normal">(optional but recommended)</span></label>
              <textarea value={textBody} onChange={(e) => setTextBody(e.target.value)} rows={4}
                placeholder="Hi there,&#10;&#10;…"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-xs font-mono outline-none focus:border-[#1a56a0] resize-y" />
            </div>
          </div>

          {/* Send */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            {result ? (
              <div className="flex items-center gap-4 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl">
                <div>
                  <p className="text-sm font-bold text-[#16a34a]">Campaign sent</p>
                  <p className="text-xs text-[#374151]">{result.sent} delivered · {result.failed} failed · {result.message}</p>
                </div>
                <button onClick={() => setResult(null)} className="ml-auto text-xs text-[#64748b] hover:text-[#0f172a]">Send another</button>
              </div>
            ) : (
              <>
                {preview !== null && (
                  <div className={`p-3 rounded-xl mb-4 text-xs font-medium ${preview === 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-[#eff6ff] text-[#1a56a0] border border-[#bfdbfe]"}`}>
                    {loadingPreview ? "Counting…" : preview === 0 ? "No users match this segment." : `This campaign will reach ${preview.toLocaleString()} user${preview !== 1 ? "s" : ""}.`}
                  </div>
                )}
                <label className="flex items-start gap-2 cursor-pointer mb-4">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="accent-[#1a56a0] mt-0.5" />
                  <span className="text-xs text-[#374151]">
                    I confirm this campaign is approved and will be sent to{" "}
                    <strong>{loadingPreview ? "…" : (preview ?? 0).toLocaleString()}</strong> recipients.
                    This action cannot be undone.
                  </span>
                </label>
                {sendError && <p className="text-xs text-red-600 mb-3">{sendError}</p>}
                <button onClick={handleSend}
                  disabled={sending || !subject || !htmlBody || !confirmed || preview === 0}
                  className="px-6 py-2.5 bg-[#1a56a0] text-white text-sm font-medium rounded-xl hover:bg-[#1547a0] disabled:opacity-40 disabled:cursor-not-allowed">
                  {sending ? "Sending…" : `Send Campaign (${preview ?? "?"})`}
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: HTML preview */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <h2 className="text-xs font-semibold text-[#0f172a] mb-3 uppercase tracking-wide">Email Preview</h2>
            <div className="text-[11px] text-[#64748b] mb-2">
              <span className="font-medium text-[#374151]">From:</span> {fromName || "Hayya Med Pro"} &lt;noreply@hayyamed.pro&gt;<br />
              <span className="font-medium text-[#374151]">Subject:</span> {subject || <em className="text-[#94a3b8]">No subject</em>}
            </div>
            <div className="border border-[#f1f5f9] rounded-lg overflow-hidden">
              {htmlBody ? (
                <div
                  className="p-4 text-xs"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlBody) }}
                />
              ) : (
                <div className="p-6 text-center text-[#94a3b8] text-xs">Compose your email to see the preview here</div>
              )}
            </div>
          </div>
          <div className="bg-[#fffbeb] rounded-xl border border-[#fde68a] p-4 text-xs text-[#92400e] space-y-1">
            <p className="font-semibold">Before sending</p>
            <p>• Test by selecting "By country = Test" and verifying with a test account first</p>
            <p>• Postmark must be configured with a verified sending domain</p>
            <p>• Every send is logged to audit_logs for compliance</p>
            <p>• Unsubscribes are handled by Postmark — respect suppression lists</p>
          </div>
        </div>
      </div>
    </div>
  );
}
