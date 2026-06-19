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

  const title = `${c.name} Medical License Renewal ${new Date().getFullYear()} — Step-by-Step Guide | Hayya Med Pro`;
  const description = `How to renew your healthcare license in ${c.name}. ${c.creditsRequired} of ${c.terminology} required per ${c.cycleLength}. Complete ${c.authorityAcronym} renewal guide for physicians, nurses, pharmacists, and all healthcare professionals.`;

  return {
    title,
    description,
    keywords: [
      `${c.name} medical license renewal`,
      `${c.authorityAcronym} license renewal`,
      `renew healthcare license ${c.name}`,
      `${c.name} doctor license renewal`,
      `${c.name} nurse license renewal`,
      `${c.name} pharmacist renewal`,
      `${c.terminology} ${c.name}`,
      ...c.keywords,
    ],
    openGraph: {
      title,
      description,
      url: `${BASE}/${slug}/license-renewal`,
      type: "article",
      images: [{ url: `${BASE}/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `${BASE}/${slug}/license-renewal` },
  };
}

const RENEWAL_STEPS = (c: ReturnType<typeof getCountry>) => {
  if (!c) return [];
  return [
    {
      step: "01",
      title: `Complete ${c.creditsRequired} of ${c.terminology}`,
      desc: `Ensure you have completed the required ${c.creditsRequired} within your ${c.cycleLength} renewal cycle. Hayya Med Pro tracks this automatically and alerts you to any gap.`,
    },
    {
      step: "02",
      title: "Log all activities in your CME tracker",
      desc: `Add each completed ${c.terminology} activity — conferences, online courses, workshops — to your Hayya Med Pro dashboard. Upload certificates as evidence.`,
    },
    {
      step: "03",
      title: "Download your compliance PDF report",
      desc: `Generate an official compliance report from Hayya Med Pro. The report shows all completed ${c.terminology} activities, dates, credit values, and totals in a format accepted by ${c.authorityAcronym}.`,
    },
    {
      step: "04",
      title: `Submit to ${c.authorityAcronym} for renewal`,
      desc: `Submit your compliance report and required documents to ${c.authority} (${c.authorityAcronym}) for license renewal. Processing times vary — submit at least 60 days before your license expires.`,
    },
  ];
};

export default async function CountryLicenseRenewalPage({ params }: Props) {
  const { country: slug } = await params;
  const c = getCountry(slug);
  if (!c) notFound();

  const breadcrumbs = [
    { name: "Home", url: BASE },
    { name: "Countries", url: `${BASE}/countries` },
    { name: c.name, url: `${BASE}/${slug}` },
    { name: "License Renewal", url: `${BASE}/${slug}/license-renewal` },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I renew my healthcare license in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `To renew your healthcare license in ${c.name}, you must: (1) Complete ${c.creditsRequired} of ${c.terminology} within your ${c.cycleLength} cycle; (2) Log all activities with supporting evidence; (3) Generate a compliance report; (4) Submit to ${c.authorityAcronym} before your license expires. Hayya Med Pro automates steps 1–3 and generates the official PDF you need for step 4.`,
        },
      },
      {
        "@type": "Question",
        name: `What documents do I need to renew my license in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `License renewal in ${c.name} typically requires: a ${c.terminology} compliance certificate showing ${c.creditsRequired} completed, certificates of attendance for individual activities, a current CV, valid professional indemnity insurance, and your existing license details. Hayya Med Pro generates the compliance report required as part of this documentation.`,
        },
      },
      {
        "@type": "Question",
        name: `How early should I apply for license renewal in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Apply for license renewal in ${c.name} at least 60–90 days before your license expires. ${c.authorityAcronym} processing times can vary. Hayya Med Pro sends you reminders 90, 60, and 30 days before your renewal deadline.`,
        },
      },
      {
        "@type": "Question",
        name: `What happens if my license expires in ${c.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `If your license expires in ${c.name}, you may not be legally permitted to practice. ${c.authorityAcronym} may require an application to reinstate your license, which can involve additional ${c.terminology} requirements. Hayya Med Pro prevents this by alerting you well in advance of your renewal deadline.`,
        },
      },
    ],
  };

  const steps = RENEWAL_STEPS(c);

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
          <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">
            Start free
          </Link>
        </nav>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm text-[#64748b] flex-wrap">
            <li><Link href="/" className="hover:text-[#1a56a0]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/countries" className="hover:text-[#1a56a0]">Countries</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/${slug}`} className="hover:text-[#1a56a0]">{c.name}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#0f1f3d] font-medium">License Renewal</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl" aria-hidden="true">{c.flag}</span>
              <span className="text-xs font-semibold text-[#d97706] bg-[#fef9c3] px-2.5 py-1 rounded-full">License Renewal</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
              {c.name} healthcare license renewal — complete {new Date().getFullYear()} guide
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Everything you need to renew your healthcare license in {c.name}.
              Complete {c.creditsRequired} of {c.terminology} per {c.cycleLength}, submit to {c.authorityAcronym},
              and never miss a renewal deadline again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my license renewal free
              </Link>
              <Link href={`/${slug}/cme`} className="inline-flex items-center justify-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                {c.terminology} requirements guide →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-12">

          {/* Renewal steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-xl font-bold text-[#0f1f3d] mb-6">
              How to renew your healthcare license in {c.name} — 4 steps
            </h2>
            <div className="space-y-4">
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f1f3d] mb-1">{title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key dates */}
          <section aria-labelledby="dates-heading" className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-6">
            <h2 id="dates-heading" className="text-lg font-bold text-[#92400e] mb-4 flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#d97706]" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Key renewal timeline — {c.name}
            </h2>
            <div className="space-y-3">
              {[
                { days: "90 days before", action: `Start completing outstanding ${c.terminology} credits` },
                { days: "60 days before", action: "Gather all CME certificates and evidence" },
                { days: "45 days before", action: "Generate compliance report from Hayya Med Pro" },
                { days: "30 days before", action: `Submit renewal application to ${c.authorityAcronym}` },
                { days: "License expiry", action: "Confirm renewed license received from authority" },
              ].map(({ days, action }) => (
                <div key={days} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-[#d97706] w-28 flex-shrink-0">{days}</span>
                  <span className="text-sm text-[#92400e]">{action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-bold text-[#0f1f3d] mb-6">
              Frequently asked questions — {c.name} license renewal
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
              <Link href={`/${slug}/cme`} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{c.name} {c.terminology} guide</p>
                <p className="text-xs text-[#64748b] mt-1">Full breakdown of credit requirements</p>
              </Link>
              <Link href={`/${slug}`} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{c.name} overview</p>
                <p className="text-xs text-[#64748b] mt-1">All healthcare resources for {c.name}</p>
              </Link>
              <Link href="/gcc-medical-license-renewal" className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">GCC renewal comparison</p>
                <p className="text-xs text-[#64748b] mt-1">Compare renewal across all GCC countries</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Never miss a license renewal deadline</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Hayya Med Pro tracks your {c.terminology} compliance and sends renewal reminders 90, 60, and 30 days before your {c.authorityAcronym} deadline.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start free — takes 3 minutes
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports {c.terminology} tracking and licensing readiness for healthcare professionals in {c.name}.
            It does not issue licenses. Users must verify final requirements with {c.authority} ({c.authorityAcronym}).
          </p>
        </main>
      </div>
    </>
  );
}
