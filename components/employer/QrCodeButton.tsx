"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export default function QrCodeButton({ orgName }: { orgName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  async function openModal() {
    setOpen(true);
    if (svgContent) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/employer/qr-code");
      if (!res.ok) throw new Error("Failed to generate QR code");
      const text = await res.text();
      setSvgContent(text);
      track("employer_qr_code_viewed", { orgName });
    } catch {
      setError("Could not generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadSvg() {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orgName.replace(/\s+/g, "-").toLowerCase()}-invite-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    track("employer_qr_code_downloaded", { orgName });
    setTimeout(() => setDownloaded(false), 2500);
  }

  function downloadPng() {
    if (!svgContent) return;
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(img, 0, 0, 600, 600);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${orgName.replace(/\s+/g, "-").toLowerCase()}-invite-qr.png`;
      a.click();
      track("employer_qr_code_downloaded_png", { orgName });
    };
    img.src = url;
  }

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] transition-colors"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </svg>
        QR Code
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#111]">Staff Invitation QR Code</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#f8fafc] text-[#64748b] transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-[#64748b] mb-4">
              Print and display this QR code in your facility. Staff scan it to request access to your compliance dashboard.
            </p>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 flex items-center justify-center min-h-[260px]">
              {loading && (
                <div className="flex flex-col items-center gap-3 text-[#64748b]">
                  <svg className="w-6 h-6 animate-spin text-[#1a56a0]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm">Generating QR code…</span>
                </div>
              )}
              {error && <p className="text-sm text-[#dc2626] text-center">{error}</p>}
              {svgContent && !loading && (
                <div
                  className="w-full max-w-[240px]"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              )}
            </div>

            <p className="text-xs text-[#94a3b8] text-center mt-2 mb-4">{orgName}</p>

            {svgContent && (
              <div className="flex gap-2">
                <button
                  onClick={downloadSvg}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium bg-[#1a56a0] text-white px-4 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors"
                >
                  {downloaded ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Saved!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download SVG
                    </>
                  )}
                </button>
                <button
                  onClick={downloadPng}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium border border-[#e2e8f0] text-[#374151] px-4 py-2.5 rounded-lg hover:bg-[#f8fafc] transition-colors"
                >
                  PNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
