"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm font-medium text-[#1a56a0] border border-[#1a56a0] px-3 py-1.5 rounded-lg hover:bg-[#f0f7ff] transition-colors print:hidden"
    >
      Print / Download
    </button>
  );
}
