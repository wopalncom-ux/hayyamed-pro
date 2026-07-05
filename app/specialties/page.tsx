import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";
import { getPageSeo } from "@/lib/cms";

const APP_URL = "https://hayyamed.pro";
const DEFAULT_TITLE = "CME Requirements by Medical Specialty — All GCC Specialties | Hayya Med Pro";
const DEFAULT_DESCRIPTION =
  "CME and CPD requirements for every medical specialty in the GCC — Cardiology, Surgery, Neurology, Pediatrics, Nursing, Pharmacy, and 40+ more. Track credits across QCHP, SCFHS, DHA, DOH, NHRA, and OMSB.";
const DEFAULT_KEYWORDS = [
  "CME requirements by specialty",
  "medical specialty CME GCC",
  "CPD requirements specialties Qatar",
  "QCHP CME specialty requirements",
  "SCFHS specialty CME",
  "GCC medical specialty CME tracker",
];
const DEFAULT_OG_IMAGE = `${APP_URL}/api/og?t=CME+by+Specialty&s=40%2B+specialties+%C2%B7+QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%C2%B7+all+GCC+authorities&k=Specialty+Directory`;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("specialties");
  const title = seo?.meta_title || DEFAULT_TITLE;
  const description = seo?.meta_description || DEFAULT_DESCRIPTION;
  const noIndex = seo?.robots_directive?.includes("noindex") ?? false;

  return {
    title,
    description,
    keywords: seo?.keywords?.length ? seo.keywords : DEFAULT_KEYWORDS,
    alternates: { canonical: seo?.canonical_url || `${APP_URL}/specialties` },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: `${APP_URL}/specialties`,
      type: "website",
      images: [{ url: seo?.og_image_url || DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    robots: { index: !noIndex, follow: true },
  };
}

type Specialty = { label: string; href: string; icon: string };

const GROUPS: { title: string; description: string; items: Specialty[] }[] = [
  {
    title: "Medical Specialties",
    description: "Internal medicine, primary care, and non-surgical disciplines",
    items: [
      { label: "Cardiology",             href: "/cardiology-cme",            icon: "🫀" },
      { label: "Internal Medicine",      href: "/internal-medicine-cme",     icon: "🩺" },
      { label: "Family Medicine",        href: "/family-medicine-cme",       icon: "👨‍👩‍👧" },
      { label: "Emergency Medicine",     href: "/emergency-medicine-cme",    icon: "🚨" },
      { label: "Neurology",              href: "/neurology-cme",             icon: "🧠" },
      { label: "Psychiatry",             href: "/psychiatry-cme",            icon: "🧘" },
      { label: "Pediatrics",             href: "/pediatrics-cme",            icon: "👶" },
      { label: "Geriatrics",             href: "/geriatrics-cme",            icon: "🧓" },
      { label: "Infectious Disease",     href: "/infectious-disease-cme",    icon: "🦠" },
      { label: "Pulmonology",            href: "/pulmonology-cme",           icon: "🫁" },
      { label: "Gastroenterology",       href: "/gastroenterology-cme",      icon: "🔬" },
      { label: "Nephrology",             href: "/nephrology-cme",            icon: "🫘" },
      { label: "Endocrinology",          href: "/endocrinology-cme",         icon: "⚗️" },
      { label: "Rheumatology",           href: "/rheumatology-cme",          icon: "🦴" },
      { label: "Hematology",             href: "/hematology-cme",            icon: "🩸" },
      { label: "Oncology",               href: "/oncology-cme",              icon: "🎗️" },
      { label: "Allergy & Immunology",   href: "/allergy-immunology-cme",    icon: "🌿" },
      { label: "Palliative Care",        href: "/palliative-care-cme",       icon: "🤝" },
      { label: "Occupational Medicine",  href: "/occupational-medicine-cme", icon: "🏭" },
      { label: "Neonatology",            href: "/neonatology-cme",           icon: "🍼" },
      { label: "Sports Medicine",        href: "/sports-medicine-cme",       icon: "⚽" },
    ],
  },
  {
    title: "Surgical Specialties",
    description: "Surgery, operative procedures, and interventional disciplines",
    items: [
      { label: "General Surgery",        href: "/surgery-cme",                    icon: "🔪" },
      { label: "Cardiothoracic Surgery", href: "/cardiothoracic-surgery-cme",     icon: "❤️" },
      { label: "Neurosurgery",           href: "/neurosurgery-cme",               icon: "🧬" },
      { label: "Orthopedics",            href: "/orthopedics-cme",                icon: "🦾" },
      { label: "Plastic Surgery",        href: "/plastic-surgery-cme",            icon: "✨" },
      { label: "Urology",                href: "/urology-cme",                    icon: "🔵" },
      { label: "Vascular Surgery",       href: "/vascular-surgery-cme",           icon: "🩺" },
      { label: "Obstetrics & Gynecology",href: "/obstetrics-gynecology-cme",      icon: "🤰" },
      { label: "ENT",                    href: "/ent-cme",                        icon: "👂" },
      { label: "Ophthalmology",          href: "/ophthalmology-cme",              icon: "👁️" },
      { label: "Aesthetic Medicine",     href: "/aesthetic-medicine-cme",         icon: "💆" },
      { label: "Dermatology",            href: "/dermatology-cme",                icon: "🧴" },
    ],
  },
  {
    title: "Diagnostics & Critical Care",
    description: "Imaging, pathology, anesthesia, and intensive care",
    items: [
      { label: "Radiology",              href: "/radiology-cme",              icon: "📷" },
      { label: "Interventional Radiology",href: "/interventional-radiology-cme", icon: "🎯" },
      { label: "Nuclear Medicine",       href: "/nuclear-medicine-cme",       icon: "☢️" },
      { label: "Pathology",              href: "/pathology-cme",              icon: "🔬" },
      { label: "Anesthesia",             href: "/anesthesia-cme",             icon: "💉" },
      { label: "Critical Care",          href: "/critical-care-cme",          icon: "🏥" },
      { label: "Physical Medicine & Rehab", href: "/physical-medicine-cme",   icon: "🏋️" },
    ],
  },
  {
    title: "Allied Health & Professions",
    description: "Nursing, pharmacy, dentistry, and allied health professionals",
    items: [
      { label: "Nursing",                href: "/nurse-cme",                  icon: "👩‍⚕️" },
      { label: "Pharmacy",               href: "/pharmacist-cme",             icon: "💊" },
      { label: "Dentistry",              href: "/dentist-cme",                icon: "🦷" },
      { label: "Physician (General)",    href: "/physician-cme",              icon: "🩺" },
    ],
  },
];

export default function SpecialtiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: APP_URL },
          { name: "CME by Specialty", url: `${APP_URL}/specialties` },
        ]}
      />
      <MedicalWebPageJsonLd
        name="CME Requirements by Medical Specialty — GCC"
        url={`${APP_URL}/specialties`}
        description="CME and CPD requirements for every medical specialty in the GCC — Cardiology, Surgery, Neurology, Pediatrics, Nursing, Pharmacy, and 40+ more. Track credits across QCHP, SCFHS, DHA, DOH, NHRA, and OMSB."
        keywords={["CME requirements by specialty", "medical specialty CME GCC", "CPD requirements specialties Qatar", "QCHP CME specialty requirements", "SCFHS specialty CME", "GCC medical specialty CME tracker"]}
      />

      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="text-sm font-bold text-[#111]">
              Hayya Med <span className="text-[#1a56a0]">Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/countries" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">CME by Country</Link>
            <Link href="/pricing" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">Pricing</Link>
            <Link href="/login" className="text-[#1a56a0] font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-[#0f1f3d] py-14 sm:py-18 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-[#1a3563] border border-[#2a4a7f] text-[#93c5fd] text-xs font-semibold px-3 py-1 rounded-full mb-5">
              40+ Medical Specialties · 7 GCC Authorities
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              CME Requirements by Medical Specialty
            </h1>
            <p className="text-base text-[#8ea5c8] max-w-2xl mx-auto leading-relaxed">
              Find the exact CME and CPD credit requirements for your specialty across all
              GCC licensing authorities — QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, and OMSB.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="bg-[#1a3563] border-b border-[#2a4a7f]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-3 gap-4 text-center">
            {[
              { n: "40+", label: "Specialties covered" },
              { n: "7",   label: "GCC authorities" },
              { n: "100%", label: "Rules-engine driven" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white">{s.n}</p>
                <p className="text-xs text-[#8ea5c8] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specialty groups */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-14">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#111] mb-1">{group.title}</h2>
                  <p className="text-sm text-[#64748b]">{group.description}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-3 bg-[#f8fafc] hover:bg-white border border-[#e2e8f0] hover:border-[#1a56a0] hover:shadow-sm rounded-xl px-4 py-3 transition-all"
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <span className="text-sm font-medium text-[#374151] group-hover:text-[#1a56a0] transition-colors leading-tight">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <section className="py-10 bg-[#f8fafc] border-y border-[#e2e8f0] px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-base font-semibold text-[#111] mb-5 text-center">
              Also browse CME requirements by country or profession
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "QCHP — Qatar",           href: "/qchp" },
                { label: "SCFHS — Saudi Arabia",    href: "/scfhs" },
                { label: "DHA — Dubai",             href: "/dha" },
                { label: "Compare all GCC",         href: "/countries" },
                { label: "Physicians",              href: "/physician-cme" },
                { label: "Nurses",                  href: "/nurse-cme" },
                { label: "Pharmacists",             href: "/pharmacist-cme" },
                { label: "CME vs CPD explained",    href: "/cme-vs-cpd" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#1a56a0] border border-[#d0e4fa] bg-white px-4 py-2 rounded-full hover:bg-[#f0f6ff] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#0f1f3d] px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Track your specialty CME automatically
            </h2>
            <p className="text-[#8ea5c8] text-sm mb-7">
              Hayya Med Pro knows the exact requirements for your specialty and authority.
              Upload certificates, track credits, and get notified before your renewal deadline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold px-7 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start tracking free →
              </Link>
              <Link
                href="/countries"
                className="border border-white/25 text-white font-medium px-7 py-3 rounded-lg hover:bg-white/8 transition-colors text-sm"
              >
                Browse by country
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
