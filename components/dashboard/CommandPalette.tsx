"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, PenLine, Sparkles, Map, BarChart2,
  CreditCard, Award, ShoppingBag, GraduationCap, Bell, Users,
  Receipt, Settings, Building2, Plus, Download, FileText,
  HelpCircle, Search, X,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  href?: string;
  action?: () => void;
  Icon: React.ElementType;
  group: "navigate" | "quick-action";
  keywords?: string;
}

const BASE_ITEMS: CommandItem[] = [
  // Navigate
  { id: "nav-overview",     label: "Dashboard",       description: "CME overview & compliance ring",      href: "/dashboard",                        Icon: LayoutDashboard,  group: "navigate" },
  { id: "nav-cme",          label: "CME Wallet",       description: "All CME activities",                  href: "/dashboard/cme",                    Icon: BookOpen,         group: "navigate" },
  { id: "nav-reflections",  label: "Reflections",      description: "Learning journal",                    href: "/dashboard/cme/reflections",        Icon: PenLine,          group: "navigate" },
  { id: "nav-ai",           label: "AI Assistant",     description: "Compliance chatbot & gap analysis",   href: "/dashboard/ai",                     Icon: Sparkles,         group: "navigate" },
  { id: "nav-pathway",      label: "Learning Plan",    description: "AI learning pathway",                 href: "/dashboard/ai/learning-pathway",    Icon: Map,              group: "navigate" },
  { id: "nav-analytics",    label: "Analytics",        description: "Compliance charts & PDF report",      href: "/dashboard/analytics",              Icon: BarChart2,        group: "navigate" },
  { id: "nav-licenses",     label: "Licenses",         description: "License renewal dates",               href: "/dashboard/licenses",               Icon: CreditCard,       group: "navigate" },
  { id: "nav-certs",        label: "Certificates",     description: "Your CME certificates",               href: "/dashboard/certificates",           Icon: Award,            group: "navigate" },
  { id: "nav-marketplace",  label: "Marketplace",      description: "Browse CME courses",                  href: "/dashboard/marketplace",            Icon: ShoppingBag,      group: "navigate" },
  { id: "nav-my-courses",   label: "My Courses",       description: "Enrolled marketplace courses",        href: "/dashboard/marketplace/my-courses", Icon: GraduationCap,    group: "navigate" },
  { id: "nav-notif",        label: "Notifications",    description: "Activity and deadline alerts",        href: "/dashboard/notifications",          Icon: Bell,             group: "navigate" },
  { id: "nav-refer",        label: "Refer a Colleague",description: "Invite colleagues, earn rewards",     href: "/dashboard/refer",                  Icon: Users,            group: "navigate" },
  { id: "nav-billing",      label: "Billing",          description: "Subscription & payment history",      href: "/dashboard/billing",                Icon: Receipt,          group: "navigate" },
  { id: "nav-settings",     label: "Settings",         description: "Profile, privacy, MFA",               href: "/dashboard/settings",               Icon: Settings,         group: "navigate" },
  { id: "nav-help",         label: "Help & FAQ",       description: "Support and documentation",           href: "/help",                             Icon: HelpCircle,       group: "navigate" },
  // Quick actions
  { id: "qa-add-cme",       label: "Add CME activity", description: "Log a new CME activity",             href: "/dashboard/cme?action=add",         Icon: Plus,             group: "quick-action", keywords: "log credit add cme activity" },
  { id: "qa-pdf",           label: "Download PDF report", description: "Download compliance PDF",          href: "/dashboard/analytics",              Icon: Download,         group: "quick-action", keywords: "report pdf download compliance" },
  { id: "qa-gap",           label: "Run gap analysis",  description: "AI compliance gap analysis",         href: "/dashboard/ai",                     Icon: FileText,         group: "quick-action", keywords: "gap ai analysis missing credit" },
  { id: "qa-pricing",       label: "Upgrade to Pro",    description: "Unlock PDF reports and AI features", href: "/pricing",                          Icon: Award,            group: "quick-action", keywords: "upgrade pro plan premium" },
];

function normalise(s: string) { return s.toLowerCase().replace(/[^a-z0-9 ]/g, " "); }

function score(item: CommandItem, query: string): number {
  if (!query) return 0;
  const q = normalise(query);
  const label = normalise(item.label);
  const desc = normalise(item.description ?? "");
  const kw = normalise(item.keywords ?? "");
  if (label.startsWith(q)) return 3;
  if (label.includes(q)) return 2;
  if (desc.includes(q) || kw.includes(q)) return 1;
  return 0;
}

