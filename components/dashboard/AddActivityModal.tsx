"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { addCmeActivity } from "@/app/(dashboard)/dashboard/cme/actions";
import { useToast } from "@/components/ui/toast";
import { track } from "@/lib/analytics";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "conference", label: "Conference / Seminar" },
  { value: "online", label: "Online / E-Learning" },
  { value: "workshop", label: "Workshop (Hands-on)" },
  { value: "journal", label: "Journal / Self-Assessment" },
  { value: "teaching", label: "Teaching / Lecturing" },
  { value: "simulation", label: "Simulation / Skill Lab" },
  { value: "mandatory", label: "Mandatory (Saudi SCFHS)" },
  { value: "patient_safety", label: "Patient Safety (Dubai DHA)" },
  { value: "other", label: "Other" },
];

const CONFIDENCE_COLOR: Record<string, string> = {
  high: "text-green-700 bg-green-50 border-green-200",
  medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
  low: "text-slate-600 bg-slate-50 border-slate-200",
};

interface AiSuggestion {
  category: string;
  confidence: "high" | "medium" | "low";
  creditSuggestion: number | null;
  notes: string;
}

export default function AddActivityModal({
  walletId,
  countryCode = "QA",
  onClose,
}: {
  walletId: string;
  countryCode?: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controlled form fields
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [credits, setCredits] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // AI suggestion state
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);

  // OCR state
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { toast } = useToast();

  // Debounced AI categorization on title change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (title.trim().length < 3) {
      setAiSuggestion(null);
      setAiLoading(false);
      return;
    }
    setAiLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/ai/categorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), countryCode }),
        });
        if (res.ok) {
          const data: AiSuggestion = await res.json();
          setAiSuggestion(data);
          setSelectedCategory((prev) => {
            if (!prev) {
              setAiApplied(true);
              return data.category;
            }
            return prev;
          });
        }
      } finally {
        setAiLoading(false);
      }
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, countryCode]);

  // OCR: extract fields from certificate
  async function handleOcr() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    setOcrDone(false);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/ai/ocr-certificate", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "OCR failed");
        return;
      }
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.provider) setProvider(data.provider);
      if (data.date) setActivityDate(data.date);
      if (data.credits != null) setCredits(String(data.credits));
      if (data.category) {
        setSelectedCategory(data.category);
        setAiApplied(false);
      }
      setOcrDone(true);
      track("ai_ocr_used");
    } finally {
      setOcrLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    if (!activityDate) { setError("Date is required"); return; }
    if (!credits || isNaN(parseFloat(credits))) { setError("Valid credits required"); return; }

    setError(null);
    setLoading(true);

    const file = fileRef.current?.files?.[0];
    let certificateUrl: string | null = null;

    if (file) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      certificateUrl = path;
    }

    const result = await addCmeActivity({
      walletId,
      title: title.trim(),
      provider: provider.trim() || null,
      activityDate,
      credits: parseFloat(credits),
      certificateUrl,
      category: selectedCategory || null,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    track("cme_activity_submitted", {
      category: selectedCategory || "uncategorised",
      credits: parseFloat(credits),
      ai_suggested: aiApplied,
      has_certificate: !!file,
    });
    toast("CME activity logged successfully", "success");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-[#111]">Log CME Activity</h2>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-[#111] text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Certificate upload (first — OCR fills other fields) */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Certificate{" "}
              <span className="text-[#64748b] font-normal">(PDF or image)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="flex-1 text-sm text-[#64748b] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#f1f5f9] file:text-[#374151] hover:file:bg-[#e2e8f0] cursor-pointer"
                onChange={(e) => {
                  setSelectedFileName(e.target.files?.[0]?.name ?? "");
                  setOcrDone(false);
                }}
              />
              {selectedFileName && (
                <button
                  type="button"
                  onClick={handleOcr}
                  disabled={ocrLoading}
                  className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#1a56a0] border border-[#1a56a0]/30 rounded-lg px-2.5 py-1.5 hover:bg-[#1a56a0]/5 disabled:opacity-50 transition-colors"
                >
                  {ocrLoading ? (
                    <>
                      <span className="inline-block w-3 h-3 border border-[#1a56a0] border-t-transparent rounded-full animate-spin" />
                      Reading…
                    </>
                  ) : (
                    <>✦ Extract</>
                  )}
                </button>
              )}
            </div>
            {ocrDone && (
              <p className="mt-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
                ✓ Fields extracted from certificate — review and adjust before saving
              </p>
            )}
          </div>

          {/* Activity Title */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Activity Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setAiApplied(false);
              }}
              required
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
              placeholder="e.g. Advanced Cardiology Workshop"
            />
            {(aiLoading || aiSuggestion) && (
              <div className="mt-1.5">
                {aiLoading ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#64748b]">
                    <span className="inline-block w-3 h-3 border border-[#94a3b8] border-t-transparent rounded-full animate-spin" />
                    AI categorizing…
                  </span>
                ) : aiSuggestion ? (
                  <div
                    className={`inline-flex items-center gap-2 text-xs border rounded-full px-2.5 py-0.5 ${CONFIDENCE_COLOR[aiSuggestion.confidence] ?? CONFIDENCE_COLOR.low}`}
                  >
                    <span>✦</span>
                    <span>
                      AI:{" "}
                      <strong>
                        {CATEGORIES.find((c) => c.value === aiSuggestion.category)?.label ??
                          aiSuggestion.category}
                      </strong>
                    </span>
                    <span className="opacity-60">({aiSuggestion.confidence})</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Category
              {aiApplied && selectedCategory === aiSuggestion?.category && (
                <span className="ml-2 text-xs font-normal text-[#1a56a0] bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                  ✦ AI suggested
                </span>
              )}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setAiApplied(false);
              }}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            >
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {aiSuggestion?.notes && (
              <p className="mt-1 text-xs text-[#64748b]">{aiSuggestion.notes}</p>
            )}
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Provider / Organizer
            </label>
            <input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
              placeholder="e.g. QCHP, Hamad Medical Corporation"
            />
          </div>

          {/* Date + Credits */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Credits <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                required
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
                placeholder="e.g. 5"
              />
              {aiSuggestion?.creditSuggestion != null && (
                <p className="mt-1 text-xs text-yellow-700">
                  AI suggests {aiSuggestion.creditSuggestion} credits for this type
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e2e8f0] text-sm font-medium text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1a56a0] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
            >
              {loading ? "Saving..." : "Log Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
