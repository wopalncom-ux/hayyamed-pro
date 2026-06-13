const BENEFITS = [
  "Track CME credits for QCHP, SCFHS, DHA, and all GCC authorities",
  "AI-powered compliance gap analysis powered by Claude",
  "Download your official PDF compliance report in seconds",
  "Connect to your employer and share only what you choose",
];

const AUTHORITIES = ["QCHP", "SCFHS", "DHA", "DOH", "NHRA", "OMSB"];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — trust & social proof — desktop only */}
      <aside className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col bg-[#0f1f3d] px-10 py-12 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-9 h-9 rounded-lg bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">Hayya Med <span className="text-[#60a5fa]">Pro</span></span>
        </div>

        {/* Headline */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white leading-snug mb-3">
            Stay compliant.<br />
            Renew with confidence.
          </h2>
          <p className="text-[rgba(255,255,255,0.6)] text-sm leading-relaxed">
            CME & CPD tracking for healthcare professionals across Qatar, Saudi Arabia, UAE, and the GCC.
          </p>
        </div>

        {/* Benefits */}
        <ul className="space-y-4 mb-10">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#1a56a0] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-sm text-[rgba(255,255,255,0.8)] leading-snug">{b}</span>
            </li>
          ))}
        </ul>

        {/* Trial callout */}
        <div className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.12)] rounded-xl px-4 py-4 mb-10">
          <p className="text-xs font-semibold text-[#86efac] uppercase tracking-wide mb-1">Free to start</p>
          <p className="text-sm font-bold text-white mb-0.5">14-day Pro trial included</p>
          <p className="text-xs text-[rgba(255,255,255,0.5)]">No credit card required · Cancel anytime</p>
        </div>

        {/* Authority strip */}
        <div className="mt-auto">
          <p className="text-xs text-[rgba(255,255,255,0.35)] mb-2 uppercase tracking-wide">Supports</p>
          <div className="flex flex-wrap gap-2">
            {AUTHORITIES.map((a) => (
              <span key={a} className="text-xs font-medium bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.1)] px-2.5 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-[rgba(255,255,255,0.25)] mt-6 leading-relaxed">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
          </p>
        </div>
      </aside>

      {/* Right panel — form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[#f0f4f8]">
        <div className="w-full max-w-md">
          {/* Mobile-only logo (left panel is hidden) */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1a56a0]">Hayya Med Pro</span>
            </div>
            <p className="text-sm text-[#64748b]">Healthcare Professional Platform</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
