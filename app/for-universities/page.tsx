import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Faculty CME Compliance for Medical Universities â€” Hayya Med Pro",
  description:
    "Give your medical school full visibility into faculty CME compliance. Real-time dashboard, department grouping, license expiry tracking, and automated alerts â€” built for GCC healthcare universities.",
  keywords: [
    "university CME compliance management",
    "medical school faculty CME tracking",
    "faculty CPD compliance Qatar",
    "medical university compliance software",
    "GCC medical school CME management",
    "healthcare university workforce compliance",
    "QCHP faculty compliance",
    "nursing college CPD tracking",
  ],
  openGraph: {
    title: "Faculty CME Compliance for Medical Universities â€” Hayya Med Pro",
    description:
      "Full faculty compliance visibility in one dashboard. Real-time CME status, department breakdowns, license alerts, and required training management.",
    url: `${APP_URL}/for-universities`,
    siteName: "Hayya Med Pro",
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Faculty+CME+Compliance+for+Medical+Universities&s=Real-time+faculty+compliance+dashboard+%C2%B7+GCC+medical+schools&a=%F0%9F%8E%93+University&k=For+Universities`, width: 1200, height: 630 }],
  },
  alternates: { canonical: `${APP_URL}/for-universities` },
};

const INSTITUTION_TYPES = [
  { icon: "ðŸ¥", label: "Medical Schools" },
  { icon: "ðŸ©º", label: "Nursing Colleges" },
  { icon: "ðŸ’Š", label: "Pharmacy Colleges" },
  { icon: "ðŸ”¬", label: "Health Sciences Faculties" },
  { icon: "ðŸ¦·", label: "Dental Schools" },
  { icon: "ðŸ§ª", label: "Allied Health Institutes" },
];

const AUTHORITIES = [
  { code: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar" },
  { code: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia" },
  { code: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "UAE Dubai" },
  { code: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "UAE Abu Dhabi" },
  { code: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain" },
  { code: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman" },
];

const BENEFITS = [
  {
    icon: "ðŸ“Š",
    title: "Real-time faculty compliance dashboard",
    body: "See every faculty member's CME completion status, compliance rate, and license expiry at a glance â€” no spreadsheets, no chasing, no surprises before accreditation reviews.",
  },
  {
    icon: "ðŸ¢",
    title: "Department-level compliance breakdown",
    body: "Group faculty by department and see which units are falling behind. Target interventions before renewal deadlines rather than reacting after the fact.",
  },
  {
    icon: "ðŸ“‹",
    title: "Required training management",
    body: "Assign mandatory training to your faculty directly from the dashboard. Set due dates, monitor completion, and link to courses on the marketplace.",
  },
  {
    icon: "ðŸ””",
    title: "Automated faculty alerts",
    body: "Faculty receive automated reminders when their CME deadline or license expiry is approaching â€” reducing the administrative burden on your compliance team.",
  },
  {
    icon: "ðŸ”’",
    title: "Privacy-first data model",
    body: "Faculty control exactly what their institution can see. Aggregate compliance reports are available to administrators without exposing individual health or credential details beyond what faculty consent to share.",
  },
  {
    icon: "ðŸ“‘",
    title: "Bulk compliance reporting",
    body: "Generate PDF compliance reports for your entire faculty with a single click â€” ready for JCI, CBAHI, or national accreditation body submissions.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Register your institution",
    body: "Submit your institution's details â€” name, type, country, and contact. Our team verifies your account within 2 business days.",
  },
  {
    step: "02",
    title: "Invite faculty to link",
    body: "Share your unique invite link with faculty. They connect their individual Hayya Med Pro profiles to your institution â€” no IT integration required.",
  },
  {
    step: "03",
    title: "Assign departments and training",
    body: "Organize faculty by department and assign required training modules. Monitor completion against your institutional schedule.",
  },
  {
    step: "04",
    title: "Monitor and report",
    body: "Review your real-time analytics dashboard at any time. Export compliance reports for accreditation submissions, HR audits, or board reporting.",
  },
];

const FAQS = [
  {
    q: "What types of institutions does Hayya Med Pro support?",
    a: "Medical schools, nursing colleges, pharmacy colleges, health sciences faculties, dental schools, and allied health institutes â€” any academic institution that employs licensed healthcare professionals.",
  },
  {
    q: "How does faculty onboarding work?",
    a: "Faculty members create their own individual Hayya Med Pro accounts and link to your institution using your unique invite link. There is no bulk import of personal data â€” each faculty member controls their own profile.",
  },
  {
    q: "Can we see individual faculty CME records?",
    a: "You see only what each faculty member chooses to share. Individual faculty control their privacy settings. You always have access to aggregate compliance statistics and the ability to identify who is non-compliant â€” but not granular activity details unless the faculty member explicitly grants access.",
  },
  {
    q: "Which CME authorities are recognized?",
    a: "All major GCC authorities: QCHP (Qatar), SCFHS (Saudi Arabia), DHA and DOH (UAE), NHRA (Bahrain), OMSB (Oman), plus international equivalents including GMC, NMC, AHPRA, and NMC India.",
  },
  {
    q: "How is university billing handled?",
    a: "University accounts are billed via annual institutional contract â€” not via the standard individual subscription. Contact us for institutional pricing based on your faculty headcount.",
  },
  {
    q: "Can we assign required training from the marketplace?",
    a: "Yes. You can browse the Hayya Med Pro course marketplace, select accredited courses, and assign them as required training for your faculty â€” with due dates and completion tracking built in.",
  },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function ForUniversitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-[#64748b] hover:text-[#111]">Sign in</Link>
              <Link href="/university/register" className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium">
                Register your institution
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-[#bfdbfe]">
              ðŸŽ“ University & Academic Institution Portal
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0f1f3d] mb-6 leading-tight">
              Full CME visibility<br className="hidden sm:block" /> across your entire faculty
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Give your medical school real-time compliance oversight â€” from individual faculty CME status
              to department-level reporting, license expiry tracking, and required training management.
              Built for GCC healthcare universities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/university/register"
                className="bg-[#1a56a0] text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-[#1547a0] transition-colors"
              >
                Register your institution â†’
              </Link>
              <Link
                href="/contact"
                className="bg-white border border-[#e2e8f0] text-[#374151] px-6 py-3 rounded-xl text-base font-medium hover:bg-[#f8fafc] transition-colors"
              >
                Talk to our team
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-4">Institutional billing Â· Verified within 2 business days Â· No per-seat login fees</p>
          </div>
        </section>

        {/* Institution types */}
        <section className="px-6 py-10 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest text-center mb-5">
              Built for all healthcare faculties
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {INSTITUTION_TYPES.map(({ icon, label }) => (
                <div
                  key={label}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm"
                >
                  <span>{icon}</span>
                  <span className="font-medium text-[#374151]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Authorities */}
        <section className="px-6 py-8 bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest text-center mb-5">
              Compliance tracked against every major GCC authority
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {AUTHORITIES.map(({ code, name, country }) => (
                <div
                  key={name}
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm"
                >
                  <span>{code}</span>
                  <span className="font-semibold text-[#111]">{name}</span>
                  <span className="text-[#94a3b8]">Â· {country}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits grid */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0f1f3d] mb-3">Everything your compliance team needs</h2>
              <p className="text-[#64748b] max-w-2xl mx-auto">Replace spreadsheets and chasing individual faculty with a live compliance dashboard that updates automatically.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map(({ icon, title, body }) => (
                <div key={title} className="bg-white rounded-xl border border-[#e2e8f0] p-6 hover:border-[#bfdbfe] transition-colors">
                  <div className="text-2xl mb-3">{icon}</div>
                  <h3 className="text-sm font-semibold text-[#111] mb-2">{title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-[#0f1f3d] px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Live in 4 steps</h2>
              <p className="text-[#94a3b8]">No IT integration. No data migration. Faculty bring their own records.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STEPS.map(({ step, title, body }) => (
                <div key={step} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <p className="text-4xl font-black text-[#1a56a0] mb-3 opacity-60">{step}</p>
                  <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/university/register"
                className="bg-[#1a56a0] text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-[#1e66c0] transition-colors"
              >
                Register your institution â†’
              </Link>
            </div>
          </div>
        </section>

        {/* Compliance disclaimer */}
        <section className="px-6 py-10 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
              <p className="text-xs text-[#64748b] leading-relaxed">
                <strong className="text-[#374151]">Compliance disclaimer:</strong> Hayya Med Pro supports CME tracking and licensing readiness.
                It does not issue licenses and does not replace official licensing authorities. Institutions and faculty
                must verify final requirements with their relevant regulatory body (QCHP, SCFHS, DHA, DOH, NHRA, or OMSB).
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f1f3d] mb-10 text-center">University FAQ</h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="bg-white border border-[#e2e8f0] rounded-xl group">
                  <summary className="px-6 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none flex items-center justify-between gap-4">
                    <span>{q}</span>
                    <svg className="w-4 h-4 text-[#94a3b8] flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-sm text-[#64748b] leading-relaxed border-t border-[#f1f5f9] pt-3">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1a56a0] px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to see your faculty&apos;s compliance at a glance?
            </h2>
            <p className="text-blue-100 mb-8">
              Register your institution today. No IT integration required â€” your faculty bring their own records.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/university/register"
                className="bg-white text-[#1a56a0] px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition-colors"
              >
                Register your institution â†’
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border border-white/40 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-white/10 transition-colors"
              >
                Request a demo
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0f1f3d] px-6 py-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
            <span>Â© {new Date().getFullYear()} Hayya Med Pro Â· hayyamed.pro</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/for-providers" className="hover:text-white transition-colors">For Providers</Link>
              <Link href="/employers" className="hover:text-white transition-colors">For Employers</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
