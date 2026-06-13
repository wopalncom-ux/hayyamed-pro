import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "List CME Courses on Hayya Med Pro â€” Training Provider Marketplace",
  description:
    "Reach 10,000+ GCC healthcare professionals. List your CME and CPD courses on the Hayya Med Pro marketplace â€” accredited by QCHP, SCFHS, DHA, DOH, NHRA and OMSB.",
  openGraph: {
    title: "List CME Courses on Hayya Med Pro",
    description:
      "Reach GCC healthcare professionals searching for accredited CME. No upfront fees â€” you pay only when professionals enroll.",
    url: "https://hayyamed.pro/for-providers",
    siteName: "Hayya Med Pro",
    type: "website",
    images: [{ url: `https://hayyamed.pro/api/og?t=List+CME+Courses+on+Hayya+Med+Pro&s=Reach+10%2C000%2B+GCC+healthcare+professionals+%C2%B7+no+upfront+fees&a=%F0%9F%8E%93+Provider&k=For+Providers`, width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://hayyamed.pro/for-providers" },
};

const AUTHORITIES = [
  { code: "ðŸ‡¶ðŸ‡¦", name: "QCHP", country: "Qatar" },
  { code: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia" },
  { code: "ðŸ‡¦ðŸ‡ª", name: "DHA", country: "UAE Dubai" },
  { code: "ðŸ‡¦ðŸ‡ª", name: "DOH", country: "UAE Abu Dhabi" },
  { code: "ðŸ‡§ðŸ‡­", name: "NHRA", country: "Bahrain" },
  { code: "ðŸ‡´ðŸ‡²", name: "OMSB", country: "Oman" },
];

const BENEFITS = [
  {
    icon: "ðŸ‘¥",
    title: "Reach verified GCC professionals",
    body: "Your courses appear in front of physicians, nurses, pharmacists, and dentists actively tracking their CME deadlines â€” the highest-intent audience in GCC healthcare.",
  },
  {
    icon: "âœ…",
    title: "Automatic CME credit sync",
    body: "When a professional completes your course, CME credits are automatically added to their compliance wallet. Zero manual paperwork for you or them.",
  },
  {
    icon: "ðŸ“Š",
    title: "Real-time enrollment analytics",
    body: "See who enrolled, completion rates, weekly growth, and estimated revenue â€” all in your provider dashboard, updated in real time.",
  },
  {
    icon: "ðŸ”’",
    title: "Verified accreditation badge",
    body: "Accredited providers display a verified badge on their courses. We verify your accreditation with QCHP, SCFHS, DHA, or other GCC authorities.",
  },
  {
    icon: "ðŸŒ",
    title: "All delivery modes supported",
    body: "Live conferences, workshops, online modules, hybrid events, and on-demand videos â€” all listed and searchable in one marketplace.",
  },
  {
    icon: "ðŸ’°",
    title: "Free and paid courses",
    body: "List free courses to build your audience, or sell paid courses and keep the revenue. No upfront listing fees â€” we only succeed when you succeed.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Register as a training provider",
    body: "Create your provider account and submit your accreditation details. Our team reviews and approves your profile within 2 business days.",
  },
  {
    step: "02",
    title: "List your first course",
    body: "Add your course â€” title, category, credits, delivery mode, schedule, and price. Free or paid. Online or in-person.",
  },
  {
    step: "03",
    title: "Get discovered by professionals",
    body: "Your course appears in the marketplace and gets surfaced to professionals with matching CME gaps and upcoming deadlines.",
  },
  {
    step: "04",
    title: "Track completions & revenue",
    body: "Monitor enrollments, completions, and earnings in real time. Credits are auto-issued to learners on completion.",
  },
];

const FAQS = [
  {
    q: "Do I need to pay to list a course?",
    a: "There are no upfront listing fees. Listing a free course is completely free. For paid courses, a platform fee applies only on successful transactions.",
  },
  {
    q: "Which accreditation authorities do you recognize?",
    a: "We recognize QCHP (Qatar), SCFHS (Saudi Arabia), DHA and DOH (UAE), NHRA (Bahrain), OMSB (Oman), and other internationally recognized CME accreditors.",
  },
  {
    q: "How do professionals find my course?",
    a: "Courses are surfaced based on the professional's country, profession, compliance gaps, and upcoming renewal deadlines â€” matching intent at the right moment.",
  },
  {
    q: "Can I list a course even if it is not yet accredited?",
    a: "Yes. You can list non-accredited courses as professional development. Credits will not count toward formal CME requirements, and this is clearly disclosed to learners.",
  },
  {
    q: "How quickly are my courses reviewed?",
    a: "New courses are reviewed by our admin team within 2â€“3 business days. You'll receive email notification when your course goes live.",
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

export default function ForProvidersPage() {
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
              <Link href="/provider/register" className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium">
                Register as provider
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-[#bfdbfe]">
              ðŸŽ“ Training Provider Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0f1f3d] mb-6 leading-tight">
              Reach GCC healthcare<br className="hidden sm:block" /> professionals who need your CME
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              List your accredited CME and CPD courses on the Hayya Med Pro marketplace.
              Professionals track their compliance gaps and discover your courses at exactly the right moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/provider/register"
                className="bg-[#1a56a0] text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-[#1547a0] transition-colors"
              >
                Register your organization â†’
              </Link>
              <Link
                href="/dashboard/marketplace"
                className="bg-white border border-[#e2e8f0] text-[#374151] px-6 py-3 rounded-xl text-base font-medium hover:bg-[#f8fafc] transition-colors"
              >
                Browse the marketplace
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-4">No upfront fees Â· Approved within 2 business days</p>
          </div>
        </section>

        {/* Authorities */}
        <section className="px-6 py-10 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest text-center mb-5">
              Recognized accreditation authorities
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {AUTHORITIES.map(({ code, name, country }) => (
                <div
                  key={name}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm"
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
              <h2 className="text-3xl font-bold text-[#0f1f3d] mb-3">Why list on Hayya Med Pro?</h2>
              <p className="text-[#64748b]">The only GCC marketplace built around compliance gaps â€” not just course discovery.</p>
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
              <h2 className="text-3xl font-bold text-white mb-3">Get listed in 4 steps</h2>
              <p className="text-[#94a3b8]">From registration to your first enrollment â€” as fast as 2 business days.</p>
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
                href="/provider/register"
                className="bg-[#1a56a0] text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-[#1e66c0] transition-colors"
              >
                Start listing your courses â†’
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f1f3d] mb-10 text-center">Provider FAQ</h2>
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
              Ready to reach GCC healthcare professionals?
            </h2>
            <p className="text-blue-100 mb-8">
              Register your organization today â€” no upfront fees, approved within 2 business days.
            </p>
            <Link
              href="/provider/register"
              className="bg-white text-[#1a56a0] px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition-colors inline-block"
            >
              Register as a training provider â†’
            </Link>
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
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
