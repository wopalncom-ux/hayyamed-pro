import Link from "next/link";

const PRODUCT = [
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
  { label: "CME Tracker", href: "/cme-tracker" },
  { label: "CME Calculator", href: "/cme-calculator" },
  { label: "CME Report PDF", href: "/cme-compliance-report" },
  { label: "System Status", href: "/status" },
];

const SOLUTIONS = [
  { label: "For Employers", href: "/employers" },
  { label: "For Training Providers", href: "/for-providers" },
  { label: "For Universities", href: "/for-universities" },
  { label: "For Government", href: "/for-government" },
  { label: "Healthcare Compliance", href: "/healthcare-compliance-software" },
  { label: "API Documentation", href: "/developers" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Help & FAQ", href: "/help" },
];

const CME_BY_COUNTRY = [
  { label: "QCHP — Qatar", href: "/qchp" },
  { label: "SCFHS — Saudi Arabia", href: "/scfhs" },
  { label: "DHA — Dubai", href: "/dha" },
  { label: "DOH — Abu Dhabi", href: "/doh" },
  { label: "MOH — Kuwait", href: "/moh-kuwait" },
  { label: "NHRA — Bahrain", href: "/nhra" },
  { label: "OMSB — Oman", href: "/omsb" },
  { label: "Compare all countries", href: "/countries" },
  { label: "CME requirements", href: "/cme-requirements" },
  { label: "CPD requirements", href: "/cpd-requirements" },
  { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
  { label: "Medical licence renewal", href: "/medical-license-renewal" },
];

const CME_BY_PROFESSION = [
  { label: "Physicians", href: "/physician-cme" },
  { label: "Nurses", href: "/nurse-cpd" },
  { label: "Pharmacists", href: "/pharmacist-cme" },
  { label: "Dentists", href: "/dentist-cme" },
  { label: "Allied Health", href: "/allied-health-cpd" },
  { label: "CME vs CPD explained", href: "/cme-vs-cpd" },
  { label: "CME requirements", href: "/cme-requirements" },
  { label: "CPD requirements", href: "/cpd-requirements" },
];

// Top 12 specialties — full list at /specialties
const TOP_SPECIALTIES = [
  { label: "Cardiology", href: "/cardiology-cme" },
  { label: "Internal Medicine", href: "/internal-medicine-cme" },
  { label: "Emergency Medicine", href: "/emergency-medicine-cme" },
  { label: "Surgery", href: "/surgery-cme" },
  { label: "Pediatrics", href: "/pediatrics-cme" },
  { label: "Family Medicine", href: "/family-medicine-cme" },
  { label: "Psychiatry", href: "/psychiatry-cme" },
  { label: "Radiology", href: "/radiology-cme" },
  { label: "Anesthesia", href: "/anesthesia-cme" },
  { label: "Orthopedics", href: "/orthopedics-cme" },
  { label: "Neurology", href: "/neurology-cme" },
  { label: "Oncology", href: "/oncology-cme" },
];

const GUIDES = [
  { label: "QCHP renewal — Qatar", href: "/qchp-renewal" },
  { label: "SCFHS renewal — Saudi Arabia", href: "/scfhs-renewal" },
  { label: "DHA renewal — Dubai", href: "/dha-renewal" },
  { label: "DOH renewal — Abu Dhabi", href: "/doh-renewal" },
  { label: "All GCC renewals", href: "/gcc-medical-license-renewal" },
  { label: "UK — GMC CPD", href: "/gmc-cpd" },
  { label: "Australia — AHPRA CPD", href: "/ahpra-cpd" },
  { label: "India — NMC CME", href: "/nmc-india-cme" },
  { label: "Egypt — EMS CME", href: "/egypt-cme" },
  { label: "Jordan — JMC CME", href: "/jordan-cme" },
];

const LEGAL = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Data Processing Agreement", href: "/legal/dpa" },
  { label: "Service Level Agreement", href: "/legal/sla" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#f8fafc] border-t border-[#e2e8f0] px-6 pt-12 pb-8">
      <div className="max-w-7xl mx-auto">

        {/* Top section — brand + 5 main columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center" aria-hidden="true">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <p className="text-xs text-[#64748b] leading-relaxed max-w-[180px] mb-4">
              CME tracking and licensing compliance for GCC healthcare professionals.
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href="/register" className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#1a56a0] text-white text-xs font-semibold hover:bg-[#1547a0] transition-colors">
                Register free
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#64748b] text-xs font-medium hover:text-[#1a56a0] hover:border-[#1a56a0] transition-colors">
                Sign in
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">Product</p>
            <ul className="space-y-2">
              {PRODUCT.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">Solutions</p>
            <ul className="space-y-2">
              {SOLUTIONS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CME by Country */}
          <div>
            <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">CME by Country</p>
            <ul className="space-y-2">
              {CME_BY_COUNTRY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CME by Profession */}
          <div>
            <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">CME by Profession</p>
            <ul className="space-y-2 mb-6">
              {CME_BY_PROFESSION.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">Legal</p>
            <ul className="space-y-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides & International */}
          <div>
            <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">Renewal Guides</p>
            <ul className="space-y-2">
              {GUIDES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CME by Specialty — full-width strip with 4-col grid */}
        <div className="border-t border-[#e2e8f0] pt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide">CME by Specialty</p>
            <Link href="/specialties" className="text-xs text-[#1a56a0] hover:underline font-medium">
              View all specialties →
            </Link>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-2">
            {TOP_SPECIALTIES.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e2e8f0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <p className="text-xs text-[#64748b]">© {new Date().getFullYear()} Hayya Med AI. All rights reserved.</p>
            <span className="hidden sm:inline text-[#e2e8f0]">·</span>
            <p className="hidden sm:block text-xs text-[#64748b]">Registered in Qatar 🇶🇦</p>
          </div>
          <p className="text-xs text-[#64748b] text-center max-w-xl">
            Supports CME/CPD tracking. Does not issue licenses. Verify requirements with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait.
          </p>
        </div>
      </div>
    </footer>
  );
}
