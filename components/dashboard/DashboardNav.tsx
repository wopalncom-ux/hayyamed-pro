"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import NotificationBell from "./NotificationBell";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/cme", label: "CME Wallet" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/licenses", label: "Licenses" },
  { href: "/dashboard/marketplace", label: "Marketplace" },
  { href: "/dashboard/marketplace/my-courses", label: "My Courses" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-[#e2e8f0]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <span className="text-base font-bold text-[#1a56a0]">Hayya Med PRO</span>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <span className="text-sm text-[#64748b] ml-1">{userName}</span>
          </div>
        </div>
        <nav className="flex gap-6 -mb-px overflow-x-auto">
          {NAV_ITEMS.map(({ href, label }) => (
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
  );
}
