import Link from "next/link";
import type { ReactNode } from "react";

const GLOBAL_RESOURCES = [
  { title: "CME Requirements", desc: "Credits by country & authority", href: "/cme-requirements" },
  { title: "CPD Requirements", desc: "UK, Australia & GCC guide", href: "/cpd-requirements" },
  { title: "Medical Licence Renewal", desc: "Step-by-step renewal checklists", href: "/medical-license-renewal" },
  { title: "GCC CME Comparison", desc: "QCHP vs SCFHS vs DHA vs DOH", href: "/gcc-cme-requirements" },
  { title: "Global CME Guide", desc: "20+ countries & authorities", href: "/global-cme-requirements" },
  { title: "All Countries", desc: "Compare every GCC & global authority", href: "/countries" },
];

interface RelatedLink {
  label: string;
  href: string;
}

interface BlogPostLayoutProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  readingMinutes: number;
  author?: string;
  relatedLinks?: RelatedLink[];
  dir?: "ltr" | "rtl";
  children: ReactNode;
}

const CATEGORY_STYLES: Record<string, string> = {
  guide:      "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  country:    "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
  profession: "bg-[#fdf4ff] text-[#7e22ce] border-[#e9d5ff]",
  industry:   "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
};

const CATEGORY_LABELS: Record<string, string> = {
  guide:      "How-to Guide",
  country:    "Country Guide",
  profession: "Profession Guide",
  industry:   "Industry Insight",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPostLayout({
  title,
  description,
  publishedAt,
  updatedAt,
  category,
  readingMinutes,
  author = "Hayya Med Pro Editorial",
  relatedLinks = [],
  dir,
  children,
}: BlogPostLayoutProps) {
  const catStyle = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.guide;
  const catLabel = CATEGORY_LABELS[category] ?? "Article";

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={dir} lang={dir === "rtl" ? "ar" : undefined}>
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors hidden sm:block">← All articles</Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">Start free →</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
        {/* Post header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>
              {catLabel}
            </span>
            <span className="text-xs text-[#64748b]">{readingMinutes} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111] leading-tight mb-4">{title}</h1>
          <p className="text-base text-[#475569] leading-relaxed mb-5">{description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748b] border-t border-[#f1f5f9] pt-4">
            <span>By <span className="font-medium text-[#64748b]">{author}</span></span>
            <span>Published {formatDate(publishedAt)}</span>
            {updatedAt && updatedAt !== publishedAt && (
              <span>Updated {formatDate(updatedAt)}</span>
            )}
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 mb-8 text-xs text-[#92400e] leading-relaxed">
          <strong>Note:</strong> This article is for information only. CME/CPD rules change — always verify current requirements with QCHP, SCFHS, DHA, or your licensing authority before submitting your renewal.
        </div>

        {/* Article content */}
        <article className="prose prose-sm sm:prose-base max-w-none
          prose-headings:font-bold prose-headings:text-[#111] prose-headings:tracking-tight
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-[#374151] prose-p:leading-relaxed prose-p:mb-4
          prose-ul:text-[#374151] prose-li:mb-1
          prose-strong:text-[#111] prose-strong:font-semibold
          prose-a:text-[#1a56a0] prose-a:no-underline hover:prose-a:underline
          prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:text-[#64748b]
          prose-th:uppercase prose-th:tracking-wide prose-th:text-xs prose-th:py-3 prose-th:px-4
          prose-td:py-3 prose-td:px-4 prose-td:border-b prose-td:border-[#f1f5f9]
          prose-thead:bg-[#f8fafc]">
          {children}
        </article>

        {/* CTA */}
        <div className="mt-12 bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Track your CME automatically — free</h2>
          <p className="text-[#64748b] mb-6 text-sm max-w-sm mx-auto">Log activities, upload certificates, monitor your compliance ring, and get renewal alerts.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors">
            Start tracking free →
          </Link>
          <p className="text-[#475569] text-xs mt-3">No credit card required · 14-day Pro trial</p>
        </div>

        {/* CME Knowledge Base — global links to high-priority SEO pages */}
        <div className="mt-8 border border-[#e2e8f0] rounded-2xl p-6 bg-white">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.15em] mb-4">CME &amp; CPD Knowledge Base</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {GLOBAL_RESOURCES.map(r => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex flex-col gap-0.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2.5 hover:border-[#1a56a0]/40 hover:bg-[#f0f7ff] transition-all"
              >
                <span className="text-xs font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0] transition-colors leading-snug">{r.title}</span>
                <span className="text-[11px] text-[#64748b] leading-snug">{r.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Related links */}
        {relatedLinks.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Related guides</p>
            <div className="flex flex-wrap gap-2">
              {relatedLinks.map(l => (
                <Link key={l.href} href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] border border-[#e2e8f0] bg-white rounded-lg px-3 py-1.5 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
          <Link href="/blog" className="text-sm text-[#1a56a0] hover:underline">← Back to all articles</Link>
        </div>
      </main>
    </div>
  );
}
