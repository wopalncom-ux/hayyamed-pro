import Link from "next/link";

const FOOTER_COLS = [
  {
    heading: "Platform",
    links: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Security", href: "/security" },
      { label: "For Employers", href: "/employers" },
      { label: "For Training Providers", href: "/for-providers" },
      { label: "For Universities", href: "/for-universities" },
      { label: "Compliance Software", href: "/healthcare-compliance-software" },
      { label: "For Government", href: "/for-government" },
      { label: "CME Report PDF", href: "/cme-compliance-report" },
      { label: "CME Calculator", href: "/cme-calculator" },
      { label: "Pricing", href: "/pricing" },
      { label: "CME Tracker", href: "/cme-tracker" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Help & FAQ", href: "/help" },
      { label: "System Status", href: "/status" },
    ],
  },
  {
    heading: "CME by Country",
    links: [
      { label: "QCHP — Qatar", href: "/qchp" },
      { label: "SCFHS — Saudi Arabia", href: "/scfhs" },
      { label: "DHA — Dubai", href: "/dha" },
      { label: "DOH — Abu Dhabi", href: "/doh" },
      { label: "MOH — Kuwait", href: "/moh-kuwait" },
      { label: "NHRA — Bahrain", href: "/nhra" },
      { label: "OMSB — Oman", href: "/omsb" },
      { label: "Compare all countries", href: "/countries" },
      { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
      { label: "GCC renewal guide", href: "/gcc-medical-license-renewal" },
    ],
  },
  {
    heading: "CME by Profession",
    links: [
      { label: "Physicians", href: "/physician-cme" },
      { label: "Nurses", href: "/nurse-cpd" },
      { label: "Pharmacists", href: "/pharmacist-cme" },
      { label: "Dentists", href: "/dentist-cme" },
      { label: "Allied Health", href: "/allied-health-cpd" },
      { label: "CME vs CPD explained", href: "/cme-vs-cpd" },
    ],
  },
  {
    heading: "CME by Specialty",
    links: [
      { label: "Cardiology", href: "/cardiology-cme" },
      { label: "Internal Medicine", href: "/internal-medicine-cme" },
      { label: "Emergency Medicine", href: "/emergency-medicine-cme" },
      { label: "Surgery", href: "/surgery-cme" },
      { label: "Pediatrics", href: "/pediatrics-cme" },
      { label: "Radiology", href: "/radiology-cme" },
      { label: "Psychiatry", href: "/psychiatry-cme" },
      { label: "OB / Gynecology", href: "/obstetrics-gynecology-cme" },
      { label: "Anesthesia", href: "/anesthesia-cme" },
      { label: "Orthopedics", href: "/orthopedics-cme" },
      { label: "Family Medicine", href: "/family-medicine-cme" },
      { label: "Dermatology", href: "/dermatology-cme" },
      { label: "Neurology", href: "/neurology-cme" },
      { label: "Nephrology", href: "/nephrology-cme" },
      { label: "Ophthalmology", href: "/ophthalmology-cme" },
      { label: "Oncology", href: "/oncology-cme" },
      { label: "Gastroenterology", href: "/gastroenterology-cme" },
      { label: "Endocrinology", href: "/endocrinology-cme" },
      { label: "Urology", href: "/urology-cme" },
      { label: "Infectious Disease", href: "/infectious-disease-cme" },
      { label: "Pulmonology", href: "/pulmonology-cme" },
      { label: "Rheumatology", href: "/rheumatology-cme" },
      { label: "ENT / Otolaryngology", href: "/ent-cme" },
      { label: "Hematology", href: "/hematology-cme" },
      { label: "Geriatrics", href: "/geriatrics-cme" },
      { label: "Pathology", href: "/pathology-cme" },
      { label: "Neurosurgery", href: "/neurosurgery-cme" },
      { label: "Plastic Surgery", href: "/plastic-surgery-cme" },
      { label: "Physical Medicine", href: "/physical-medicine-cme" },
      { label: "Vascular Surgery", href: "/vascular-surgery-cme" },
      { label: "Critical Care", href: "/critical-care-cme" },
      { label: "Occupational Medicine", href: "/occupational-medicine-cme" },
      { label: "Neonatology", href: "/neonatology-cme" },
      { label: "Allergy & Immunology", href: "/allergy-immunology-cme" },
      { label: "Nuclear Medicine", href: "/nuclear-medicine-cme" },
      { label: "Sports Medicine", href: "/sports-medicine-cme" },
      { label: "Interventional Radiology", href: "/interventional-radiology-cme" },
      { label: "Aesthetic Medicine", href: "/aesthetic-medicine-cme" },
      { label: "Palliative Care", href: "/palliative-care-cme" },
      { label: "Cardiothoracic Surgery", href: "/cardiothoracic-surgery-cme" },
    ],
  },
  {
    heading: "Renewal Guides",
    links: [
      { label: "QCHP renewal — Qatar", href: "/qchp-renewal" },
      { label: "SCFHS renewal — Saudi Arabia", href: "/scfhs-renewal" },
      { label: "DHA renewal — Dubai", href: "/dha-renewal" },
      { label: "DOH renewal — Abu Dhabi", href: "/doh-renewal" },
      { label: "All GCC renewals", href: "/gcc-medical-license-renewal" },
    ],
  },
  {
    heading: "International",
    links: [
      { label: "Global CME requirements", href: "/global-cme-requirements" },
      { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
      { label: "UK — GMC CPD", href: "/gmc-cpd" },
      { label: "Australia — AHPRA CPD", href: "/ahpra-cpd" },
      { label: "India — NMC CME", href: "/nmc-india-cme" },
      { label: "Egypt — EMS CME", href: "/egypt-cme" },
      { label: "Jordan — JMC CME", href: "/jordan-cme" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Data Processing Agreement", href: "/legal/dpa" },
      { label: "Sign in", href: "/login" },
      { label: "Register free", href: "/register" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#f8fafc] border-t border-[#e2e8f0] px-6 pt-12 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center" aria-hidden="true">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <p className="text-xs text-[#64748b] leading-relaxed max-w-[180px] mb-3">
              CME tracking and licensing compliance for GCC healthcare professionals.
            </p>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              Powered by{" "}
              <span className="font-semibold text-[#64748b]">Hayya Med AI</span>
              <br />
              Registered in Qatar&nbsp;🇶🇦
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#e2e8f0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <p className="text-xs text-[#94a3b8]">© {new Date().getFullYear()} Hayya Med AI. All rights reserved.</p>
            <span className="hidden sm:inline text-[#e2e8f0]">·</span>
            <p className="hidden sm:block text-xs text-[#94a3b8]">Registered in Qatar&nbsp;🇶🇦</p>
          </div>
          <p className="text-xs text-[#94a3b8] text-center max-w-xl">
            Supports CME/CPD tracking. Does not issue licenses. Verify requirements with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait.
          </p>
        </div>
      </div>
    </footer>
  );
}
