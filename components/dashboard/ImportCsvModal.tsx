"use client";

import { useRef, useState } from "react";
import { importCmeActivities, type ImportRow, type ImportResult } from "@/app/(dashboard)/dashboard/cme/actions";
import { useToast } from "@/components/ui/toast";
import { track } from "@/lib/analytics";
import type { Plan } from "@/lib/planUtils";
import { isPro } from "@/lib/planUtils";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";

const VALID_CATEGORIES = new Set([
  "conference", "online", "workshop", "journal",
  "teaching", "simulation", "mandatory", "patient_safety", "other",
]);

const SAMPLE_CSV =
  "title,date,credits,provider,category\n" +
  "Advanced Cardiology Workshop,2024-03-15,5,Hamad Medical Corporation,workshop\n" +
  "QCHP Annual Conference 2024,2024-05-20,8,QCHP,conference\n" +
  "Emergency Medicine Online Course,2024-07-01,3,MedCPD Platform,online\n";

function parseDate(raw: string): string | null {
  raw = raw.trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  // MM/DD/YYYY
  const mdy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;
  return null;
}

function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    return cells;
  };

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase().trim());
  const rows = lines.slice(1).map((line) => {
    const vals = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj;
  });
  return { headers, rows };
}

interface ParsedRow extends ImportRow {
  _raw: Record<string, string>;
  _errors: string[];
  _rowNum: number;
}

function validateRows(raw: Record<string, string>[], existingCount: number, plan: Plan): ParsedRow[] {
  return raw.map((r, i) => {
    const errors: string[] = [];
    const title = (r["title"] ?? "").trim();
    if (!title) errors.push("Title required");

    const rawDate = r["date"] ?? r["activity_date"] ?? "";
    const date = parseDate(rawDate);
    if (!date) errors.push("Invalid date (use YYYY-MM-DD)");

    const creditsRaw = r["credits"] ?? "";
    const credits = parseFloat(creditsRaw);
    if (isNaN(credits) || credits <= 0 || credits > 100) errors.push("Credits must be 0.5–100");

    const category = (r["category"] ?? "").toLowerCase().trim() || null;
    if (category && !VALID_CATEGORIES.has(category)) errors.push(`Unknown category "${category}"`);

    const provider = (r["provider"] ?? "").trim() || null;

    const wouldExceedFreeLimit = !isPro(plan) && (existingCount + i + 1) > FREE_ACTIVITY_LIMIT;

    return {
      title,
      activityDate: date ?? "",
      credits: isNaN(credits) ? 0 : credits,
      provider,
      category,
      _raw: r,
      _errors: errors,
      _rowNum: i + 1,
      _willSkip: wouldExceedFreeLimit && errors.length === 0,
    } as ParsedRow & { _willSkip: boolean };
  });
}

