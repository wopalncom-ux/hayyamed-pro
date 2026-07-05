"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Link2, CheckSquare, FileText,
  GraduationCap, BookOpen, Star, Globe, Map,
  DollarSign, CreditCard, Tag, BarChart2, ThumbsUp, TrendingUp,
  ClipboardList, UserPlus,
  FileEdit, Image, Search, Mail, Megaphone, Handshake, ScrollText, Send,
  Bot, Zap, Flag, Bell, Webhook, Activity, Heart,
  Gauge, User, Database, Settings, Download, WrenchIcon,
  ChevronDown, ChevronRight, Menu, X, ExternalLink,
  AlertCircle, Brain, Plug, AlertTriangle,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface Props {
  role: string;
  adminName: string;
  pendingCme: number;
  pendingLinks: number;
  pendingProviders: number;
  pendingCourses: number;
  pendingDemos: number;
}

export default function AdminSidebar({
  role, adminName, pendingCme, pendingLinks, pendingProviders, pendingCourses, pendingDemos,
}: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "People & Compliance": true,
    "Revenue & Growth": true,
    "Content & Marketing": false,
    "AI & Platform": false,
    "Monitoring": false,
    "System": false,
    "Owner Controls": false,
  });

  const sections: NavSection[] = [
    {
      title: "Overview",
      items: [
        { label: "Command Center", href: "/admin", icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: "People & Compliance",
      items: [
        { label: "Professionals",      href: "/admin/professionals",      icon: <Users size={16} /> },
        { label: "Employers",          href: "/admin/employers",          icon: <Building2 size={16} /> },
        { label: "Organizations",      href: "/admin/organizations",      icon: <Building2 size={16} /> },
        { label: "Link Requests",      href: "/admin/link-requests",      icon: <Link2 size={16} />,        badge: pendingLinks },
        { label: "CME Queue",          href: "/admin/cme-verification",   icon: <CheckSquare size={16} />,  badge: pendingCme },
        { label: "CME Activities",     href: "/admin/cme-activities",     icon: <FileText size={16} /> },
        { label: "Training Providers", href: "/admin/training-providers", icon: <GraduationCap size={16} />, badge: pendingProviders },
        { label: "Courses",            href: "/admin/courses",            icon: <BookOpen size={16} />,     badge: pendingCourses },
        { label: "Reviews",            href: "/admin/reviews",            icon: <Star size={16} /> },
        { label: "Compliance Map",     href: "/admin/compliance",         icon: <Globe size={16} /> },
        { label: "Country Rules",      href: "/admin/country-rules",      icon: <Map size={16} /> },
      ],
    },
    {
      title: "Revenue & Growth",
      items: [
        { label: "Revenue Dashboard", href: "/admin/revenue",         icon: <DollarSign size={16} /> },
        { label: "Subscriptions",     href: "/admin/subscriptions",   icon: <CreditCard size={16} /> },
        { label: "Discounts",         href: "/admin/discounts",       icon: <Tag size={16} /> },
        { label: "Analytics",         href: "/admin/analytics",       icon: <BarChart2 size={16} /> },
        { label: "NPS Survey",        href: "/admin/nps",             icon: <ThumbsUp size={16} /> },
        { label: "Growth",            href: "/admin/growth",          icon: <TrendingUp size={16} /> },
        { label: "Demo Requests",     href: "/admin/demo-requests",   icon: <ClipboardList size={16} />, badge: pendingDemos },
        { label: "Waitlist",          href: "/admin/waitlist",        icon: <UserPlus size={16} /> },
        { label: "QPay Invoices",     href: "/admin/qpay-invoices",   icon: <CreditCard size={16} /> },
      ],
    },
    {
      title: "Content & Marketing",
      items: [
        { label: "CMS Content",      href: "/admin/content",          icon: <FileEdit size={16} /> },
        { label: "Media Library",    href: "/admin/media",            icon: <Image size={16} /> },
        { label: "SEO Manager",      href: "/admin/seo",              icon: <Search size={16} /> },
        { label: "Email Templates",  href: "/admin/email-templates",  icon: <Mail size={16} /> },
        { label: "Email Campaigns",  href: "/admin/email-campaigns",  icon: <Send size={16} /> },
        { label: "Announcements",    href: "/admin/announcements",    icon: <Megaphone size={16} /> },
        { label: "Partners",         href: "/admin/partners",         icon: <Handshake size={16} /> },
        { label: "Changelog",        href: "/admin/changelog",        icon: <ScrollText size={16} /> },
      ],
    },
    {
      title: "AI & Platform",
      items: [
        { label: "AI Modules",       href: "/admin/ai-modules",          icon: <Bot size={16} /> },
        { label: "AI Costs",         href: "/admin/ai-costs",            icon: <Zap size={16} /> },
        { label: "AI Training",      href: "/admin/ai-training",         icon: <Brain size={16} /> },
        { label: "Feature Flags",    href: "/admin/feature-flags",       icon: <Flag size={16} /> },
        { label: "Push Compose",     href: "/admin/push-compose",        icon: <Bell size={16} /> },
        { label: "Notif Queue",      href: "/admin/notification-queue",  icon: <Bell size={16} /> },
        { label: "Webhooks",         href: "/admin/webhooks",            icon: <Webhook size={16} /> },
      ],
    },
    {
      title: "Monitoring",
      items: [
        { label: "Monitoring",     href: "/admin/monitoring",   icon: <Activity size={16} /> },
        { label: "Health",         href: "/admin/health",       icon: <Heart size={16} /> },
        { label: "Performance",    href: "/admin/performance",  icon: <Gauge size={16} /> },
        { label: "User Behavior",  href: "/admin/behavior",     icon: <User size={16} /> },
        { label: "Logs Center",    href: "/admin/logs",         icon: <ScrollText size={16} /> },
        { label: "Audit Log",      href: "/admin/audit-logs",   icon: <AlertCircle size={16} /> },
        { label: "Reports",        href: "/admin/reports",      icon: <FileText size={16} /> },
        { label: "Exports",        href: "/admin/exports",      icon: <Download size={16} /> },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Platform Settings", href: "/admin/settings",      icon: <Settings size={16} /> },
        { label: "DB Explorer",       href: "/admin/db",             icon: <Database size={16} /> },
        { label: "User Actions",      href: "/admin/user-actions",   icon: <WrenchIcon size={16} /> },
      ],
    },
    {
      title: "Owner Controls",
      items: [
        { label: "Integrations",       href: "/admin/integrations",  icon: <Plug size={16} /> },
        { label: "Emergency Controls", href: "/admin/emergency",     icon: <AlertTriangle size={16} /> },
      ],
    },
  ];

  function toggleSection(title: string) {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const totalBadge = pendingCme + pendingLinks + pendingProviders + pendingCourses + pendingDemos;

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#0f1f3d] text-white
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-0 lg:w-14 overflow-hidden" : "w-64"}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 flex-shrink-0">
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-white tracking-wide truncate">HAYYA MED PRO</p>
              <p className="text-[10px] text-blue-300 uppercase tracking-wider mt-0.5">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Admin identity */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1a56a0] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {adminName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{adminName}</p>
                <p className="text-[10px] text-blue-300 capitalize">{role.replace(/_/g, " ")}</p>
              </div>
            </div>
            {totalBadge > 0 && (
              <div className="mt-2.5 flex items-center gap-2 text-[10px] text-amber-300 bg-amber-400/10 rounded-lg px-2.5 py-1.5">
                <AlertCircle size={11} />
                <span>{totalBadge} item{totalBadge !== 1 ? "s" : ""} need attention</span>
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
          {sections.map((section) => {
            const isOverview = section.title === "Overview";
            const isOpen = isOverview || openSections[section.title] !== false;

            return (
              <div key={section.title} className="mb-1">
                {!isOverview && !collapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-semibold text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors"
                  >
                    <span>{section.title}</span>
                    {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  </button>
                )}

                {(isOpen || isOverview) && (
                  <div className="space-y-0.5 px-2">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={`
                            flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors relative
                            ${active
                              ? "bg-[#1a56a0] text-white font-medium"
                              : "text-white/60 hover:text-white hover:bg-white/8"
                            }
                            ${collapsed ? "justify-center" : ""}
                          `}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                          {!collapsed && (
                            <span className="truncate flex-1">{item.label}</span>
                          )}
                          {!collapsed && item.badge !== undefined && item.badge > 0 && (
                            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none flex-shrink-0">
                              {item.badge}
                            </span>
                          )}
                          {collapsed && item.badge !== undefined && item.badge > 0 && (
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer — quick links */}
        {!collapsed && (
          <div className="flex-shrink-0 border-t border-white/10 px-4 py-3 space-y-1">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Quick Links</p>
            {[
              { label: "My Dashboard",   href: "/dashboard" },
              { label: "Employer View",  href: "/employer" },
              { label: "Public Site",    href: "/", external: true },
            ].map(({ label, href, external }) => (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors py-1"
              >
                <ExternalLink size={11} />
                {label}
              </a>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
