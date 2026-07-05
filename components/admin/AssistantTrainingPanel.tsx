"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type SourceItem = {
  source_id: string;
  source_type: "admin_document" | "admin_website" | "admin_qa";
  title: string;
  created_at: string;
  chunk_count: number;
};

type Rule = {
  id: string;
  rule_text: string;
  active: boolean;
  created_at: string;
};

const SOURCE_LABELS: Record<SourceItem["source_type"], { icon: string; label: string }> = {
  admin_document: { icon: "📄", label: "Document" },
  admin_website: { icon: "🌐", label: "Website" },
  admin_qa: { icon: "💬", label: "Q&A" },
};

export default function AssistantTrainingPanel() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const [fileUploading, setFileUploading] = useState(false);
  const [fileMsg, setFileMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [websiteMsg, setWebsiteMsg] = useState<string | null>(null);

  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaMsg, setQaMsg] = useState<string | null>(null);

  const [ruleText, setRuleText] = useState("");
  const [ruleLoading, setRuleLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/owner/knowledge/list");
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources ?? []);
        setRules(data.rules ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUploading(true);
    setFileMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/owner/knowledge/document", { method: "POST", body: formData });
      const data = await res.json();
      setFileMsg(res.ok ? `✓ Learned ${data.chunks_inserted} chunk${data.chunks_inserted !== 1 ? "s" : ""} from "${file.name}"` : `✗ ${data.error}`);
      if (res.ok) await load();
    } catch {
      setFileMsg("✗ Upload failed — check your connection.");
    } finally {
      setFileUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleWebsiteSubmit() {
    if (!websiteUrl.trim()) return;
    setWebsiteLoading(true);
    setWebsiteMsg(null);
    try {
      const res = await fetch("/api/owner/knowledge/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl.trim() }),
      });
      const data = await res.json();
      setWebsiteMsg(res.ok ? `✓ Learned ${data.chunks_inserted} chunk${data.chunks_inserted !== 1 ? "s" : ""} from that page` : `✗ ${data.error}`);
      if (res.ok) { setWebsiteUrl(""); await load(); }
    } catch {
      setWebsiteMsg("✗ Request failed — check your connection.");
    } finally {
      setWebsiteLoading(false);
    }
  }

  async function handleQaSubmit() {
    if (!qaQuestion.trim() || !qaAnswer.trim()) return;
    setQaLoading(true);
    setQaMsg(null);
    try {
      const res = await fetch("/api/owner/knowledge/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: qaQuestion.trim(), answer: qaAnswer.trim() }),
      });
      const data = await res.json();
      setQaMsg(res.ok ? "✓ Q&A added" : `✗ ${data.error}`);
      if (res.ok) { setQaQuestion(""); setQaAnswer(""); await load(); }
    } catch {
      setQaMsg("✗ Request failed — check your connection.");
    } finally {
      setQaLoading(false);
    }
  }

  async function handleDeleteSource(sourceId: string) {
    setSources((prev) => prev.filter((s) => s.source_id !== sourceId));
    await fetch(`/api/owner/knowledge/source/${sourceId}`, { method: "DELETE" }).catch(() => {});
  }

  async function handleAddRule() {
    if (!ruleText.trim()) return;
    setRuleLoading(true);
    try {
      const res = await fetch("/api/owner/knowledge/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rule_text: ruleText.trim() }),
      });
      if (res.ok) { setRuleText(""); await load(); }
    } finally {
      setRuleLoading(false);
    }
  }

  async function handleToggleRule(id: string, active: boolean) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active } : r)));
    await fetch(`/api/owner/knowledge/rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    }).catch(() => {});
  }

  async function handleDeleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/owner/knowledge/rules/${id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-[#0f172a]">Train Your Assistant</h2>
        <p className="text-xs text-[#64748b] mt-0.5">
          Brief the Compliance Chat assistant with documents, websites, Q&A pairs, and behavior rules.
          Everything here is retrieved automatically when a professional asks a related question.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Document upload */}
        <div className="border border-[#e2e8f0] rounded-lg p-4">
          <p className="text-sm font-semibold text-[#111] mb-1">📄 Upload a document</p>
          <p className="text-xs text-[#64748b] mb-3">.txt, .md, or .pdf — max 5MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
            onChange={handleFileUpload}
            disabled={fileUploading}
            className="block w-full text-xs text-[#64748b] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#e2e8f0] file:text-xs file:font-medium file:bg-[#f8fafc] hover:file:bg-[#eff6ff] disabled:opacity-50"
          />
          {fileUploading && <p className="text-xs text-[#1a56a0] mt-2">Reading, chunking, and embedding…</p>}
          {fileMsg && <p className="text-xs mt-2">{fileMsg}</p>}
        </div>

        {/* Website link */}
        <div className="border border-[#e2e8f0] rounded-lg p-4">
          <p className="text-sm font-semibold text-[#111] mb-1">🌐 Learn from a website</p>
          <p className="text-xs text-[#64748b] mb-3">Static pages only — no JavaScript rendering</p>
          <div className="flex gap-1.5">
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 min-w-0 text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
            />
            <button
              onClick={handleWebsiteSubmit}
              disabled={websiteLoading || !websiteUrl.trim()}
              className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg font-medium disabled:opacity-50 hover:bg-[#1547a0]"
            >
              {websiteLoading ? "…" : "Add"}
            </button>
          </div>
          {websiteMsg && <p className="text-xs mt-2">{websiteMsg}</p>}
        </div>

        {/* Q&A */}
        <div className="border border-[#e2e8f0] rounded-lg p-4">
          <p className="text-sm font-semibold text-[#111] mb-1">💬 Add a Q&A pair</p>
          <p className="text-xs text-[#64748b] mb-3">Type the exact answer you want given</p>
          <input
            type="text"
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
            placeholder="Question"
            className="w-full text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg mb-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
          />
          <textarea
            value={qaAnswer}
            onChange={(e) => setQaAnswer(e.target.value)}
            placeholder="Answer"
            rows={2}
            className="w-full text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg mb-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 resize-none"
          />
          <button
            onClick={handleQaSubmit}
            disabled={qaLoading || !qaQuestion.trim() || !qaAnswer.trim()}
            className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg font-medium disabled:opacity-50 hover:bg-[#1547a0]"
          >
            {qaLoading ? "Adding…" : "Add Q&A"}
          </button>
          {qaMsg && <p className="text-xs mt-2">{qaMsg}</p>}
        </div>
      </div>

      {/* Rules */}
      <div className="border-t border-[#f1f5f9] pt-4">
        <p className="text-sm font-semibold text-[#111] mb-1">📏 Rules — always followed, every conversation</p>
        <p className="text-xs text-[#64748b] mb-3">
          Not retrieved by similarity — every active rule is injected into every response. Use for hard constraints, e.g. &quot;never recommend a specific course provider.&quot;
        </p>
        <div className="flex gap-1.5 mb-3">
          <input
            type="text"
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            placeholder="e.g. Always mention the QCHP disclaimer for Qatar users"
            className="flex-1 text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
          />
          <button
            onClick={handleAddRule}
            disabled={ruleLoading || !ruleText.trim()}
            className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg font-medium disabled:opacity-50 hover:bg-[#1547a0]"
          >
            Add rule
          </button>
        </div>
        {rules.length === 0 ? (
          <p className="text-xs text-[#94a3b8]">No rules yet.</p>
        ) : (
          <div className="space-y-1.5">
            {rules.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 bg-[#f8fafc] rounded-lg px-3 py-2">
                <span className={`text-xs flex-1 ${r.active ? "text-[#111]" : "text-[#94a3b8] line-through"}`}>{r.rule_text}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleRule(r.id, !r.active)}
                    className="text-[10px] text-[#1a56a0] hover:underline"
                  >
                    {r.active ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleDeleteRule(r.id)}
                    className="text-[10px] text-[#dc2626] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ingested sources list */}
      <div className="border-t border-[#f1f5f9] pt-4">
        <p className="text-sm font-semibold text-[#111] mb-3">Trained knowledge ({sources.length})</p>
        {loading ? (
          <p className="text-xs text-[#94a3b8]">Loading…</p>
        ) : sources.length === 0 ? (
          <p className="text-xs text-[#94a3b8]">Nothing added yet — upload a document, add a website, or type a Q&A above.</p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {sources.map((s) => (
              <div key={s.source_id} className="flex items-center justify-between gap-2 bg-[#f8fafc] rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm flex-shrink-0">{SOURCE_LABELS[s.source_type].icon}</span>
                  <span className="text-xs text-[#111] truncate">{s.title}</span>
                  <span className="text-[10px] text-[#94a3b8] flex-shrink-0">{s.chunk_count} chunk{s.chunk_count !== 1 ? "s" : ""}</span>
                </div>
                <button
                  onClick={() => handleDeleteSource(s.source_id)}
                  className="text-[10px] text-[#dc2626] hover:underline flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
