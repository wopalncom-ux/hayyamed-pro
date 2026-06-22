"use client";
import { useState, useRef, useCallback } from "react";

type MediaFile = {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string | null;
  mime_type: string | null;
  file_size: number | null;
  alt_text: string | null;
  category: string;
  tags: string[];
  created_at: string;
};

type Props = { initial: MediaFile[] };

const CATEGORIES = ["all", "general", "team", "logos", "banners", "courses"];

function formatBytes(b: number | null) {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function isImage(mime: string | null) {
  return mime?.startsWith("image/") ?? false;
}

export default function MediaLibraryClient({ initial }: Props) {
  const [files, setFiles] = useState<MediaFile[]>(initial);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState("general");
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter((f) => {
    if (activeCategory !== "all" && f.category !== activeCategory) return false;
    if (search && !f.file_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setUploadProgress(`Preparing ${file.name}…`);
    try {
      // 1. Get signed upload URL
      const urlRes = await fetch("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: file.name,
          content_type: file.type,
          category: uploadCategory,
        }),
      });
      if (!urlRes.ok) throw new Error((await urlRes.json()).error);
      const { upload_url, path, public_url } = await urlRes.json();

      // 2. Upload directly to Supabase Storage
      setUploadProgress(`Uploading ${file.name}…`);
      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. Register metadata
      setUploadProgress("Registering file…");
      const metaRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: file.name,
          file_path: path,
          public_url,
          mime_type: file.type,
          file_size: file.size,
          alt_text: altText || file.name.replace(/\.[^.]+$/, ""),
          category: uploadCategory,
        }),
      });
      if (!metaRes.ok) throw new Error((await metaRes.json()).error);
      const { data } = await metaRes.json();
      setFiles((prev) => [data, ...prev]);
      setAltText("");
      setUploadProgress(null);
    } catch (e) {
      setError((e as Error).message);
      setUploadProgress(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [uploadCategory, altText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (f: MediaFile) => {
    if (!confirm(`Delete "${f.file_name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/media?id=${f.id}`, { method: "DELETE" });
    if (res.ok) {
      setFiles((prev) => prev.filter((x) => x.id !== f.id));
      if (selected?.id === f.id) setSelected(null);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex gap-6">
      {/* Left: grid */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files…"
            className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
          />
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === c
                    ? "bg-[#1a56a0] text-white"
                    : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1a56a0]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#64748b] self-center">{filtered.length} files</span>
        </div>

        {/* Upload dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="mb-5 border-2 border-dashed border-[#e2e8f0] rounded-xl p-5 bg-[#f8fafc] hover:border-[#1a56a0] transition-colors"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-sm text-[#64748b]">
                Drag & drop a file here, or{" "}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-[#1a56a0] font-medium hover:underline disabled:opacity-50"
                >
                  choose a file
                </button>
              </p>
              <p className="text-xs text-[#94a3b8] mt-0.5">Images, PDFs, SVGs — up to 10 MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*,application/pdf,.svg"
              className="hidden"
            />
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="border border-[#e2e8f0] rounded-lg px-2 py-1.5 text-xs text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
            >
              {CATEGORIES.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Alt text (optional)"
              className="border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-xs w-44 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
            />
          </div>
          {uploadProgress && (
            <p className="mt-2 text-xs text-[#1a56a0] animate-pulse">{uploadProgress}</p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#64748b] text-sm">No files found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((f) => (
              <div
                key={f.id}
                onClick={() => { setSelected(f); setEditAlt(f.alt_text ?? ""); }}
                className={`cursor-pointer bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow ${
                  selected?.id === f.id ? "border-[#1a56a0] ring-2 ring-[#1a56a0]/20" : "border-[#e2e8f0]"
                }`}
              >
                <div className="aspect-square bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                  {isImage(f.mime_type) && f.public_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.public_url}
                      alt={f.alt_text ?? f.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl text-[#94a3b8]">
                      {f.mime_type === "application/pdf" ? "📄" : "📁"}
                    </div>
                  )}
                </div>
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-[#0f172a] truncate">{f.file_name}</p>
                  <p className="text-xs text-[#94a3b8]">{formatBytes(f.file_size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: detail panel */}
      {selected && (
        <div className="w-72 flex-shrink-0">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0f172a]">File Details</h3>
              <button onClick={() => setSelected(null)} className="text-[#94a3b8] hover:text-[#64748b] text-lg leading-none">×</button>
            </div>

            {isImage(selected.mime_type) && selected.public_url && (
              <div className="mb-3 rounded-xl overflow-hidden bg-[#f8fafc] border border-[#e2e8f0] aspect-video flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.public_url}
                  alt={selected.alt_text ?? selected.file_name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Name</span>
                <span className="text-[#0f172a] font-medium truncate max-w-36 ml-2">{selected.file_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Type</span>
                <span className="text-[#0f172a]">{selected.mime_type ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Size</span>
                <span className="text-[#0f172a]">{formatBytes(selected.file_size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Category</span>
                <span className="text-[#0f172a] capitalize">{selected.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Uploaded</span>
                <span className="text-[#0f172a]">{new Date(selected.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {selected.public_url && (
              <div className="mb-4">
                <label className="text-xs text-[#64748b] mb-1 block">Public URL</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={selected.public_url}
                    className="flex-1 min-w-0 border border-[#e2e8f0] rounded-lg px-2 py-1.5 text-xs bg-[#f8fafc] text-[#64748b] truncate"
                  />
                  <button
                    onClick={() => copyUrl(selected.public_url!, selected.id)}
                    className="px-2 py-1.5 bg-[#1a56a0] text-white text-xs rounded-lg hover:bg-[#1547a0] whitespace-nowrap"
                  >
                    {copied === selected.id ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => handleDelete(selected)}
              className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
            >
              Delete File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
