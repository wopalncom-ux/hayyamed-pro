import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Hayya Med Pro â€” Healthcare CME Compliance Platform for the GCC",
  description:
    "Hayya Med Pro is a healthcare SaaS platform built in Qatar for GCC healthcare professionals â€” CME tracking, CPD compliance, licensing readiness, and employer staff management across QCHP, SCFHS, DHA, DOH, NHRA, OMSB, and more.",
  alternates: { canonical: "https://hayyamed.pro/about" },
  openGraph: {
    title: "About Hayya Med Pro â€” Healthcare CME Platform for the GCC",
    description: "Built in Qatar for GCC healthcare professionals. CME tracking, CPD compliance, licensing readiness, and employer staff management across 7 GCC countries.",
    url: "https://hayyamed.pro/about",
    type: "website",
    images: [{ url: `https://hayyamed.pro/api/og?t=About+Hayya+Med+Pro&s=Built+in+Qatar+%C2%B7+7+GCC+countries+%C2%B7+CME+%26+CPD+compliance+platform&a=%F0%9F%87%B6%F0%9F%87%A6+Hayya+Med&k=About`, width: 1200, height: 630 }],
  },
};

const stats = [
  { n: "7", label: "GCC countries" },
  { n: "8", label: "Licensing authorities" },
  { n: "100%", label: "Rules-engine driven" },
  { n: "0", label: "Hardcoded rules" },
];

const authorities = [
  { name: "QCHP", full: "Qatar Council for Healthcare Practitioners", country: "Qatar", flag: "ðŸ‡¶ðŸ‡¦" },
  { name: "SCFHS", full: "Saudi Commission for Health Specialties", country: "Saudi Arabia", flag: "ðŸ‡¸ðŸ‡¦" },
  { name: "DHA", full: "Dubai Health Authority", country: "UAE (Dubai)", flag: "ðŸ‡¦ðŸ‡ª" },
  { name: "DOH", full: "Department of Health Abu Dhabi", country: "UAE (Abu Dhabi)", flag: "ðŸ‡¦ðŸ‡ª" },
  { name: "MOH", full: "Ministry of Health Kuwait", country: "Kuwait", flag: "ðŸ‡°ðŸ‡¼" },
  { name: "NHRA", full: "National Health Regulatory Authority", country: "Bahrain", flag: "ðŸ‡§ðŸ‡­" },
  { name: "OMSB", full: "Oman Medical Specialty Board", country: "Oman", flag: "ðŸ‡´ðŸ‡²" },
];

