"use client";

import { useState, useRef } from "react";
import { importStaffCsv, ImportResult } from "./actions";

const OUTCOME_CONFIG = {
  linked:        { label: "Linked",          bg: "bg-[#dcfce7] text-[#16a34a]" },
  invited:       { label: "Invited",         bg: "bg-[#eff6ff] text-[#1a56a0]" },
  already_linked:{ label: "Already linked",  bg: "bg-[#f1f5f9] text-[#64748b]" },
  error:         { label: "Error",           bg: "bg-[#fef2f2] text-[#dc2626]" },
};

export default function StaffImportClient() {
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!csvText.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);

    const res = await importStaffCsv(csvText);
    setLoading(false);

    if ("error" in res) {
      setError(res.error);
    } else {
      setResults(res.results);
    }
  }

  function handleReset() {
    setCsvText("");
    setResults(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // Summary counts
  const linked = results?.filter((r) => r.outcome === "linked").length ?? 0;
  const invited = results?.filter((r) => r.outcome === "invited").length ?? 0;
  const alreadyLinked = results?.filter((r) => r.outcome === "already_linked").length ?? 0;
  const errors = results?.filter((r) => r.outcome === "error").length ?? 0;

  if (results) {
    return (
      <div>
        {/* Summary */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Import Complete</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#16a34a]">{linked}</p>
              <p className="text-xs text-[#64748b] mt-1">Linked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1a56a0]">{invited}</p>
              <p className="text-xs text-[#64748b] mt-1">Invited</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#64748b]">{alreadyLinked}</p>
              <p className="text-xs text-[#64748b] mt-1">Already linked</p>
            </div>
            {errors > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-[#dc2626]">{errors}</p>
                <p className="text-xs text-[#64748b] mt-1">Errors</p>
              </div>
            )}
          </div>
        </div>

        {/* Row-level results */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Results</h2>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {results.map((r, i) => {
              const cfg = OUTCOME_CONFIG[r.outcome];
              return (
                <div key={i} className="px-6 py-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-[#374151] font-mono">{r.email}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg}`}>
                      {cfg.label}
                    </span>
                    {r.reason && <span className="text-xs text-[#dc2626]">{r.reason}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href="/employer"
            className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1547a0] transition-colors"
          >
            View Staff Dashboard
          </a>
          <button
            onClick={handleReset}
            className="text-sm text-[#64748b] hover:text-[#111] px-4 py-2 rounded-lg border border-[#e2e8f0] transition-colors"
          >
            Import Another File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <h2 className="text-base font-semibold text-[#111] mb-4">Upload CSV</h2>

      {/* File upload */}
      <div className="mb-4">
        <label className="text-xs font-medium text-[#374151] block mb-1.5">Select CSV file</label>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          className="block text-sm text-[#374151] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#eff6ff] file:text-[#1a56a0] hover:file:bg-[#dbeafe] cursor-pointer"
        />
      </div>

      {/* Or paste CSV */}
      <div className="mb-4">
        <label className="text-xs font-medium text-[#374151] block mb-1.5">Or paste CSV text</label>
        <textarea
          rows={8}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="email,first_name,last_name&#10;dr.ali@hospital.qa,Ali,Smith"
          className="w-full text-xs font-mono border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30 resize-none"
        />
      </div>

      {error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-[#dc2626]">{error}</p>
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={!csvText.trim() || loading}
        className="text-sm bg-[#1a56a0] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#1547a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Importing…" : "Import Staff"}
      </button>
    </div>
  );
}
