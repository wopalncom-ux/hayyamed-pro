"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

type Section = {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
};

type NavItem = {
  href: string;
  label: string;
  badge?: number;
  external?: boolean;
  danger?: boolean;
};

type Props = {
  role: string;
  ownerName: string;
  email: string;
  pendingCme: number;
  pendingLinks: number;
  pendingProviders: number;
  totalUsers: number;
  maintenanceMode: boolean;
};

function Icon({ d, className = "w-4 h-4" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d={d} />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 16 16" fill="none"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OwnerSidebar({
  role,
  ownerName,
  email,
  pendingCme,
  pendingLinks,
  pendingProviders,
  totalUsers,
  maintenanceMode,
}: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    executive: true,
    operations: true,
    monitoring: false,
    content: false,
    security: false,
    system: false,
    emergency: true,
  });

  const totalPending = pendingCme + pendingLinks + pendingProviders;

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const sections: Section[] = [
    {
      id: "executive",
      label: "Executive",
      icon: <Icon d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />,
      items: [
        { href: "/owner/command-center", label: "Command Center" },
      ],
    },
    {
      id: "operations",
      label: "Platform Operations",
      icon: <Icon d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />,
      items: [
        { href: "/owner/users", label: "User Management", badge: totalUsers },
        { href: "/owner/revenue", label: "Revenue & Subscriptions" },
        { href: "/owner/compliance", label: "Compliance Control" },
        { href: "/admin/link-requests", label: "Link Requests", badge: pendingLinks || undefined, external: true },
        { href: "/admin/cme-verification", label: "CME Queue", badge: pendingCme || undefined, external: true },
        { href: "/admin/training-providers", label: "Providers", badge: pendingProviders || undefined, external: true },
      ],
    },
    {
      id: "monitoring",
      label: "Monitoring & AI",
      icon: <Icon d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />,
      items: [
        { href: "/owner/monitoring", label: "Platform Monitoring" },
        { href: "/owner/ai", label: "AI Command Center" },
        { href: "/owner/integrations", label: "Integration Center" },
        { href: "/admin/health", label: "Health Check", external: true },
        { href: "/admin/performance", label: "Performance", external: true },
        { href: "/admin/logs", label: "Error Logs", external: true },
      ],
    },
    {
      id: "content",
      label: "Content & Marketing",
      icon: <Icon d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />,
      items: [
        { href: "/admin/content", label: "CMS Builder", external: true },
        { href: "/admin/seo", label: "SEO Manager", external: true },
        { href: "/admin/media", label: "Media Library", external: true },
        { href: "/admin/email-campaigns", label: "Email Campaigns", external: true },
        { href: "/admin/announcements", label: "Announcements", external: true },
        { href: "/admin/push-compose", label: "Push Broadcasts", external: true },
        { href: "/admin/analytics", label: "Analytics", external: true },
      ],
    },
    {
      id: "security",
      label: "Audit & Security",
      icon: <Icon d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
      items: [
        { href: "/owner/audit", label: "Audit Logs" },
        { href: "/admin/audit-logs", label: "Full Audit Trail", external: true },
        { href: "/admin/user-actions", label: "User Actions", external: true },
        { href: "/admin/feature-flags", label: "Feature Flags", external: true },
        { href: "/admin/webhooks", label: "Webhooks", external: true },
      ],
    },
    {
      id: "system",
      label: "System & Reports",
      icon: <Icon d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />,
      items: [
        { href: "/admin/settings", label: "Platform Settings", external: true },
        { href: "/admin/reports", label: "Reports Center", external: true },
        { href: "/admin/db", label: "Database Admin", external: true },
        { href: "/admin/exports", label: "Data Exports", external: true },
        { href: "/admin/discounts", label: "Discounts", external: true },
        { href: "/admin/changelog", label: "Changelog", external: true },
      ],
    },
    {
      id: "emergency",
      label: "Emergency Control",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      items: [
        { href: "/owner/emergency", label: "Emergency Controls", danger: true },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-200 ${
          collapsed ? "w-0 overflow-hidden lg:w-16" : "w-64"
        }`}
        style={{ backgroundColor: "#06090f" }}
      >
        {/* Identity header */}
        <div className="flex-shrink-0 px-4 py-5 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "#f59e0b", color: "#0a0500" }}>
                    {role === "founder" ? "FOUNDER" : "OWNER"}
                  </span>
                </div>
                <p className="text-sm font-bold text-white truncate">{ownerName}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: "#6b7280" }}>{email}</p>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/5 text-gray-500 hover:text-gray-300 lg:flex hidden"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex justify-center p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Maintenance mode alert */}
        {maintenanceMode && !collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg text-[11px] font-semibold"
            style={{ background: "#7f1d1d", color: "#fca5a5" }}>
            ⚠ MAINTENANCE MODE ACTIVE
          </div>
        )}

        {/* Total pending alert */}
        {totalPending > 0 && !collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg text-[11px] font-medium flex items-center justify-between"
            style={{ background: "#1c1408", color: "#fbbf24" }}>
            <span>Pending actions</span>
            <span className="font-black">{totalPending}</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {sections.map((section) => {
            const isOpen = openSections[section.id] ?? false;
            const hasActive = section.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"));

            return (
              <div key={section.id}>
                {!collapsed ? (
                  <>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors mb-0.5 ${
                        hasActive ? "text-amber-400" : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={section.id === "emergency" ? "text-red-400" : ""}>{section.icon}</span>
                        <span className={section.id === "emergency" ? "text-red-400" : ""}>{section.label}</span>
                      </div>
                      <ChevronDown open={isOpen} />
                    </button>

                    {isOpen && (
                      <div className="space-y-0.5 mb-2">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                          return (
                            <a
                              key={item.href}
                              href={item.href}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                                isActive
                                  ? "text-white font-medium"
                                  : item.danger
                                  ? "text-red-400 hover:text-red-300 hover:bg-red-950/40"
                                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                              }`}
                              style={isActive ? { background: "#1e3a5f", color: "#93c5fd" } : undefined}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-1 h-1 rounded-full bg-current opacity-50 flex-shrink-0" />
                                <span className="truncate">{item.label}</span>
                                {item.external && (
                                  <svg className="w-3 h-3 opacity-30 flex-shrink-0" viewBox="0 0 12 12" fill="none">
                                    <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M8 1h3m0 0v3m0-3L5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              {item.badge !== undefined && item.badge > 0 && (
                                <span className="text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded-full leading-none flex-shrink-0">
                                  {item.badge > 999 ? "999+" : item.badge}
                                </span>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  // Collapsed: show icon only for first item in each section
                  <a
                    href={section.items[0]?.href ?? "#"}
                    title={section.label}
                    className="flex items-center justify-center p-2.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-colors"
                  >
                    {section.icon}
                  </a>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="flex-shrink-0 border-t border-white/5 px-3 py-3 space-y-1">
            <a
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 4a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 9a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 8a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 001-1V9a1 1 0 00-1-1h-1z" fill="currentColor" />
              </svg>
              Admin Panel
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5a1 1 0 012 0v3.586l1.707 1.707a1 1 0 01-1.414 1.414l-2-2A1 1 0 017 9V5z" />
              </svg>
              My Dashboard
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M8 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Public Site
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
