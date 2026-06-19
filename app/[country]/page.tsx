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

  const title = `${c.name} Healthcare CME & CPD Requirements ${new Date().getFullYear()} | Hayya Med Pro`;
  const description = `${c.flag} Complete guide to ${c.terminology} requirements for healthcare professionals in ${c.name}. Track ${c.terminology} compliance, license renewal, and professional development with Hayya Med Pro.`;

  return {
    title,
    description,
    keywords: [...c.keywords, `${c.name} healthcare professionals`, `${c.name} medical education`, `${c.authorityAcronym} requirements`],
    openGraph: {
      title,
      description,
      url: `${BASE}/${slug}`,
      type: "website",
      images: [{ url: `${BASE}/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `${BASE}/${slug}` },
  };
}

const REGION_LABELS: Record<string, string> = {
  gcc: "GCC",
  europe: "Europe",
  "north-america": "North America",
  "asia-pacific": "Asia-Pacific",
  mena: "MENA",
  "south-asia": "South Asia",
  africa: "Africa",
};

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const c = getCountry(slug);
  if (!c) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the ${c.terminology} requirements for healthcare professionals in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `In ${c.name}, healthcare professionals must complete ${c.creditsRequired} every ${c.cycleLength}, governed by ${c.authorityAcronym}. ${c.description}` },
      },
      {
        "@type": "Question",
        name: `Which authority governs ${c.terminology} in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `${c.terminology} in ${c.name} is governed by the ${c.authority} (${c.authorityAcronym}).` },
      },
      {
        "@type": "Question",
        name: `How can I track my ${c.terminology} compliance in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Hayya Med Pro provides automated ${c.terminology} tracking for healthcare professionals in ${c.name}. Log activities, track credits against ${c.creditsRequired} required per ${c.cycleLength}, and download your compliance report for ${c.authorityAcronym} renewal.` },
      },
      {
        "@type": "Question",
        name: `How do I renew my healthcare license in ${c.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Healthcare license renewal in ${c.name} requires proof of ${c.creditsRequired} of ${c.terminology} completed within your ${c.cycleLength} cycle. Hayya Med Pro generates an official compliance report you can submit to ${c.authorityAcronym} for renewal.` },
      },
    ],
  };

  const breadcrumbs = [
    { name: "Home", url: BASE },
    { name: "Countries", url: `${BASE}/countries` },
    { name: c.name, url: `${BASE}/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">
              Start free
            </Link>
          </div>
        </nav>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm text-[#64748b]">
            <li><Link href="/" className="hover:text-[#1a56a0]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/countries" className="hover:text-[#1a56a0]">Countries</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#0f1f3d] font-medium">{c.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl" aria-hidden="true">{c.flag}</span>
              <span className="text-xs font-semibold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">
                {REGION_LABELS[c.region]}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
              {c.name} — Healthcare {c.terminology} &amp; CPD Requirements
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              {c.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my {c.terminology} — free
              </Link>
              <Link href={`/${slug}/cme`} className="inline-flex items-center justify-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                {c.terminology} guide for {c.name} →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-12">

          {/* Key stats */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="text-xl font-bold text-[#0f1f3d] mb-6">
              {c.name} {c.terminology} requirements at a glance
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Authority", value: c.authorityAcronym },
                { label: "Credits required", value: c.creditsRequired },
                { label: "Renewal cycle", value: c.cycleLength },
                { label: "Terminology", value: c.terminology },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-[#1a56a0] mb-1">{value}</p>
                  <p className="text-xs text-[#64748b]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Authority */}
          <section aria-labelledby="authority-heading">
            <h2 id="authority-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              Governing authority
            </h2>
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
              <p className="text-sm font-semibold text-[#0f1f3d] mb-2">{c.authority}</p>
              <p className="text-sm text-[#64748b]">
                {c.authorityAcronym} sets and enforces {c.terminology} requirements for all licensed healthcare professionals in {c.name}.
                Compliance with these requirements is mandatory for license renewal.
              </p>
              {c.authorityPage && (
                <Link href={c.authorityPage} className="inline-block mt-4 text-sm font-semibold text-[#1a56a0] hover:underline">
                  Full {c.authorityAcronym} {c.terminology} guide →
                </Link>
              )}
            </div>
          </section>

          {/* Key facts */}
          <section aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              Key facts for {c.name} healthcare professionals
            </h2>
            <div className="bg-white border border-[#e2e8f0] rounded-xl divide-y divide-[#f1f5f9]">
              {c.keyFacts.map((fact) => (
                <div key={fact} className="flex items-start gap-3 px-6 py-4">
                  <span className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" aria-hidden="true">
                      <path d="M3 8l3.5 3.5 6.5-7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm text-[#374151]">{fact}</p>
                </div>
              ))}
            </div>
          </section>

          {/* {c.terminology} categories */}
          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              Accepted {c.terminology} categories in {c.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {c.categories.map((cat) => (
                <div key={cat} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4 text-sm text-[#374151]">
                  {cat}
                </div>
              ))}
            </div>
          </section>

          {/* Sub-pages */}
          <section aria-labelledby="guides-heading">
            <h2 id="guides-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">
              {c.name} healthcare professional guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: `${c.name} ${c.terminology} requirements`, href: `/${slug}/cme`, desc: `Full breakdown of ${c.creditsRequired} per ${c.cycleLength}` },
                { title: `${c.name} license renewal guide`, href: `/${slug}/license-renewal`, desc: `Step-by-step renewal process for ${c.authorityAcronym}` },
              ].map(({ title, href, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group bg-white border border-[#e2e8f0] rounded-xl p-5 hover:border-[#1a56a0]/30 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-[#0f1f3d] mb-1 group-hover:text-[#1a56a0] transition-colors">{title}</p>
                  <p className="text-sm text-[#64748b]">{desc}</p>
                </Link>
              ))}
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

          {/* CTA */}
          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Track your {c.name} {c.terminology} — free</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Hayya Med Pro automatically tracks your credits against {c.creditsRequired} required per {c.cycleLength}.
              Download your compliance report when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Create free account
              </Link>
              <Link href="/pricing" className="inline-block border border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:border-white/60 transition-colors">
                See Pro features
              </Link>
            </div>
          </section>

          {/* Disclaimer */}
          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports {c.terminology} tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
            Users must verify final requirements with {c.authority} ({c.authorityAcronym}).
          </p>
        </main>
      </div>
    </>
  );
}