const principles = [
  {
    icon: "ðŸŽ¯",
    title: "Accuracy over convenience",
    body: "Every compliance rule is sourced from official authority publications â€” not estimates. Wrong compliance advice is a liability, not just an inconvenience.",
  },
  {
    icon: "ðŸ”’",
    title: "Privacy by design",
    body: "Professionals control exactly what their employer can see. Compliance visibility doesn't require surrendering personal health data.",
  },
  {
    icon: "ðŸŒ",
    title: "Built for scale, not one country",
    body: "The platform has no hardcoded country logic. Every rule lives in a configurable engine â€” adding a new country or authority requires no code deployment.",
  },
  {
    icon: "ðŸ“±",
    title: "Mobile-first, always",
    body: "The platform is designed for a doctor who has 90 seconds between patients. Every feature works on mobile, and critical actions are offline-capable.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="text-sm font-bold text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/pricing" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">Pricing</Link>
            <Link href="/employers" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">For Employers</Link>
            <Link href="/login" className="text-[#1a56a0] font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-[#0f1f3d] py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-[#1a3563] border border-[#2a4a7f] text-[#93c5fd] text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Built in Qatar Â· For GCC Healthcare
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Healthcare compliance shouldn&apos;t require a spreadsheet
            </h1>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
              Hayya Med Pro is a healthcare SaaS platform that tracks CME credits, manages licensing
              readiness, and helps GCC healthcare professionals and their employers stay compliant â€”
              without the paperwork.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="bg-[#1a3563] border-b border-[#2a4a7f]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why we built this */}
        <section className="py-14 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-5">Why we built this</h2>
            <div className="space-y-4 text-[#374151] leading-relaxed text-[0.95rem]">
              <p>
                GCC healthcare professionals face a specific compliance challenge: each country has its
                own licensing authority, its own terminology (some say CME, others say CPD), its own
                credit requirements, its own category caps, and its own renewal cycles. A physician
                licensed in both Qatar and Saudi Arabia is managing two completely different compliance
                systems simultaneously.
              </p>
              <p>
                The current solution for most professionals is a combination of a spreadsheet, a folder
                of PDF certificates, and a recurring anxiety about whether they&apos;ve logged everything
                correctly before their renewal deadline. For employers â€” hospitals, clinics, health
                networks â€” the problem compounds across dozens or hundreds of staff.
              </p>
              <p>
                Hayya Med Pro was built to solve this. One platform, every GCC authority, every
                profession, every country â€” with automated credit counting, deadline reminders,
                certificate storage, and AI-powered gap analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Authorities */}
        <section className="py-12 bg-[#f8fafc] border-y border-[#e2e8f0] px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Supported licensing authorities
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Compliance rules are maintained directly from official authority publications and updated as they change.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {authorities.map((a) => (
                <div key={a.name} className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-3 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{a.flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#111]">{a.name}</p>
                    <p className="text-[11px] text-[#64748b] leading-tight">{a.country}</p>
                  </div>
                </div>
              ))}
              <div className="bg-[#f0f9ff] rounded-xl border border-dashed border-[#bae6fd] px-4 py-3 flex items-center gap-3">
                <span className="text-xl flex-shrink-0">ðŸŒ</span>
                <div>
                  <p className="text-sm font-semibold text-[#0369a1]">More coming</p>
                  <p className="text-[11px] text-[#0369a1] leading-tight">UK Â· India Â· Australia Â· EU</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/countries" className="text-sm font-semibold text-[#1a56a0] hover:underline">
                Compare all GCC CME requirements â†’
              </Link>
            </div>
          </div>
        </section>

        {/* Professions */}
        <section className="py-12 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">All healthcare professions</h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Physicians, nurses, pharmacists, dentists, and allied health â€” each profession has different requirements in different countries. We track them all.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { icon: "ðŸ©º", title: "Physicians", href: "/physician-cme" },
                { icon: "ðŸ‘©â€âš•ï¸", title: "Nurses", href: "/nurse-cpd" },
                { icon: "ðŸ’Š", title: "Pharmacists", href: "/pharmacist-cme" },
                { icon: "ðŸ¦·", title: "Dentists", href: "/dentist-cme" },
                { icon: "ðŸ¦¿", title: "Allied Health", href: "/allied-health-cpd" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#1a56a0] hover:bg-white transition-all"
                >
                  <span className="text-2xl block mb-2">{p.icon}</span>
                  <p className="text-sm font-semibold text-[#111]">{p.title}</p>
                  <p className="text-xs text-[#1a56a0] mt-1">View guide â†’</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* For employers */}
        <section className="py-12 bg-[#f0f6ff] border-y border-[#d0e4fa] px-4 sm:px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-wide mb-3">For Employers</p>
              <h2 className="text-2xl font-bold text-[#111] mb-4 leading-tight">
                Compliance visibility across your entire workforce
              </h2>
              <p className="text-[#374151] leading-relaxed text-sm mb-5">
                Hospitals, clinics, and healthcare networks use the Employer plan to monitor staff
                renewal status in real time, assign CME tasks, send compliance reminders, and export
                accreditation-ready reports â€” without accessing staff&apos;s private health information.
              </p>
              <Link
                href="/employers"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#154890] transition-colors"
              >
                See employer features â†’
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">Employer plans</p>
              {[
                { tier: "Clinic", staff: "up to 10 staff", price: "$50/mo" },
                { tier: "Growth", staff: "up to 25 staff", price: "$100/mo" },
                { tier: "Department", staff: "up to 50 staff", price: "$180/mo" },
                { tier: "Hospital", staff: "up to 200 staff", price: "$350/mo" },
              ].map((t) => (
                <div key={t.tier} className="flex items-center justify-between py-2 border-b border-[#f0f4f8] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#111]">{t.tier}</p>
                    <p className="text-xs text-[#64748b]">{t.staff}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1a56a0]">{t.price}</p>
                </div>
              ))}
              <p className="text-[11px] text-[#94a3b8] mt-3">15% off on annual billing. Enterprise available.</p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-12 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">How we build</h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              The principles that guide every product and engineering decision.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {principles.map((p) => (
                <div key={p.title} className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-5">
                  <span className="text-2xl mb-3 block">{p.icon}</span>
                  <h3 className="font-semibold text-[#111] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & compliance certifications roadmap */}
        <section className="py-12 bg-[#f8fafc] border-y border-[#e2e8f0] px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">Security & data protection</h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Healthcare data is sensitive. Every architectural decision reflects that.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "ðŸ”",
                  title: "Row-Level Security",
                  body: "Every database table uses Supabase RLS â€” professionals can only ever access their own data. No exceptions.",
                },
                {
                  icon: "ðŸŒ",
                  title: "GCC data residency",
                  body: "Platform deployed on GCP in me-central1 (Doha, Qatar). Healthcare data stays in the region.",
                },
                {
                  icon: "ðŸ“‹",
                  title: "Qatar PDPL compliant",
                  body: "Privacy Policy, Terms of Service, and DPA designed for Qatar Law No. 13 of 2016 (PDPL) and GDPR alignment.",
                },
              ].map((c) => (
                <div key={c.title} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <span className="text-2xl block mb-3">{c.icon}</span>
                  <h3 className="font-semibold text-[#111] mb-1.5 text-sm">{c.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link href="/legal/dpa" className="text-sm text-[#1a56a0] hover:underline">
                View our Data Processing Agreement â†’
              </Link>
            </div>
          </div>
        </section>

        {/* Compliance disclaimer */}
        <section className="py-8 px-4 sm:px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#fff8ed] border border-[#f5d8a0] rounded-lg p-5 text-sm text-[#92400e]">
              <p className="font-semibold mb-1">Compliance disclaimer</p>
              <p className="leading-relaxed">
                Hayya Med Pro supports CME tracking and licensing readiness. It does not issue
                licenses and does not replace official licensing authorities. Users must verify final
                requirements with their relevant regulatory body â€” QCHP, SCFHS, DHA, DOH, NHRA,
                OMSB, or MOH Kuwait.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#0f1f3d] px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to track your CME compliance?
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm">
              Free for individual professionals. 14-day Pro trial on signup. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold px-7 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start tracking free â†’
              </Link>
              <Link
                href="/contact"
                className="border border-[rgba(255,255,255,0.25)] text-white font-medium px-7 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-xs font-semibold text-[#1a56a0]">Hayya Med Pro</Link>
          <div className="flex gap-4 text-xs text-[#94a3b8]">
            <Link href="/privacy" className="hover:text-[#64748b]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#64748b]">Terms</Link>
            <Link href="/legal/dpa" className="hover:text-[#64748b]">DPA</Link>
            <Link href="/help" className="hover:text-[#64748b]">Help</Link>
            <Link href="/contact" className="hover:text-[#64748b]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