export default function CommandPalette({ isEmployerAdmin = false }: { isEmployerAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const items: CommandItem[] = [
    ...BASE_ITEMS,
    ...(isEmployerAdmin ? [{ id: "nav-employer", label: "Employer Dashboard", description: "Staff compliance overview", href: "/employer", Icon: Building2, group: "navigate" as const }] : []),
  ];

  const filtered = query
    ? items.filter(i => score(i, query) > 0).sort((a, b) => score(b, query) - score(a, query))
    : items;

  const grouped = {
    "quick-action": filtered.filter(i => i.group === "quick-action"),
    "navigate": filtered.filter(i => i.group === "navigate"),
  };
  const flat = [...grouped["quick-action"], ...grouped["navigate"]];

  const open_ = useCallback(() => { setOpen(true); setQuery(""); setSelected(0); }, []);
  const close = useCallback(() => { setOpen(false); }, []);

  const confirm = useCallback((item: CommandItem) => {
    close();
    if (item.action) { item.action(); return; }
    if (item.href) router.push(item.href);
  }, [close, router]);

  // Keyboard shortcut + external open event (for mobile trigger)
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); open_(); }
      if (e.key === "Escape") close();
    }
    function openEvent() { open_(); }
    window.addEventListener("keydown", handler);
    window.addEventListener("hayya:search:open", openEvent);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("hayya:search:open", openEvent);
    };
  }, [open_, close]);

  // Focus input on open
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  // Arrow navigation + Enter
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, flat.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && flat[selected]) { confirm(flat[selected]); }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, flat, selected, confirm]);

  if (!open) return (
    <button
      onClick={open_}
      aria-label="Open command palette (Ctrl+K)"
      className="hidden md:flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm text-[#94a3b8] hover:border-[#1a56a0]/30 hover:text-[#64748b] transition-colors cursor-text min-w-[180px]"
    >
      <Search className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-medium text-[#94a3b8] border border-[#e2e8f0] rounded px-1 py-0.5">⌘K</kbd>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4" aria-modal="true" role="dialog" aria-label="Command palette">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#e2e8f0]">
          <Search className="w-4 h-4 text-[#94a3b8] flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search dashboard..."
            className="flex-1 bg-transparent text-sm text-[#111] placeholder-[#94a3b8] outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#94a3b8] hover:text-[#64748b]" aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-medium text-[#94a3b8] border border-[#e2e8f0] rounded px-1.5 py-0.5 hidden sm:block">esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
          {flat.length === 0 && (
            <p className="text-sm text-[#64748b] px-4 py-6 text-center">No results for &ldquo;{query}&rdquo;</p>
          )}

          {grouped["quick-action"].length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest px-4 pt-3 pb-1">Quick actions</p>
              {grouped["quick-action"].map((item) => {
                const idx = flat.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => confirm(item)}
                    onMouseEnter={() => setSelected(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${idx === selected ? "bg-[#f0f7ff]" : "hover:bg-[#f8fafc]"}`}
                  >
                    <item.Icon className={`w-4 h-4 flex-shrink-0 ${idx === selected ? "text-[#1a56a0]" : "text-[#94a3b8]"}`} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${idx === selected ? "text-[#1a56a0]" : "text-[#111]"}`}>{item.label}</p>
                      {item.description && <p className="text-xs text-[#64748b] truncate">{item.description}</p>}
                    </div>
                    {idx === selected && <span className="text-xs text-[#94a3b8]">↵</span>}
                  </button>
                );
              })}
            </div>
          )}

          {grouped["navigate"].length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest px-4 pt-3 pb-1">Navigate</p>
              {grouped["navigate"].map((item) => {
                const idx = flat.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => confirm(item)}
                    onMouseEnter={() => setSelected(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${idx === selected ? "bg-[#f0f7ff]" : "hover:bg-[#f8fafc]"}`}
                  >
                    <item.Icon className={`w-4 h-4 flex-shrink-0 ${idx === selected ? "text-[#1a56a0]" : "text-[#94a3b8]"}`} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${idx === selected ? "text-[#1a56a0]" : "text-[#111]"}`}>{item.label}</p>
                      {item.description && <p className="text-xs text-[#64748b] truncate">{item.description}</p>}
                    </div>
                    {idx === selected && <span className="text-xs text-[#94a3b8]">↵</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-[#e2e8f0] flex items-center gap-4 text-[10px] text-[#94a3b8]">
          <span><kbd className="border border-[#e2e8f0] rounded px-1">↑</kbd> <kbd className="border border-[#e2e8f0] rounded px-1">↓</kbd> to navigate</span>
          <span><kbd className="border border-[#e2e8f0] rounded px-1">↵</kbd> to open</span>
          <span><kbd className="border border-[#e2e8f0] rounded px-1">esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
