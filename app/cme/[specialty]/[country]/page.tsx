import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpecialty, SPECIALTY_SLUGS } from "@/lib/data/specialties";
import { getCountry, COUNTRY_SLUGS } from "@/lib/data/countries";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

type Props = { params: Promise<{ specialty: string; country: string }> };

export async function generateStaticParams() {
  const params: { specialty: string; country: string }[] = [];
  for (const specialty of SPECIALTY_SLUGS) {
    for (const country of COUNTRY_SLUGS) {
      params.push({ specialty, country });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { specialty: specSlug, country: countrySlug } = await params;
  const spec = getSpecialty(specSlug);
  const c = getCountry(countrySlug);
  if (!spec || !c) return {};

  const title = `${spec.name} ${c.terminology} Requirements in ${c.name} ${new Date().getFullYear()} — ${c.authorityAcronym} Guide | Hayya Med Pro`;
  const description = `${spec.name} ${c.terminology} requirements in ${c.name}. ${c.creditsRequired} per ${c.cycleLength} — ${c.authorityAcronym}. Accepted categories, top conferences, and how to track ${spec.name.toLowerCase()} ${c.terminology} compliance for ${c.name}.`;

  return {
    title,
    description,
    keywords: [
      `${spec.name} ${c.terminology} ${c.name}`,
      `${spec.name.toLowerCase()} CPD ${c.name}`,
      `${c.authorityAcronym} ${spec.name.toLowerCase()} ${c.terminology}`,
      `${spec.name.toLowerCase()} license renewal ${c.name}`,
      ...spec.keywords,
      ...c.keywords,
    ],
    openGraph: {
      title,
      description,
      url: `${BASE}/cme/${specSlug}/${countrySlug}`,
      type: "article",
      images: [{ url: `${BASE}/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${BASE}/cme/${specSlug}/${countrySlug}` },
  };
}

export default async function SpecialtyCountryPage({ params }: Props) {
  const { specialty: specSlug, country: countrySlug } = await params;
  const spec = getSpecialty(specSlug);
  const c = getCountry(countrySlug);
  if (!spec || !c) notFound();

  const breadcrumbs = [
    { name: "Home", url: BASE },
    { name: `${spec.name} CME`, url: `${BASE}/${specSlug}-cme` },
    { name: c.name, url: `${BASE}/${countrySlug}` },
    { name: `${spec.name} ${c.terminology} — ${c.name}`, url: `${BASE}/cme/${specSlug}/${countrySlug}` },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many ${c.terminology} credits does a ${spec.name.toLowerCase()} specialist need in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${spec.pluralName} in ${c.name} must complete ${c.creditsRequired} per ${c.cycleLength}, governed by ${c.authority} (${c.authorityAcronym}). ${spec.name}-specific requirements may emphasise certain categories — particularly ${spec.categoryEmphasis}.`,
        },
      },
      {
        "@type": "Question",
        name: `What ${c.terminology} activities are accepted for ${spec.name.toLowerCase()} specialists in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${c.authorityAcronym} accepts these categories: ${c.categories.join(", ")}. For ${spec.name.toLowerCase()} specifically, ${spec.categoryEmphasis}. Top conferences include: ${spec.topConferences.slice(0, 2).join(" and ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I renew my ${spec.name.toLowerCase()} license in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `To renew your ${spec.name.toLowerCase()} license in ${c.name}: (1) Complete ${c.creditsRequired} of ${c.terminology} per ${c.cycleLength}; (2) Log all activities with certificates; (3) Generate a compliance report; (4) Submit to ${c.authorityAcronym}. Hayya Med Pro automates steps 1–3 and generates a report formatted for ${c.authorityAcronym}.`,
        },
      },
      {
        "@type": "Question",
        name: `Do international ${spec.name.toLowerCase()} conferences count toward ${c.terminology} in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${c.authorityAcronym} generally accepts ${c.terminology} from internationally accredited bodies. Key accrediting bodies for ${spec.name.toLowerCase()} include: ${spec.accreditingBodies.slice(0, 2).join(" and ")}. Always verify individual event accreditation before attending and retain your certificate.`,
        },
      },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${spec.name} ${c.terminology} Requirements in ${c.name} ${new Date().getFullYear()}`,
    description: faqSchema.mainEntity[0].acceptedAnswer.text,
    author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
    publisher: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
    datePublished: "2026-06-19",
    dateModified: "2026-06-19",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/cme/${specSlug}/${countrySlug}` },
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
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
          <ol className="flex items-center gap-2 text-sm text-[#64748b] flex-wrap">
            <li><Link href="/" className="hover:text-[#1a56a0]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${specSlug}-cme`} className="hover:text-[#1a56a0]">{spec.name} CME</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${countrySlug}`} className="hover:text-[#1a56a0]">{c.name}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#0f1f3d] font-medium">{spec.name} {c.terminology}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-3xl" aria-hidden="true">{spec.icon}</span>
              <span className="text-3xl" aria-hidden="true">{c.flag}</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">{c.authorityAcronym} · {c.terminology}</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight max-w-3xl">
              {spec.name} {c.terminology} requirements in {c.name} — {new Date().getFullYear()} guide for {spec.pluralName.toLowerCase()}
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              {spec.pluralName} in {c.name} must complete {c.creditsRequired} of {c.terminology} per {c.cycleLength}, governed by {c.authority}.
              This guide covers accepted activities, key accrediting bodies, top conferences, and how to track compliance automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my {spec.name} {c.terminology} — free
              </Link>
              <Link href={`/${countrySlug}/cme`} className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                {c.name} {c.terminology} guide →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-12">

          {/* Stats */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">{spec.name} {c.terminology} requirements at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Credits required", value: c.creditsRequired },
                { label: "Renewal cycle", value: c.cycleLength },
                { label: "Authority", value: c.authorityAcronym },
                { label: "Terminology", value: c.terminology },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-[#1a56a0] mb-1">{value}</p>
                  <p className="text-xs text-[#64748b]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Specialty-specific info */}
          <section aria-labelledby="specialty-heading">
            <h2 id="specialty-heading" className="text-xl font-bold text-[#0f1f3d] mb-5">
              {spec.name} {c.terminology} in {c.name} — what you need to know
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">

              <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                <h3 className="font-semibold text-[#0f1f3d] mb-3 text-sm">Mandatory {c.terminology} topics</h3>
                <ul className="space-y-2">
                  {spec.mandatoryTopics.map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] flex-shrink-0" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                <h3 className="font-semibold text-[#0f1f3d] mb-3 text-sm">Key accrediting bodies</h3>
                <ul className="space-y-2">
                  {spec.accreditingBodies.map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                <h3 className="font-semibold text-[#0f1f3d] mb-3 text-sm">Top {spec.name} conferences for {c.terminology}</h3>
                <ul className="space-y-2">
                  {spec.topConferences.map(conf => (
                    <li key={conf} className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] flex-shrink-0" aria-hidden="true" />
                      {conf}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                <h3 className="font-semibold text-[#0f1f3d] mb-3 text-sm">Accepted {c.terminology} categories</h3>
                <ul className="space-y-2">
                  {c.categories.slice(0, 5).map(cat => (
                    <li key={cat} className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] flex-shrink-0" aria-hidden="true" />
                      {cat}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[#64748b] mt-3 italic">{spec.categoryEmphasis}</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-bold text-[#0f1f3d] mb-6">
              {spec.name} {c.terminology} in {c.name} — frequently asked questions
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

          {/* Related */}
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href={`/${countrySlug}/cme`} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{c.name} {c.terminology} guide</p>
                <p className="text-xs text-[#64748b] mt-1">All {c.terminology} requirements for {c.name}</p>
              </Link>
              <Link href={`/${countrySlug}/license-renewal`} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{c.name} license renewal</p>
                <p className="text-xs text-[#64748b] mt-1">Step-by-step {c.authorityAcronym} renewal process</p>
              </Link>
              <Link href={`/${specSlug}-cme`} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{spec.name} CME — all countries</p>
                <p className="text-xs text-[#64748b] mt-1">Global {spec.name.toLowerCase()} {c.terminology} guide</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">
              Track your {spec.name} {c.terminology} in {c.name}
            </h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Hayya Med Pro tracks {c.creditsRequired} of {c.terminology} per {c.cycleLength} for {spec.pluralName.toLowerCase()} in {c.name}.
              Download your {c.authorityAcronym} compliance report when you need it.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start free — 3 minutes
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports {c.terminology} tracking and licensing readiness for {spec.pluralName.toLowerCase()} in {c.name}.
            It does not issue licenses. Users must verify final requirements with {c.authority} ({c.authorityAcronym}).
          </p>
        </main>
      </div>
    </>
  );
}
