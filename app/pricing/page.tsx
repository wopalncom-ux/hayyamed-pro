import UpgradeButton from "@/components/pricing/UpgradeButton";

const FREE_FEATURES = [
  "Unlimited CME activity tracking",
  "Compliance dashboard",
  "Employer link requests",
  "QCHP / GCC authority support",
];

const PRO_FEATURES = [
  "Everything in Free",
  "PDF compliance reports (QCHP-ready)",
  "Email verification alerts",
  "License expiry warnings (30 & 7 days)",
  "Priority support",
];

const EMPLOYER_FEATURES = [
  "Everything in Pro",
  "Team compliance dashboard",
  "Bulk staff compliance reporting",
  "Staff link management & approvals",
  "Dedicated account manager",
];

function Check() {
  return (
    <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="text-[#1a56a0] font-bold text-lg">Hayya Med Pro</a>
          <a href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">Sign in</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[#64748b] max-w-xl mx-auto">
            Start free. Upgrade when you need PDF exports and automated reminders for license renewal.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-7 flex flex-col">
            <p className="text-sm font-medium text-[#64748b] mb-1">Free</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-[#111]">$0</span>
            </div>
            <p className="text-xs text-[#94a3b8] mb-6">Forever free</p>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                  <Check />{f}
                </li>
              ))}
            </ul>
            <a href="/register" className="block w-full text-center border border-[#e2e8f0] text-[#374151] py-3 rounded-xl font-semibold text-sm hover:bg-[#f8fafc] transition-colors">
              Get started free
            </a>
          </div>

          {/* Pro — highlighted */}
          <div className="bg-[#1a56a0] rounded-2xl p-7 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Most popular
            </div>
            <p className="text-sm font-medium text-blue-200 mb-1">Pro</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$49</span>
              <span className="text-blue-200 mb-1">/year</span>
            </div>
            <p className="text-xs text-blue-300 mb-6">≈ $4 per month · Billed annually</p>
            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <svg className="w-4 h-4 text-blue-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <UpgradeButton plan="pro" label="Upgrade to Pro — $49/year" />
          </div>

          {/* Employer */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-7 flex flex-col">
            <p className="text-sm font-medium text-[#64748b] mb-1">Employer</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-[#111]">$199</span>
              <span className="text-[#64748b] mb-1">/year</span>
            </div>
            <p className="text-xs text-[#94a3b8] mb-6">Per organization · Billed annually</p>
            <ul className="space-y-3 mb-8 flex-1">
              {EMPLOYER_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                  <Check />{f}
                </li>
              ))}
            </ul>
            <UpgradeButton plan="employer" label="Get Employer Plan" />
          </div>
        </div>

        {/* Reassurance */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#64748b]">
            All plans include secure data storage · No credit card required for Free ·{" "}
            <a href="/dashboard/settings" className="text-[#1a56a0] hover:underline">Cancel anytime</a>
          </p>
        </div>
      </div>
    </div>
  );
}
