"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Row {
  title: string;
  credits: string;
  activity_date: string;
  category: string;
  provider: string;
  accreditor: string;
}

const REQUIRED_COLS = ["title", "credits", "activity_date"];
const ALLOWED_CATEGORIES = [
  "clinical", "educational", "research", "teaching", "professional",
  "conference", "online", "journal", "simulation", "other",
];

function parseCSV(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z_]/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return {
      title:         row.title ?? "",
      credits:       row.credits ?? "",
      activity_date: row.activity_date ?? row.date ?? "",
      category:      row.category ?? "clinical",
      provider:      row.provider ?? "",
      accreditor:    row.accreditor ?? "",
    };
  });
}

function validateRow(row: Row, i: number): string | null {
  if (!row.title.trim()) return `Row ${i + 1}: title is required`;
  const credits = parseFloat(row.credits);
  if (isNaN(credits) || credits <= 0 || credits > 100) return `Row ${i + 1}: credits must be a number between 0 and 100`;
  if (!row.activity_date) return `Row ${i + 1}: activity_date is required`;
  const d = new Date(row.activity_date);
  if (isNaN(d.getTime())) return `Row ${i + 1}: activity_date "${row.activity_date}" is not a valid date`;
  if (d > new Date()) return `Row ${i + 1}: activity_date cannot be in the future`;
  return null;
}

const CSV_TEMPLATE = `title,credits,activity_date,category,provider,accreditor
Advanced Cardiology Workshop,4,2026-03-15,clinical,Hamad Medical,QCHP
Online Diabetes Management Course,2,2026-02-20,online,SCFHS eLearning,SCFHS
Annual CME Conference,8,2026-01-10,conference,DHA,DHA`;

export default function BulkCmeImport() {
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "submitting" | "done" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [importedCount, setImportedCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cme-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setErrors(["Please upload a .csv file."]);
      return;
    }
    setStatus("uploading");
    const text = await file.text();
    const parsed = parseCSV(text);
    if (parsed.length === 0) {
      setErrors(["No data rows found. Ensure your CSV has a header row and at least one data row."]);
      setStatus("idle");
      return;
    }
    const validationErrors = parsed.map((row, i) => validateRow(row, i)).filter(Boolean) as string[];
    setRows(parsed);
    setErrors(validationErrors);
    setStatus("idle");
  }

  async function handleSubmit() {
    if (errors.length > 0 || rows.length === 0) return;
    setStatus("submitting");
    setSubmitError("");
    try {
      const res = await fetch("/api/cme/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json() as { count?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      setImportedCount(data.count ?? rows.length);
      setStatus("done");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Import failed");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[#111] mb-2">Import complete</h2>
        <p className="text-sm text-[#64748b] mb-6">{importedCount} CME activities imported successfully.</p>
        <button
          onClick={() => router.push("/dashboard/cme")}
          className="text-sm font-semibold bg-[#1a56a0] text-white px-6 py-2.5 rounded-lg hover:bg-[#154890] transition-colors"
        >
          View my CME activities →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Download template */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-1">Step 1 — Download the CSV template</h2>
        <p className="text-sm text-[#64748b] mb-4">
          Fill in your historical CME activities using this template. Required columns: title, credits, activity_date.
        </p>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 text-sm font-semibold border border-[#e2e8f0] px-4 py-2 rounded-lg text-[#374151] hover:bg-[#f8fafc] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download template (CSV)
        </button>
        <div className="mt-4 text-xs text-[#64748b] space-y-1">
          <p><strong>Columns:</strong> title · credits · activity_date (YYYY-MM-DD) · category · provider · accreditor</p>
          <p><strong>Category options:</strong> {ALLOWED_CATEGORIES.join(", ")}</p>
        </div>
      </div>

      {/* Step 2: Upload */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-1">Step 2 — Upload your completed CSV</h2>
        <p className="text-sm text-[#64748b] mb-4">Maximum 200 activities per import.</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="inline-flex items-center gap-2 text-sm font-semibold bg-[#f1f5f9] border border-[#e2e8f0] px-4 py-2 rounded-lg text-[#374151] hover:bg-[#e2e8f0] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Choose CSV file
          </span>
          <input ref={fileRef} type="file" accept=".csv" className="sr-only" onChange={handleFile} />
          {rows.length > 0 && (
            <span className="text-sm text-[#64748b]">{rows.length} rows loaded</span>
          )}
        </label>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#dc2626] mb-2">{errors.length} validation error{errors.length !== 1 ? "s" : ""}</p>
          <ul className="text-xs text-[#dc2626] space-y-1">
            {errors.slice(0, 10).map((e, i) => <li key={i}>• {e}</li>)}
            {errors.length > 10 && <li>…and {errors.length - 10} more</li>}
          </ul>
        </div>
      )}

      {/* Preview table */}
      {rows.length > 0 && errors.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#111]">
              Step 3 — Preview and confirm
            </h2>
            <span className="text-xs text-[#64748b]">{rows.length} activities</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  {["Title", "Credits", "Date", "Category", "Provider", "Accreditor"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-semibold text-[#64748b] uppercase text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {rows.slice(0, 50).map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 max-w-[180px] truncate text-[#111]">{row.title}</td>
                    <td className="px-4 py-2.5 text-[#64748b]">{row.credits}</td>
                    <td className="px-4 py-2.5 text-[#64748b]">{row.activity_date}</td>
                    <td className="px-4 py-2.5 text-[#64748b]">{row.category || "clinical"}</td>
                    <td className="px-4 py-2.5 max-w-[140px] truncate text-[#64748b]">{row.provider || "—"}</td>
                    <td className="px-4 py-2.5 max-w-[120px] truncate text-[#64748b]">{row.accreditor || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 50 && (
            <p className="px-5 py-3 text-xs text-[#64748b] border-t border-[#e2e8f0]">
              Showing first 50 of {rows.length} rows. All {rows.length} will be imported.
            </p>
          )}
          <div className="px-5 py-4 border-t border-[#e2e8f0] flex items-center justify-between">
            <p className="text-sm text-[#64748b]">
              {rows.length} activities will be added with <strong>pending</strong> verification status.
            </p>
            <button
              onClick={handleSubmit}
              disabled={status === "submitting"}
              className="text-sm font-semibold bg-[#1a56a0] text-white px-6 py-2.5 rounded-lg hover:bg-[#154890] transition-colors disabled:opacity-60"
            >
              {status === "submitting" ? "Importing…" : `Import ${rows.length} activities`}
            </button>
          </div>
          {(status === "error" && submitError) && (
            <p className="px-5 pb-4 text-sm text-[#dc2626]">{submitError}</p>
          )}
        </div>
      )}
    </div>
  );
}
