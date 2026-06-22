"use client";
import { useState } from "react";

type SeoRow = {
  id: string;
  page_key: string;
  page_label: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  robots_directive: string | null;
  keywords: string[] | null;
  json_ld: Record<string, unknown> | null;
  updated_at: string;
};

type Props = { initial: SeoRow[] };

const ROBOTS = ["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"];

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len > max ? "text-red-500" : len > max * 0.9 ? "text-amber-500" : "text-[#94a3b8]";
  return <span className={`text-xs ${color}`}>{len}/{max}</span>;
}

export default function SeoEditorClient({ initial }: Props) {
  const [rows, setRows] = useState<SeoRow[]>(initial);
  const [active, setActive] = useState<SeoRow>(initial[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJsonLd, setShowJsonLd] = useState(false);
  const [jsonLdText, setJsonLdText] = useState(
    active?.json_ld ? JSON.stringify(active.json_ld, null, 2) : ""
  );
  const [keywordsText, setKeywordsText] = useState(
    (active?.keywords ?? []).join(", ")
  );

  const update = (field: keyof SeoRow, value: unknown) => {
    setActive((prev) => ({ ...prev, [field]: value } as SeoRow));
    setSaved(false);
  };

  const selectPage = (row: SeoRow) => {
    setActive(row);
    setSaved(false);
    setJsonLdText(row.json_ld ? JSON.stringify(row.json_ld, null, 2) : "");
    setKeywordsText((row.keywords ?? []).join(", "));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      let json_ld = active.json_ld;
      if (jsonLdText.trim()) {
        try { json_ld = JSON.parse(jsonLdText); }
        catch { throw new Error("Invalid JSON-LD — check JSON syntax"); }
      } else {
        json_ld = null;
      }

      const keywords = keywordsText.split(",").map((k) => k.trim()).filter(Boolean);

      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...active, json_ld, keywords }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const { data } = await res.json();
      setRows((prev) => prev.map((r) => r.page_key === data.page_key ? data : r));
      setActive(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Page list sidebar */}
      <div className="w-48 flex-shrink-0">
        <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">Pages</h3>
        <div className="space-y-1">
          {rows.map((r) => (
            <button
              key={r.page_key}
              onClick={() => selectPage(r)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                active.page_key === r.page_key
                  ? "bg-[#1a56a0] text-white font-medium"
                  : "text-[#64748b] hover:bg-[#f0f4f8] hover:text-[#0f172a]"
              }`}
            >
              {r.page_label ?? r.page_key}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#0f172a]">
                {active.page_label ?? active.page_key}
              </h3>
              <code className="text-xs text-[#64748b] bg-[#f0f4f8] px-2 py-0.5 rounded">
                page_key: {active.page_key}
              </code>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
              } disabled:opacity-50`}
            >
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          {/* Google Preview */}
          <div className="mb-6 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
            <p className="text-xs text-[#64748b] mb-2 font-medium">Google Search Preview</p>
            <div className="space-y-0.5">
              <p className="text-xs text-[#94a3b8]">hayyamed.pro/{active.page_key === "landing" ? "" : active.page_key}</p>
              <p className="text-base text-blue-700 font-medium leading-snug line-clamp-1">
                {active.meta_title || "Page title not set"}
              </p>
              <p className="text-sm text-[#64748b] line-clamp-2">
                {active.meta_description || "Meta description not set."}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-[#0f172a]">Meta Title</label>
                <CharCount value={active.meta_title ?? ""} max={60} />
              </div>
              <input
                value={active.meta_title ?? ""}
                onChange={(e) => update("meta_title", e.target.value)}
                placeholder="Page title for search engines (50-60 characters)"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
              />
              <p className="text-xs text-[#94a3b8] mt-1">Recommended: 50-60 characters</p>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-[#0f172a]">Meta Description</label>
                <CharCount value={active.meta_description ?? ""} max={160} />
              </div>
              <textarea
                value={active.meta_description ?? ""}
                onChange={(e) => update("meta_description", e.target.value)}
                placeholder="Page description for search engines (120-160 characters)"
                rows={3}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
              />
              <p className="text-xs text-[#94a3b8] mt-1">Recommended: 120-160 characters</p>
            </div>

            {/* Open Graph */}
            <div className="border border-[#e2e8f0] rounded-xl p-4">
              <h4 className="text-sm font-semibold text-[#0f172a] mb-4">Open Graph (Social Sharing)</h4>

              {/* OG Preview */}
              <div className="mb-4 border border-[#e2e8f0] rounded-lg overflow-hidden bg-white">
                {active.og_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.og_image_url}
                    alt="OG preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0]">
                  <p className="text-xs text-[#94a3b8] uppercase">hayyamed.pro</p>
                  <p className="text-sm font-medium text-[#0f172a] line-clamp-1">
                    {active.og_title || active.meta_title || "OG title not set"}
                  </p>
                  <p className="text-xs text-[#64748b] line-clamp-2">
                    {active.og_description || active.meta_description || "OG description not set."}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#64748b] mb-1 block">OG Title (defaults to Meta Title if blank)</label>
                  <input
                    value={active.og_title ?? ""}
                    onChange={(e) => update("og_title", e.target.value)}
                    placeholder="Title for Facebook, LinkedIn, WhatsApp…"
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748b] mb-1 block">OG Description</label>
                  <textarea
                    value={active.og_description ?? ""}
                    onChange={(e) => update("og_description", e.target.value)}
                    rows={2}
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748b] mb-1 block">OG Image URL (1200×630 recommended)</label>
                  <input
                    value={active.og_image_url ?? ""}
                    onChange={(e) => update("og_image_url", e.target.value)}
                    placeholder="https://…"
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                  />
                </div>
              </div>
            </div>

            {/* Advanced */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#0f172a] mb-1 block">Canonical URL</label>
                <input
                  value={active.canonical_url ?? ""}
                  onChange={(e) => update("canonical_url", e.target.value)}
                  placeholder="https://hayyamed.pro/…"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#0f172a] mb-1 block">Robots</label>
                <select
                  value={active.robots_directive ?? "index, follow"}
                  onChange={(e) => update("robots_directive", e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                >
                  {ROBOTS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="text-sm font-medium text-[#0f172a] mb-1 block">Keywords</label>
              <input
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                placeholder="CME tracking, QCHP renewal, GCC healthcare…"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
              />
              <p className="text-xs text-[#94a3b8] mt-1">Comma-separated. Minor ranking signal — keep relevant.</p>
            </div>

            {/* JSON-LD */}
            <div>
              <button
                onClick={() => setShowJsonLd(!showJsonLd)}
                className="text-sm font-medium text-[#1a56a0] hover:underline"
              >
                {showJsonLd ? "▾" : "▸"} JSON-LD Structured Data
              </button>
              {showJsonLd && (
                <div className="mt-2">
                  <textarea
                    value={jsonLdText}
                    onChange={(e) => setJsonLdText(e.target.value)}
                    rows={10}
                    placeholder='{ "@context": "https://schema.org", "@type": "WebPage", … }'
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                  />
                  <p className="text-xs text-[#94a3b8] mt-1">
                    Valid JSON only. Test at{" "}
                    <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-[#1a56a0] hover:underline">
                      Google Rich Results Test
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
            <span className="text-xs text-[#94a3b8]">Last saved: {new Date(active.updated_at).toLocaleString()}</span>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                saved ? "bg-green-500 text-white" : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
              } disabled:opacity-50`}
            >
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
