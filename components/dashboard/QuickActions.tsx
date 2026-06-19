"use client";

import Link from "next/link";

interface QuickActionsProps {
  isPro: boolean;
  hasWallet: boolean;
}

const ACTIONS = (isPro: boolean, hasWallet: boolean) => [
  {
    label: "Add CME activity",
    description: "Log a completed course or conference",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    href: "/dashboard/cme",
    color: "bg-[#dbeafe] text-[#1a56a0] hover:bg-[#bfdbfe]",
    iconBg: "bg-[#1a56a0]",
    iconColor: "text-white",
    show: hasWallet,
  },
  {
    label: "View my licenses",
    description: "Check expiry dates and renewal status",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
      </svg>
    ),
    href: "/dashboard/licenses",
    color: "bg-[#dcfce7] text-[#16a34a] hover:bg-[#bbf7d0]",
    iconBg: "bg-[#16a34a]",
    iconColor: "text-white",
    show: true,
  },
  {
    label: "Download PDF report",
    description: isPro ? "Your compliance report is ready" : "Upgrade to Pro to download",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    href: isPro ? "/dashboard/analytics" : "/pricing",
    color: "bg-[#fef9c3] text-[#d97706] hover:bg-[#fde68a]",
    iconBg: isPro ? "bg-[#d97706]" : "bg-[#94a3b8]",
    iconColor: "text-white",
    badge: isPro ? null : "Pro",
    show: true,
  },
  {
    label: "Ask AI assistant",
    description: isPro ? "Get compliance guidance from AI" : "Available on Pro plan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    href: isPro ? "/dashboard/ai" : "/pricing",
    color: "bg-[#f3e8ff] text-[#7c3aed] hover:bg-[#e9d5ff]",
    iconBg: isPro ? "bg-[#7c3aed]" : "bg-[#94a3b8]",
    iconColor: "text-white",
    badge: isPro ? null : "Pro",
    show: true,
  },
];

export function QuickActions({ isPro, hasWallet }: QuickActionsProps) {
  const actions = ACTIONS(isPro, hasWallet).filter((a) => a.show);

  return (
    <section aria-labelledby="quick-actions-heading" className="mb-6">
      <h2 id="quick-actions-heading" className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-3">
        Quick actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map(({ label, description, icon, href, iconBg, iconColor, badge }) => (
          <Link
            key={label}
            href={href}
            className="group relative flex flex-col gap-3 bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56a0] focus-visible:ring-offset-2"
          >
            {badge && (
              <span className="absolute top-3 right-3 text-[9px] font-bold text-white bg-[#1a56a0] rounded-full px-1.5 py-0.5 leading-none">
                {badge}
              </span>
            )}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor} transition-transform group-hover:scale-105`}>
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0f1f3d] leading-tight group-hover:text-[#1a56a0] transition-colors">
                {label}
              </p>
              <p className="text-[11px] text-[#64748b] mt-0.5 leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
