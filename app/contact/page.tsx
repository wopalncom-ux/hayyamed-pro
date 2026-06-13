import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Support — Hayya Med Pro",
  description: "Get help with CME tracking, licensing, or your Hayya Med Pro account. We respond within 24 hours for Pro users.",
  alternates: { canonical: "https://hayyamed.pro/contact" },
  openGraph: {
    title: "Contact Support — Hayya Med Pro",
    description: "Get help with CME tracking, licensing, or your Hayya Med Pro account.",
    url: "https://hayyamed.pro/contact",
    type: "website",
    images: [{ url: "https://hayyamed.pro/api/og?t=Contact+Support&s=We+respond+within+24+hours&a=Support&k=Contact", width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</a>
          <div className="flex items-center gap-4 text-sm">
            <a href="/help" className="text-[#64748b] hover:text-[#111] transition-colors">Help & FAQ</a>
            <a href="/login" className="text-[#1a56a0] font-medium hover:underline">Sign in</a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#111] mb-2">Contact Support</h1>
          <p className="text-sm text-[#64748b]">
            We typically respond within 24 hours. For urgent CME or compliance questions, check the{" "}
            <a href="/help" className="text-[#1a56a0] hover:underline">Help & FAQ</a> page first.
          </p>
        </div>

        <ContactForm />

        <div className="mt-8 pt-6 border-t border-[#e2e8f0] text-xs text-[#94a3b8] space-y-1">
          <p>Response times: &lt;24 hours for Pro plan · &lt;72 hours for Free plan</p>
          <p>
            <a href="/privacy" className="hover:text-[#374151] transition-colors">Privacy Policy</a>
            {" · "}
            <a href="/terms" className="hover:text-[#374151] transition-colors">Terms of Service</a>
          </p>
        </div>
      </main>
    </div>
  );
}
