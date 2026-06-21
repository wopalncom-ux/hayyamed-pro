"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, PenLine, Sparkles, Map, BarChart2,
  CreditCard, Award, ShoppingBag, GraduationCap, Bell, Users,
  Receipt, Settings, Building2, Download, Search, IdCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationBell from "./NotificationBell";
import SignOutButton from "./SignOutButton";
import CommandPalette from "./CommandPalette";
import { triggerAppDownloadModal } from "@/components/AppDownloadModal";

const NAV_ITEMS = [
  { href: "/dashboard",                         label: "Overview",      Icon: LayoutDashboard },
  { href: "/dashboard/cme",                     label: "CME Wallet",    Icon: BookOpen },
  { href: "/dashboard/cme/reflections",         label: "Reflections",   Icon: PenLine },
  { href: "/dashboard/ai",                      label: "✦ AI",          Icon: Sparkles },
  { href: "/dashboard/ai/learning-pathway",     label: "Learning Plan", Icon: Map },
  { href: "/dashboard/analytics",               label: "Analytics",     Icon: BarChart2 },
  { href: "/dashboard/licenses",                label: "Licenses",      Icon: CreditCard },
  { href: "/dashboard/certificates",            label: "Certificates",  Icon: Award },
  { href: "/dashboard/passport",               label: "My Passport",   Icon: IdCard },
  { href: "/dashboard/marketplace",             label: "Marketplace",   Icon: ShoppingBag },
  { href: "/dashboard/marketplace/my-courses",  label: "My Courses",    Icon: GraduationCap },
  { href: "/dashboard/notifications",           label: "Notifications", Icon: Bell },
  { href: "/dashboard/refer",                   label: "Refer",         Icon: Users },
  { href: "/dashboard/billing",                 label: "Billing",       Icon: Receipt },
  { href: "/dashboard/settings",                label: "Settings",      Icon: Settings },
];

export default function DashboardNav({
  userName,
  orgName,
  orgLogoUrl,
  isEmployerAdmin = false,
}: {
  userName: string;
  orgName?: string;
  orgLogoUrl?: string;
  isEmployerAdmin?: boolean;
}) {
  const pathname = usePathname();
  const navItems = [
    ...NAV_ITEMS,
    ...(isEmployerAdmin ? [{ href: "/employer", label: "Employer", Icon: Building2 }] : []),
  ];
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header className="bg-white border-b border-[#e2e8f0] relative z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</span>
              {orgLogoUrl && (
                <div className="hidden sm:flex items-center gap-2 border-l border-[#e2e8f0] pl-3">
                  <div className="relative w-7 h-7 rounded overflow-hidden border border-[#e2e8f0] bg-white flex-shrink-0">
                    <Image src={orgLogoUrl} alt={orgName ?? "Employer"} fill className="object-contain p-0.5" unoptimized />
                  </div>
                  {orgName && <span className="text-xs text-[#64748b] max-w-[120px] truncate">{orgName}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* Command palette — desktop */}
              <CommandPalette isEmployerAdmin={isEmployerAdmin} />
              {/* Download App — desktop */}
              <button
                type="button"
                onClick={() => triggerAppDownloadModal()}
                title="Download Hayya Med Pro App"
                aria-label="Download app"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1a56a0] bg-[#e8f0fe] hover:bg-[#d1e3fd] transition-colors mr-1"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Download App
              </button>
              <NotificationBell />
              <span className="text-sm text-[#64748b] ml-1 hidden sm:inline">{userName}</span>
              <SignOutButton variant="icon" className="hidden md:flex" />
              {/* Mobile search trigger */}
              <button
                onClick={() => window.dispatchEvent(new Event("hayya:search:open"))}
                className="md:hidden p-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
                aria-label="Search dashboard"
              >
                <Search className="w-5 h-5 text-[#374151]" aria-hidden="true" />
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 -mr-1 rounded-lg hover:bg-[#f8fafc] transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={drawerOpen}
              >
                <svg className="w-5 h-5 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop tab bar */}
          <nav className="hidden md:flex gap-6 -mb-px overflow-x-auto" aria-label="Main navigation">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm py-3 border-b-2 whitespace-nowrap transition-colors",
                  pathname === href
                    ? "border-[#1a56a0] text-[#1a56a0] font-medium"
                    : "border-transparent text-[#64748b] hover:text-[#111]"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-opacity duration-200",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!drawerOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />

        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-200",
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
            <span className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[#f8fafc] transition-colors"
              aria-label="Close navigation menu"
            >
              <svg className="w-5 h-5 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User identity */}
          <div className="px-4 py-3 border-b border-[#e2e8f0]">
            <p className="text-xs text-[#64748b] uppercase tracking-wide mb-0.5">Signed in as</p>
            <p className="text-sm font-medium text-[#111] truncate">{userName}</p>
          </div>

          {/* Nav links with icons */}
          <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Mobile navigation">
            {navItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-0.5 transition-colors",
                  pathname === href
                    ? "bg-[#e8f0fe] text-[#1a56a0] font-semibold"
                    : "text-[#374151] hover:bg-[#f8fafc]"
                )}
              >
                <Icon
                  className={cn("w-4 h-4 flex-shrink-0", pathname === href ? "text-[#1a56a0]" : "text-[#94a3b8]")}
                  aria-hidden="true"
                />
                {label}
              </Link>
            ))}
          </nav>

          {/* Drawer footer */}
          <div className="px-2 py-3 border-t border-[#e2e8f0] space-y-1">
            {/* Search */}
            <button
              type="button"
              onClick={() => { setDrawerOpen(false); window.dispatchEvent(new Event("hayya:search:open")); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#374151] hover:bg-[#f8fafc] transition-colors"
            >
              <Search className="w-4 h-4 flex-shrink-0 text-[#94a3b8]" aria-hidden="true" />
              Search dashboard
            </button>
            {/* Download App */}
            <button
              type="button"
              onClick={() => { setDrawerOpen(false); triggerAppDownloadModal(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#1a56a0] bg-[#e8f0fe] hover:bg-[#d1e3fd] transition-colors font-semibold"
            >
              <Download className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              Download App
            </button>
            <a
              href="/help"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#64748b] hover:bg-[#f8fafc] transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
              </svg>
              Help &amp; FAQ
            </a>
            <SignOutButton variant="full" />
          </div>
        </div>
      </div>
    </>
  );
}
