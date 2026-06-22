"use client";
import { useState } from "react";

type Template = {
  TemplateId: number;
  Name: string;
  Active: boolean;
  Alias: string | null;
  TemplateType: string;
  AssociatedServerId: number;
};

type TemplateDetail = Template & {
  Subject: string;
  HtmlBody: string;
  TextBody: string;
};

type Props = { initial: Template[]; total: number };

const templateTypeColor: Record<string, string> = {
  Standard: "bg-[#dbeafe] text-[#1d4ed8]",
  Layout:   "bg-[#dcfce7] text-[#15803d]",
};

export default function EmailTemplatesClient({ initial, total }: Props) {
  const [templates]           = useState<Template[]>(initial);
  const [detail, setDetail]   = useState<TemplateDetail | null>(null);
  const [editing, setEditing] = useState<Partial<TemplateDetail> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testSent, setTestSent] = useState(false);
  const [tab, setTab]         = useState<"html" | "text" | "subject">("subject");

  const loadDetail = async (id: number) => {
    setLoading(true);
    setError(null);
    setSaved(false);
    setTestSent(false);
    try {
      const res = await fetch(`/api/admin/email-templates?id=${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDetail(json.template);
      setEditing({ Subject: json.template.Subject, HtmlBody: json.template.HtmlBody, TextBody: json.template.TextBody });
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!detail || !editing) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/email-templates?id=${detail.TemplateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  };

  const handleSendTest = async () => {
    if (!detail || !testEmail) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: detail.TemplateId, to_email: testEmail }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTestSent(true);
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="flex gap-0 min-h-[600px] bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] overflow-y-auto">
        <div className="px-4 py-3 border-b border-[#e2e8f0]">
          <p className="text-xs font-semibold text-[#0f172a]">Email Templates</p>
          <p className="text-[10px] text-[#64748b]">{total} templates via Postmark</p>
        </div>
        {templates.length === 0 && (
          <p className="p-4 text-xs text-[#64748b]">No templates found. Check POSTMARK_SERVER_TOKEN.</p>
        )}
        {templates.map((t) => (
          <button
            key={t.TemplateId}
            onClick={() => loadDetail(t.TemplateId)}
            className={`w-full text-left px-4 py-3 border-b border-[#f1f5f9] transition-colors ${
              detail?.TemplateId === t.TemplateId
                ? "bg-[#1a56a0] text-white"
                : "hover:bg-[#f0f4f8] text-[#374151]"
            }`}
          >
            <p className={`text-xs font-medium truncate ${detail?.TemplateId === t.TemplateId ? "text-white" : "text-[#0f172a]"}`}>
              {t.Name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {t.Alias && (
                <span className={`text-[10px] font-mono truncate ${detail?.TemplateId === t.TemplateId ? "text-blue-200" : "text-[#64748b]"}`}>
                  {t.Alias}
                </span>
              )}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                detail?.TemplateId === t.TemplateId
                  ? "bg-white/20 text-white"
                  : (templateTypeColor[t.TemplateType] ?? "bg-[#f1f5f9] text-[#64748b]")
              }`}>
                {t.TemplateType}
              </span>
            </div>
          </button>
        ))}
      </aside>

      {/* Main panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {!detail && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-3xl mb-3">✉️</p>
            <p className="text-[#64748b] text-sm">Select a template from the sidebar to view and edit it.</p>
            <p className="text-[#94a3b8] text-xs mt-1">Powered by Postmark · Changes are live immediately</p>
          </div>
        )}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[#64748b]">Loading…</p>
          </div>
        )}
        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}

        {detail && !loading && (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e2e8f0] bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#0f172a]">{detail.Name}</h2>
                  <p className="text-[10px] text-[#64748b]">ID: {detail.TemplateId}{detail.Alias ? ` · Alias: ${detail.Alias}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  {saved && <span className="text-xs text-[#16a34a] font-medium">✓ Saved</span>}
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-[#1a56a0] text-white text-xs font-medium rounded-lg hover:bg-[#1547a0] disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-4">
                {(["subject", "html", "text"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-xs font-medium pb-2 border-b-2 transition-colors capitalize ${
                      tab === t ? "border-[#1a56a0] text-[#1a56a0]" : "border-transparent text-[#64748b] hover:text-[#374151]"
                    }`}
                  >
                    {t === "html" ? "HTML Body" : t === "text" ? "Text Body" : "Subject Line"}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-6">
              {tab === "subject" && (
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-2">Subject Line</label>
                  <input
                    value={editing?.Subject ?? ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, Subject: e.target.value }))}
                    className="w-full border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1a56a0] font-mono"
                    placeholder="Your email subject with {{variables}}"
                  />
                  <p className="text-xs text-[#64748b] mt-2">
                    Postmark variables use <code className="font-mono bg-[#f1f5f9] px-1 rounded">{"{{variable_name}}"}</code> syntax
                  </p>
                </div>
              )}
              {tab === "html" && (
                <div className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#374151]">HTML Body</label>
                    <span className="text-[10px] text-[#94a3b8]">{(editing?.HtmlBody ?? "").length} chars</span>
                  </div>
                  <textarea
                    value={editing?.HtmlBody ?? ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, HtmlBody: e.target.value }))}
                    className="w-full h-96 border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs font-mono outline-none focus:border-[#1a56a0] resize-none"
                    placeholder="HTML email body…"
                  />
                </div>
              )}
              {tab === "text" && (
                <div className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#374151]">Plain Text Body</label>
                    <span className="text-[10px] text-[#94a3b8]">{(editing?.TextBody ?? "").length} chars</span>
                  </div>
                  <textarea
                    value={editing?.TextBody ?? ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, TextBody: e.target.value }))}
                    className="w-full h-96 border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs font-mono outline-none focus:border-[#1a56a0] resize-none"
                    placeholder="Plain text fallback body…"
                  />
                </div>
              )}
            </div>

            {/* Send test */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]">
              <p className="text-xs font-semibold text-[#374151] mb-2">Send Test Email</p>
              <div className="flex gap-2">
                <input
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your@email.com (must be your admin address)"
                  className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#1a56a0]"
                />
                <button
                  onClick={handleSendTest}
                  disabled={loading || !testEmail}
                  className="px-4 py-2 text-xs font-medium border border-[#e2e8f0] rounded-lg text-[#374151] hover:bg-white disabled:opacity-50"
                >
                  Send Test
                </button>
              </div>
              {testSent && (
                <p className="text-xs text-[#16a34a] mt-2 font-medium">✓ Test email sent — check your inbox</p>
              )}
              <p className="text-[10px] text-[#94a3b8] mt-1">
                Test emails send with empty template variables. Template renders as-is from Postmark.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
