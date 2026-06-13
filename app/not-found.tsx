import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — Hayya Med Pro",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href="/" className="text-base font-bold text-[#1a56a0]">
            Hayya Med Pro
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-lg">
          {/* Large 404 number */}
          <div className="relative mb-8">
            <p className="text-[120px] sm:text-[160px] font-black text-[#e2e8f0] leading-none select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white border-2 border-[#e2e8f0] rounded-2xl shadow-sm flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#111] mb-3">
            Page not found
          </h1>
          <p className="text-sm text-[#64748b] mb-10 leading-relaxed max-w-sm mx-auto">
            The URL may be mistyped, or this page may have moved. If you followed a link, let us know.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/dashboard"
              className="bg-[#1a56a0] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1547a0] transition-colors"
            >
              Go to dashboard
            </Link>
            <Link
              href="/"
              className="bg-white border border-[#e2e8f0] text-sm text-[#374151] font-medium px-6 py-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors"
            >
              Back to home
            </Link>
          </div>

          {/* Quick links */}
          <div className="border-t border-[#f1f5f9] pt-8">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">
              Quick links
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
              {[
                { href: "/dashboard/cme", label: "CME Wallet" },
                { href: "/dashboard/licenses", label: "Licenses" },
                { href: "/pricing", label: "Pricing" },
                { href: "/login", label: "Sign in" },
                { href: "/contact", label: "Contact support" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#1a56a0] hover:underline"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center pb-8 text-xs text-[#94a3b8]">
        Hayya Med Pro — Healthcare Professional Compliance Platform
      </footer>
    </div>
  );
}
