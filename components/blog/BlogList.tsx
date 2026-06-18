"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  readingMinutes: number;
  tag: string;
};

const CATEGORY_STYLES: Record<string, string> = {
  guide:    "bg-[#eff6ff] text-[#1e40af]",
  country:  "bg-[#f0fdf4] text-[#166534]",
  specialty:"bg-[#fdf4ff] text-[#7e22ce]",
  profession:"bg-[#fff7ed] text-[#c2410c]",
  arabic:   "bg-[#fefce8] text-[#854d0e]",
};

const CATEGORY_LABELS: Record<string, string> = {
  guide:     "Guide",
  country:   "Country Guide",
  specialty: "Specialty",
  profession:"Profession",
  arabic:    "Arabic",
};

const TABS = [
  { key: "all",        label: "All" },
  { key: "guide",      label: "Guides" },
  { key: "country",    label: "Country" },
  { key: "specialty",  label: "Specialty" },
  { key: "profession", label: "Profession" },
  { key: "arabic",     label: "Arabic" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      const tabMatch = activeTab === "all" || p.category === activeTab;
      const searchMatch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      return tabMatch && searchMatch;
    });
  }, [posts, activeTab, query]);

  return (
    <>
      {/* Filter bar */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab.key
                  ? "bg-[#1a56a0] text-white"
                  : "bg-white border border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-[#64748b] mb-5">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        {activeTab !== "all" || query ? ` matching "${activeTab !== "all" ? CATEGORY_LABELS[activeTab] : ""}${query ? (activeTab !== "all" ? " · " : "") + query : ""}"` : ""}
      </p>

      {/* Post list */}
      <div className="space-y-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#64748b]">
            <p className="text-lg font-semibold mb-2">No articles found</p>
            <p className="text-sm">Try a different search term or category.</p>
          </div>
        ) : (
          filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:border-[#1a56a0] hover:shadow-sm transition-all group">
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.guide}`}>
                  {CATEGORY_LABELS[post.category] ?? "Article"}
                </span>
                <span className="text-xs text-[#64748b]">{post.tag}</span>
                <span className="text-xs text-[#64748b]">·</span>
                <span className="text-xs text-[#64748b]">{post.readingMinutes} min read</span>
              </div>
              <h2 className="text-lg font-bold text-[#111] mb-2 group-hover:text-[#1a56a0] transition-colors leading-snug">{post.title}</h2>
              <p className="text-sm text-[#64748b] leading-relaxed mb-3 line-clamp-2">{post.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748b]">{formatDate(post.publishedAt)}</span>
                <span className="text-xs font-semibold text-[#1a56a0] group-hover:underline">Read article →</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
