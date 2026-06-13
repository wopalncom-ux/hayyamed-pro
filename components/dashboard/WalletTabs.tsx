"use client";

import { useRouter, usePathname } from "next/navigation";
import { toCountryCode } from "@/lib/countryCode";

function countryFlag(country: string): string {
  const code = toCountryCode(country).toUpperCase();
  if (code.length !== 2) return "🌍";
  return String.fromCodePoint(
    0x1f1e6 - 65 + code.charCodeAt(0),
    0x1f1e6 - 65 + code.charCodeAt(1)
  );
}

interface WalletTab {
  id: string;
  country: string;
  label: string | null;
  compliance_status: string;
}

export default function WalletTabs({
  wallets,
  activeWalletId,
}: {
  wallets: WalletTab[];
  activeWalletId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  if (wallets.length <= 1) return null;

  const statusColor = (status: string) =>
    status === "compliant" ? "#16a34a" : status === "at_risk" ? "#d97706" : "#dc2626";

  return (
    <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-0.5">
      {wallets.map((w) => {
        const isActive = w.id === activeWalletId;
        return (
          <button
            key={w.id}
            onClick={() => router.push(`${pathname}?wallet=${w.id}`)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? "bg-[#eff6ff] text-[#1a56a0] border border-[#bfdbfe]"
                : "bg-white text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#111]"
            }`}
          >
            <span className="text-base leading-none">{countryFlag(w.country)}</span>
            <span>{w.label ?? w.country}</span>
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColor(w.compliance_status) }}
            />
          </button>
        );
      })}
      <a
        href="/dashboard/settings#compliance-countries"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#64748b] border border-dashed border-[#cbd5e1] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors whitespace-nowrap"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add country
      </a>
    </div>
  );
}