export default function ImportCsvModal({
  walletId,
  plan,
  existingCount,
  onClose,
}: {
  walletId: string;
  plan: Plan;
  existingCount: number;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [parsedRows, setParsedRows] = useState<(ParsedRow & { _willSkip: boolean })[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const proUser = isPro(plan);
  const remaining = proUser ? Infinity : Math.max(0, FREE_ACTIVITY_LIMIT - existingCount);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setParseError("Please upload a .csv file");
      return;
    }
    setParseError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { headers, rows } = parseCsv(text);
      const hasTitle = headers.includes("title");
      const hasDate = headers.includes("date") || headers.includes("activity_date");
      const hasCredits = headers.includes("credits");
      if (!hasTitle || !hasDate || !hasCredits) {
        setParseError("CSV must have columns: title, date, credits (and optionally: provider, category)");
        return;
      }
      const validated = validateRows(rows, existingCount, plan) as (ParsedRow & { _willSkip: boolean })[];
      setParsedRows(validated);
      setStep("preview");
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    const eligible = parsedRows.filter((r) => r._errors.length === 0 && !r._willSkip);
    if (!eligible.length) return;
    setImporting(true);
    const result = await importCmeActivities(
      eligible.map((r) => ({ title: r.title, activityDate: r.activityDate, credits: r.credits, provider: r.provider, category: r.category })),
      walletId
    );
    setResult(result);
    setStep("done");
    if (result.imported > 0) {
      toast(`${result.imported} activities imported successfully`, "success");
      track("cme_activities_bulk_imported", { count: result.imported, plan });
    }
    setImporting(false);
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cme-activities-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const validRows = parsedRows.filter((r) => r._errors.length === 0 && !r._willSkip);
  const invalidRows = parsedRows.filter((r) => r._errors.length > 0);
  const skippedRows = parsedRows.filter((r) => r._willSkip);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-[#111]">Import CME Activities from CSV</h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              {step === "upload" && "Upload a CSV file with your activity history"}
              {step === "preview" && `${parsedRows.length} rows found — review before importing`}
              {step === "done" && "Import complete"}
            </p>
          </div>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#111] text-lg leading-none p-1">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* STEP: Upload */}
          {step === "upload" && (
            <div className="space-y-5">
              {/* Free tier note */}
              {!proUser && (
                <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-lg px-4 py-3 text-xs text-[#92400e]">
                  Free plan: you can import up to <strong>{remaining}</strong> more activities (total limit {FREE_ACTIVITY_LIMIT}).
                  {" "}<a href="/pricing?source=csv_import" className="font-semibold underline">Upgrade to Pro</a> for unlimited imports.
                </div>
              )}

              {/* Format guide */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 text-xs">
                <p className="font-semibold text-[#111] mb-2">Required CSV columns:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { col: "title", req: true, note: "Activity name" },
                    { col: "date", req: true, note: "YYYY-MM-DD or DD/MM/YYYY" },
                    { col: "credits", req: true, note: "Number (e.g. 5 or 2.5)" },
                    { col: "provider", req: false, note: "Issuing organisation" },
                    { col: "category", req: false, note: "conference, online, workshop…" },
                  ].map(({ col, req, note }) => (
                    <div key={col} className="flex items-start gap-1.5">
                      <code className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${req ? "bg-[#e8f0fe] text-[#1a56a0]" : "bg-[#f1f5f9] text-[#64748b]"}`}>{col}</code>
                      <span className="text-[#64748b] text-[11px]">{note}{req ? "" : " (optional)"}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={downloadSample}
                  className="mt-3 text-[#1a56a0] font-medium hover:underline"
                >
                  ↓ Download sample CSV template
                </button>
              </div>

              {/* Drop zone */}
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl px-6 py-10 text-center hover:border-[#1a56a0] hover:bg-[#f8fafc] transition-colors">
                  <div className="w-10 h-10 bg-[#e8f0fe] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#374151] mb-1">Click to select a CSV file</p>
                  <p className="text-xs text-[#94a3b8]">or drag and drop · .csv only</p>
                </div>
                <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
              </label>

              {parseError && (
                <p className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3">{parseError}</p>
              )}
            </div>
          )}

          {/* STEP: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Summary bar */}
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-2.5 py-1.5 rounded-full bg-[#dcfce7] text-[#16a34a] font-semibold">
                  ✓ {validRows.length} ready to import
                </span>
                {invalidRows.length > 0 && (
                  <span className="px-2.5 py-1.5 rounded-full bg-[#fef2f2] text-[#dc2626] font-semibold">
                    ✗ {invalidRows.length} with errors (will be skipped)
                  </span>
                )}
                {skippedRows.length > 0 && (
                  <span className="px-2.5 py-1.5 rounded-full bg-[#fff7ed] text-[#d97706] font-semibold">
                    ⊘ {skippedRows.length} over free limit
                  </span>
                )}
              </div>

              {/* Table */}
              <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <th className="text-left px-3 py-2.5 text-[#64748b] font-medium w-5">#</th>
                        <th className="text-left px-3 py-2.5 text-[#64748b] font-medium">Title</th>
                        <th className="text-left px-3 py-2.5 text-[#64748b] font-medium whitespace-nowrap">Date</th>
                        <th className="text-left px-3 py-2.5 text-[#64748b] font-medium">Credits</th>
                        <th className="text-left px-3 py-2.5 text-[#64748b] font-medium hidden sm:table-cell">Category</th>
                        <th className="text-left px-3 py-2.5 text-[#64748b] font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {parsedRows.map((r) => {
                        const willSkip = r._willSkip;
                        const hasError = r._errors.length > 0;
                        return (
                          <tr key={r._rowNum} className={hasError ? "bg-[#fef2f2]" : willSkip ? "bg-[#fffbeb] opacity-60" : ""}>
                            <td className="px-3 py-2 text-[#94a3b8]">{r._rowNum}</td>
                            <td className="px-3 py-2 font-medium text-[#111] max-w-[180px] truncate">{r.title || <span className="text-[#dc2626] italic">missing</span>}</td>
                            <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{r.activityDate || <span className="text-[#dc2626] italic">invalid</span>}</td>
                            <td className="px-3 py-2 text-[#374151]">{r.credits || "—"}</td>
                            <td className="px-3 py-2 text-[#64748b] capitalize hidden sm:table-cell">{r.category?.replace(/_/g, " ") || "—"}</td>
                            <td className="px-3 py-2">
                              {hasError ? (
                                <span className="text-[#dc2626] font-medium" title={r._errors.join("; ")}>Error</span>
                              ) : willSkip ? (
                                <span className="text-[#d97706]">Limit</span>
                              ) : (
                                <span className="text-[#16a34a] font-medium">Ready</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {invalidRows.length > 0 && (
                <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3 text-xs">
                  <p className="font-semibold text-[#dc2626] mb-1">Row errors:</p>
                  {invalidRows.slice(0, 5).map((r) => (
                    <p key={r._rowNum} className="text-[#dc2626]">Row {r._rowNum}: {r._errors.join("; ")}</p>
                  ))}
                  {invalidRows.length > 5 && <p className="text-[#dc2626]">…and {invalidRows.length - 5} more</p>}
                </div>
              )}

              <button
                onClick={() => { setStep("upload"); if (fileRef.current) fileRef.current.value = ""; }}
                className="text-xs text-[#64748b] hover:text-[#111] transition-colors"
              >
                ← Choose a different file
              </button>
            </div>
          )}

          {/* STEP: Done */}
          {step === "done" && result && (
            <div className="text-center py-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${result.imported > 0 ? "bg-[#dcfce7]" : "bg-[#f1f5f9]"}`}>
                <svg className={`w-7 h-7 ${result.imported > 0 ? "text-[#16a34a]" : "text-[#94a3b8]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-[#111] mb-1">
                {result.imported} activities imported
              </p>
              {result.skipped > 0 && (
                <p className="text-sm text-[#d97706] mt-1">
                  {result.skipped} skipped — free tier limit reached.{" "}
                  <a href="/pricing?source=csv_import_limit" className="font-semibold underline">Upgrade to Pro</a> to import all.
                </p>
              )}
              {result.errors.filter((e) => e.row >= 0).length > 0 && (
                <p className="text-sm text-[#dc2626] mt-1">
                  {result.errors.filter((e) => e.row >= 0).length} rows had errors and were skipped.
                </p>
              )}
              <p className="text-xs text-[#64748b] mt-3">
                Imported activities are pending admin verification. Credits will be added once verified.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-between gap-3 flex-shrink-0">
          {step !== "done" ? (
            <>
              <button
                onClick={onClose}
                className="text-sm font-medium border border-[#e2e8f0] text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              {step === "preview" && (
                <button
                  onClick={handleImport}
                  disabled={importing || validRows.length === 0}
                  className="text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
                >
                  {importing ? "Importing…" : `Import ${validRows.length} activit${validRows.length === 1 ? "y" : "ies"}`}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="ml-auto text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
