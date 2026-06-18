import type { Metadata } from "next";
import Link from "next/link";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Beta Feedback — Hayya Med Pro",
  description: "Share your experience with Hayya Med Pro and help us improve the platform for healthcare professionals across Qatar and the GCC.",
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</Link>
          <Link href="/dashboard" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#1a56a0] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Beta Programme
          </div>
          <h1 className="text-2xl font-bold text-[#111] mb-3">Share your feedback</h1>
          <p className="text-sm text-[#64748b]">
            Thank you for testing Hayya Med Pro. Your experience directly shapes the platform for
            healthcare professionals across Qatar and the GCC.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <FeedbackForm />
        </div>

        <p className="text-xs text-[#64748b] text-center mt-6">
          Hayya Med Pro · Healthcare Professional Platform · Qatar ·{" "}
          <Link href="/privacy" className="hover:text-[#374151] transition-colors">Privacy Policy</Link>
        </p>
      </main>
    </div>
  );
}
