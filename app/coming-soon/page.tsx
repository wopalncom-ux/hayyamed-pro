import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hayya Med Pro — Coming Soon",
  description: "CME tracking and license compliance for GCC healthcare professionals. Launching soon.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6">
      {/* Logo mark */}
      <div className="mb-8 flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1a56a0] shadow-lg">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 3a9 9 0 110 18A9 9 0 0116 7zm-1 4v6.414l4.293 4.293 1.414-1.414L17 16.586V11h-2z" fill="white" />
        </svg>
      </div>

      {/* Brand */}
      <h1 className="text-3xl font-bold text-[#111] tracking-tight mb-2">
        Hayya Med <span className="text-[#1a56a0]">Pro</span>
      </h1>

      {/* Status pill */}
      <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-full px-4 py-1.5 mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
        <span className="text-sm font-medium text-[#64748b]">Coming Soon</span>
      </div>

      {/* Message */}
      <p className="text-center text-[#64748b] text-base max-w-sm leading-relaxed mb-8">
        We&apos;re putting the finishing touches on something built for GCC healthcare professionals.
        Check back soon.
      </p>

      {/* Divider */}
      <div className="w-12 h-px bg-[#e2e8f0] mb-8" />

      {/* Contact */}
      <p className="text-sm text-[#94a3b8]">
        Questions?{" "}
        <a
          href="mailto:support@hayyamed.pro"
          className="text-[#1a56a0] hover:underline"
        >
          support@hayyamed.pro
        </a>
      </p>
    </div>
  );
}
