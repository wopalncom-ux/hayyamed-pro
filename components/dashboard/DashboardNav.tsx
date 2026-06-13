"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import NotificationBell from "./NotificationBell";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/cme", label: "CME Wallet" },
  { href: "/dashboard/ai", label: "✦ AI" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/licenses", label: "Licenses" },
  { href: "/dashboard/marketplace", label: "Marketplace" },
  { href: "/dashboard/marketplace/my-courses", label: "My Courses" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
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
    ...(isEmployerAdmin ? [{ href: "/employer", label: "Employer" }] : []),
  ];
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
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
            <div className="flex items-center gap-2">
              <NotificationBell />
              <span className="text-sm text-[#64748b] ml-1 hidden sm:inline">{userName}</span>
              {/* Hamburger — visible on mobile only */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 -mr-1 rounded-lg hover:bg-[#f8fafc] transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={drawerOpen}
              >
                <svg className="w-5 h-5 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop tab bar — hidden below md */}
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

      {/* Mobile drawer — rendered in DOM but visually toggled via opacity/translate */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-opacity duration-200",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setDrawerOpen(false)}
        />

        {/* Drawer panel */}
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
              <svg className="w-5 h-5 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User identity */}
          <div className="px-4 py-3 border-b border-[#e2e8f0]">
            <p className="text-xs text-[#94a3b8] uppercase tracking-wide mb-0.5">Signed in as</p>
            <p className="text-sm font-medium text-[#111] truncate">{userName}</p>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Mobile navigation">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm mb-0.5 transition-colors",
                  pathname === href
                    ? "bg-[#e8f0fe] text-[#1a56a0] font-semibold"
                    : "text-[#374151] hover:bg-[#f8fafc]"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Drawer footer */}
          <div className="px-4 py-4 border-t border-[#e2e8f0]">
            <a href="/help" className="text-xs text-[#94a3b8] hover:text-[#374151] transition-colors">
              Help & FAQ
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
