import type { Metadata } from "next";
import WaitlistForm from "./WaitlistForm";

export const metadata: Metadata = {
  title: "Hayya Med Pro — Coming Soon",
  description: "CME tracking and license compliance for GCC healthcare professionals. Launching soon.",
  robots: { index: false, follow: false },
};

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    text: "Track CME credits for QCHP, SCFHS, DHA, DOH, OMSB, NHRA, and more",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
    text: "License expiry alerts — never miss a renewal deadline again",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    text: "AI compliance gap analysis — know exactly what you need before renewal",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    text: "Regulator-ready PDF reports — QCHP, SCFHS, DHA submission-ready",
  },
];

const COUNTRIES = ["Qatar", "Saudi Arabia", "UAE", "Kuwait", "Bahrain", "Oman"];

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#1a56a0] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#111]">
            Hayya Med <span className="text-[#1a56a0]">Pro</span>
          </span>
        </div>

        {/* Status pill */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-full px-4 py-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
            <span className="text-sm font-medium text-[#64748b]">Launching soon in Qatar &amp; GCC</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111] text-center leading-tight mb-4">
          CME compliance made<br />
          <span className="text-[#1a56a0]">simple for GCC doctors</span>
        </h1>

        <p className="text-center text-[#64748b] text-base max-w-md mx-auto leading-relaxed mb-8">
          Hayya Med Pro tracks your CME credits, monitors license deadlines, and prepares
          renewal-ready reports for QCHP, SCFHS, DHA, and 7 GCC regulatory bodies.
        </p>

        {/* Email capture */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-sm font-semibold text-[#111] mb-1">Get early access</p>
          <p className="text-xs text-[#64748b] mb-4">Be first to know when we launch. Free to join — no credit card.</p>
          <WaitlistForm />
        </div>

        {/* Feature list */}
        <div className="space-y-3 mb-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#1a56a0] flex items-center justify-center flex-shrink-0 mt-0.5">
                {f.icon}
              </div>
              <p className="text-sm text-[#374151] leading-relaxed pt-1.5">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Country flags row */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {COUNTRIES.map((c) => (
            <span key={c} className="text-xs text-[#64748b] bg-white border border-[#e2e8f0] px-2.5 py-1 rounded-full">
              {c}
            </span>
          ))}
        </div>

        {/* Already have account */}
        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-[#1a56a0] font-medium hover:underline"
          >
            Already registered? Sign in →
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#94a3b8]">
          <a href="/privacy" className="hover:text-[#64748b]">Privacy Policy</a>
          <span>·</span>
          <a href="/terms" className="hover:text-[#64748b]">Terms</a>
          <span>·</span>
          <a href="mailto:support@hayyamed.pro" className="hover:text-[#64748b]">support@hayyamed.pro</a>
        </div>
      </div>
    </div>
  );
}
