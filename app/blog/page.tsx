import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME & CPD Guides for GCC Healthcare Professionals — Hayya Med Pro Blog",
  description:
    "In-depth guides on CME and CPD requirements for QCHP, SCFHS, DHA, and all GCC licensing authorities. Renewal guides, compliance tips, and healthcare workforce insights.",
  keywords: [
    "CME guide GCC",
    "CPD requirements healthcare",
    "QCHP renewal guide",
    "SCFHS CME guide",
    "healthcare compliance GCC",
    "CME blog healthcare professionals",
    "CPD tracker guide",
    "GCC healthcare licensing",
  ],
  openGraph: {
    title: "CME & CPD Guides for GCC Healthcare Professionals",
    description: "In-depth guides on CME, CPD, and licensing requirements for QCHP, SCFHS, DHA, and all GCC health authorities.",
    url: `${APP_URL}/blog`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/blog` },
};

const POSTS = [
  {
    slug: "qchp-renewal-guide-2026",
    title: "Complete QCHP License Renewal Guide 2026",
    description: "Step-by-step guide to renewing your QCHP healthcare license in Qatar. 80 CPD requirements, accepted activities, submission timeline, and the most common mistakes that delay renewal.",
    publishedAt: "2026-06-10",
    category: "country",
    readingMinutes: 8,
    tag: "Qatar · QCHP",
  },
  {
    slug: "scfhs-cme-requirements-2026",
    title: "SCFHS CME Requirements 2026: Complete Guide",
    description: "Everything healthcare professionals need to know about SCFHS CME in 2026. Credit hours by profession, accepted accreditors, category caps, and how to track your progress toward renewal.",
    publishedAt: "2026-06-08",
    category: "country",
    readingMinutes: 10,
    tag: "Saudi Arabia · SCFHS",
  },
  {
    slug: "cme-vs-cpd-gcc",
    title: "CME vs CPD in GCC: What Every Healthcare Professional Needs to Know",
    description: "QCHP calls it CPD. SCFHS calls it CME. DHA says CME. DOH says CPD. A clear, practical guide to understanding the difference — and why it matters for your license renewal.",
    publishedAt: "2026-06-05",
    category: "guide",
    readingMinutes: 6,
    tag: "GCC · All Authorities",
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  guide:   "bg-[#eff6ff] text-[#1e40af]",
  country: "bg-[#f0fdf4] text-[#166534]",
};
const CATEGORY_LABELS: Record<string, string> = {
  guide:   "Guide",
  country: "Country Guide",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"><span className="text-white text-sm font-bold">H</span></div>
            <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
          </Link>
          <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">Start free →</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-3">CME & CPD guides</h1>
          <p className="text-lg text-[#64748b]">In-depth guides on CME, CPD, and licensing requirements for GCC healthcare professionals.</p>
        </div>

        <div className="space-y-5">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:border-[#1a56a0] hover:shadow-sm transition-all group">
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.guide}`}>
                  {CATEGORY_LABELS[post.category] ?? "Article"}
                </span>
                <span className="text-xs text-[#94a3b8]">{post.tag}</span>
                <span className="text-xs text-[#94a3b8]">·</span>
                <span className="text-xs text-[#94a3b8]">{post.readingMinutes} min read</span>
              </div>
              <h2 className="text-lg font-bold text-[#111] mb-2 group-hover:text-[#1a56a0] transition-colors leading-snug">{post.title}</h2>
              <p className="text-sm text-[#64748b] leading-relaxed mb-3">{post.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94a3b8]">{formatDate(post.publishedAt)}</span>
                <span className="text-xs font-semibold text-[#1a56a0] group-hover:underline">Read article →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Track your CME while you read</h2>
          <p className="text-[#94a3b8] mb-5 text-sm max-w-sm mx-auto">Log activities, upload certificates, and get renewal alerts — free for all GCC healthcare professionals.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
        </div>
      </main>
    </div>
  );
}
