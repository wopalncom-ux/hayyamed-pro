"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type SubNavItem = { href: string; label: string };

export default function DashboardSubNav({ items }: { items: SubNavItem[] }) {
  const pathname = usePathname();
  return (
    <div className="-mt-8 -mx-4 mb-8 bg-white border-b border-[#e2e8f0]">
      <div className="px-4">
        <nav className="flex gap-0 overflow-x-auto" aria-label="Section navigation">
          {items.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm px-4 py-3 border-b-2 whitespace-nowrap transition-colors",
                  active
                    ? "border-[#1a56a0] text-[#1a56a0] font-medium"
                    : "border-transparent text-[#64748b] hover:text-[#374151]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
