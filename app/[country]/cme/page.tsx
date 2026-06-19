import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountry, COUNTRY_SLUGS } from "@/lib/data/countries";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

type Props = { params: Promise<{ country: string }> };

export async function generateStaticParams() {
  return COUNTRY_SLUGS.map((country) => ({ country }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const c = getCountry(slug);
  if (!c) return {};

  const title = `${c.name} ${c.terminology} Requirements ${new Date().getFullYear()} — Complete Guide | Hayya Med Pro`;
  const description = `${c.flag} Everything healthcare professionals need to know about ${c.terminology} in ${c.name}. ${c.creditsRequired} per ${c.cycleLength}. Governed by ${c.authorityAcronym}. Track compliance automatically.`;

  return {
    title,
    description,
    keywords: [
      `${c.name} ${c.terminology} requirements`,
      `${c.authorityAcronym} ${c.terminology}`,
      `${c.name} continuing medical education`,
      `${c.name} healthcare license renewal`,
      `${c.terminology} ${c.name} guide`,
      ...c.keywords,
    ],
    openGraph: {
      title,
      description,
      url: `${BASE}/${slug}/cme`,
      type: "article",
      images: [{ url: `${BASE}/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `${BASE}/${slug}/cme` },
  };
}

export default async function CountryCmePage({ params }: Props) {
  const { country: slug } = await params;
  const c = getCountry(slug);
  if (!c) notFound();

  const breadcrumbs = [
    { name: "Home", url: BASE },
    { name: "Countries", url: `${BASE}/countries` },
    { name: c.name, url: `${BASE}/${slug}` },
    { name: `${c.terminology} Guide`, url: `${BASE}/${slug}/cme` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.name} ${c.terminology} Requirements — Complete Guide for Healthcare Professionals`,
    description: `Complete guide to ${c.terminology} requirements in ${c.name}. ${c.creditsRequired} per ${c.cycleLength}.`,
    author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "Hayya Med Pro",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/icons/icon-192.png` },
    },
    datePublished: "2026-06-19",
    dateModified: "2026-06-19",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/${slug}/cme` },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many ${c.terminology} credits do I need in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Healthcare professionals in ${c.name} need ${c.creditsRequired} every ${c.cycleLength} as required by ${c.authorityAcronym}.` },
      },
      {
        "@type": "Question",
        name: `Which activities count as ${c.terminology} in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Accepted ${c.terminology} categories in ${c.name} include: ${c.categories.join(", ")}.` },
      },
      {
        "@type": "Question",
        name: `When is my ${c.terminology} renewal due in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `${c.terminology} renewal in ${c.name} follows a ${c.cycleLength} cycle set by ${c.authorityAcronym}. Hayya Med Pro sends you reminders before your deadline so you are never caught short.` },
      },
      {
        "@type": "Question",
        name: `Can I complete ${c.terminology} online in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Yes, online ${c.terminology} activities are widely recognised in ${c.name}. Hayya Med Pro tracks both in-person and online ${c.terminology} credits automatically.` },
      },
      {
        "@type": "Question",
        name: `What happens if I don't complete my ${c.terminology} in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Failure to complete ${c.creditsRequired} of ${c.terminology} per ${c.cycleLength} can result in license suspension or non-renewal by ${c.authorityAcronym}. Hayya Med Pro alerts you when you are at risk of non-compliance.` },
      },
    ],
  };

  const professionRows = c.professions.map((p) => ({
    profession: p,
    credits: c.creditsRequired,
    cycle: c.cycleLength,
    authority: c.authorityAcronym,
  }));

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">
            Start free
          </Link>
        </nav>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm text-[#64748b]">
            <li><Link href="/" className="hover:text-[#1a56a0]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/countries" className="hover:text-[#1a56a0]">Countries</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${slug}`} className="hover:text-[#1a56a0]">{c.name}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#0f1f3d] font-medium">{c.terminology} Guide</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl" aria-hidden="true">{c.flag}</span>
              <span className="text-xs font-semibold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full">{c.authorityAcronym}</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
              {c.name} {c.terminology} requirements — complete {new Date().getFullYear()} guide
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Healthcare professionals in {c.name} must complete {c.creditsRequired} per {c.cycleLength},
              governed by {c.authority} ({c.authorityAcronym}). This guide covers everything you need to
              stay compliant and renew your license on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my {c.terminology} free
              </Link>
              <Link href={`/${slug}/license-renewal`} className="inline-flex items-center justify-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                License renewal guide →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-12">

          {/* Quick stats */}
          <section aria-labelledby="quick-stats-heading">
            <h2 id="quick-stats-heading" className="text-xl font-bold text-[#0f1f3d] mb-6">
              {c.terminology} requirements at a glance — {c.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Credits required", value: c.creditsRequired },
                { label: "Renewal cycle", value: c.cycleLength },
                { label: "Governing body", value: c.authorityAcronym },
                { label: "Terminology used", value: c.terminology },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-center">
                  <p className="text-base font-bold text-[#1a56a0] mb-1 leading-tight">{value}</p>
                  <p className="text-xs text-[#64748b]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* By profession */}
          <section aria-labelledby="profession-heading">
            <h2 id="profession-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              {c.terminology} requirements by profession in {c.name}
            </h2>
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="text-left px-5 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Profession</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Credits required</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Cycle</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wide">Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {professionRows.map((row) => (
                    <tr key={row.profession} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[#0f1f3d]">{row.profession}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{row.credits}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{row.cycle}</td>
                      <td className="px-5 py-3.5 text-[#1a56a0] font-medium">{row.authority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Accepted categories */}
          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              Accepted {c.terminology} categories in {c.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {c.categories.map((cat, i) => (
                <div key={cat} className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#dbeafe] text-[#1a56a0] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#374151]">{cat}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Hayya Med Pro helps */}
          <section aria-labelledby="platform-heading" className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-8">
            <h2 id="platform-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              How Hayya Med Pro tracks {c.name} {c.terminology}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Automatic credit tracking", desc: `Log ${c.terminology} activities in seconds. Your compliance dashboard updates instantly.` },
                { title: "Renewal deadline alerts", desc: `Receive reminders 90, 60, and 30 days before your ${c.cycleLength} cycle ends.` },
                { title: "Official PDF compliance report", desc: `Download a professionally formatted report for ${c.authorityAcronym} renewal submissions.` },
                { title: "AI gap analysis", desc: `AI identifies your compliance gap and recommends specific ${c.terminology} activities to close it.` },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#e2e8f0]">
                  <span className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" aria-hidden="true">
                      <path d="M3 8l3.5 3.5 6.5-7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f1f3d] mb-0.5">{title}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/register" className="inline-block bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors">
                Start tracking {c.terminology} — free →
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-bold text-[#0f1f3d] mb-6">
              Frequently asked questions — {c.name} {c.terminology}
            </h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2 text-sm">{q.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related links */}
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              Related guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href={`/${slug}`} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{c.name} overview</p>
                <p className="text-xs text-[#64748b] mt-1">All healthcare resources for {c.name}</p>
              </Link>
              <Link href={`/${slug}/license-renewal`} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{c.name} license renewal</p>
                <p className="text-xs text-[#64748b] mt-1">Step-by-step renewal process</p>
              </Link>
              <Link href="/gcc-cme-requirements" className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">GCC {`CME`} comparison</p>
                <p className="text-xs text-[#64748b] mt-1">Compare all 7 GCC country requirements</p>
              </Link>
            </div>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports {c.terminology} tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
            Users must verify final requirements with {c.authority} ({c.authorityAcronym}).
          </p>
        </main>
      </div>
    </>
  );
}
