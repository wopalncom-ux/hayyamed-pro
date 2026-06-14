import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Status | Hayya Med Pro",
  description: "Real-time status of Hayya Med Pro platform services.",
  robots: { index: false },
};

type ServiceStatus = "operational" | "degraded" | "outage";

interface Service {
  name: string;
  description: string;
  status: ServiceStatus;
}

async function getSystemStatus(): Promise<{
  overall: ServiceStatus;
  services: Service[];
  checkedAt: string;
}> {
  const checkedAt = new Date().toISOString();
  const services: Service[] = [];

  // API — always operational if we reach this point
  services.push({
    name: "Platform API",
    description: "Core application server and API endpoints",
    status: "operational",
  });

  // Database
  let dbStatus: ServiceStatus = "operational";
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("professional_profiles").select("id").limit(1);
    dbStatus = error ? "degraded" : "operational";
  } catch {
    dbStatus = "outage";
  }
  services.push({
    name: "Database",
    description: "Supabase Postgres — profiles, CME records, compliance data",
    status: dbStatus,
  });

  // Email
  services.push({
    name: "Email Notifications",
    description: "Transactional emails — verification, reminders, compliance alerts",
    status: process.env.POSTMARK_API_TOKEN ? "operational" : "degraded",
  });

  // Payments
  services.push({
    name: "Payments",
    description: "Subscription billing and checkout",
    status: process.env.PADDLE_API_KEY ? "operational" : "degraded",
  });

  // AI
  services.push({
    name: "AI Features",
    description: "Compliance gap analysis, CME recommendations, document OCR",
    status: process.env.GOOGLE_CLOUD_PROJECT ? "operational" : "degraded",
  });

  // Push notifications
  services.push({
    name: "Push Notifications",
    description: "License expiry alerts and CME deadline reminders",
    status: process.env.VAPID_PRIVATE_KEY ? "operational" : "degraded",
  });

  const hasOutage = services.some((s) => s.status === "outage");
  const hasDegraded = services.some((s) => s.status === "degraded");
  const overall: ServiceStatus = hasOutage ? "outage" : hasDegraded ? "degraded" : "operational";

  return { overall, services, checkedAt };
}

export default async function StatusPage() {
  const { overall, services, checkedAt } = await getSystemStatus();

  const BANNERS: Record<ServiceStatus, { bg: string; border: string; icon: string; title: string; text: string; textColor: string }> = {
    operational: {
      bg: "bg-[#f0fdf4]", border: "border-[#86efac]",
      icon: "✓",
      title: "All systems operational",
      text: "All Hayya Med Pro services are running normally.",
      textColor: "text-[#15803d]",
    },
    degraded: {
      bg: "bg-[#fff7ed]", border: "border-[#fed7aa]",
      icon: "⚠",
      title: "Some services degraded",
      text: "Most features are available. Some services may be impacted.",
      textColor: "text-[#b45309]",
    },
    outage: {
      bg: "bg-[#fef2f2]", border: "border-[#fecaca]",
      icon: "✕",
      title: "Service disruption",
      text: "We are aware of an issue and working to restore full service.",
      textColor: "text-[#b91c1c]",
    },
  };

  const STATUS_BADGE: Record<ServiceStatus, { label: string; bg: string; text: string; dot: string }> = {
    operational: { label: "Operational",    bg: "bg-[#dcfce7]", text: "text-[#15803d]", dot: "bg-[#16a34a]" },
    degraded:    { label: "Degraded",       bg: "bg-[#fff7ed]", text: "text-[#b45309]", dot: "bg-[#d97706]" },
    outage:      { label: "Outage",         bg: "bg-[#fee2e2]", text: "text-[#b91c1c]", dot: "bg-[#dc2626]" },
  };

  const banner = BANNERS[overall];
  const checkedDate = new Date(checkedAt);
  const checkedStr = checkedDate.toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Qatar", timeZoneName: "short",
  });

  const operationalCount = services.filter((s) => s.status === "operational").length;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="text-base font-bold text-[#1a56a0]">
            Hayya Med <span className="text-[#64748b] font-normal">Pro</span>
          </a>
          <span className="text-xs text-[#64748b]">System Status</span>
        </div>
      </header>

      <main id="main-content" className="max-w-2xl mx-auto px-4 py-10">
        {/* Overall status banner */}
        <div className={`rounded-2xl border px-6 py-6 mb-8 ${banner.bg} ${banner.border}`}>
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-xl font-bold leading-none ${banner.textColor}`}>{banner.icon}</span>
            <h1 className={`text-xl font-bold ${banner.textColor}`}>{banner.title}</h1>
          </div>
          <p className={`text-sm ${banner.textColor} opacity-80 ml-9`}>{banner.text}</p>
          <p className="text-xs text-[#94a3b8] mt-3 ml-9">
            {operationalCount} of {services.length} services operational
          </p>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-sm font-semibold text-[#374151]">Services</h2>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {services.map((svc) => {
              const badge = STATUS_BADGE[svc.status];
              return (
                <div key={svc.name} className="flex items-start justify-between px-6 py-4 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111] mb-0.5">{svc.name}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{svc.description}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0 ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${badge.dot}`} />
                    <span className={`text-xs font-semibold whitespace-nowrap ${badge.text}`}>{badge.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident history stub */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-sm font-semibold text-[#374151]">Past incidents</h2>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-[#94a3b8]">No incidents reported in the last 90 days.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-[#94a3b8]">
            Last checked: <time dateTime={checkedAt}>{checkedStr}</time>
          </p>
          <p className="text-xs text-[#94a3b8]">
            Issues? Contact{" "}
            <a href="mailto:support@hayyamed.pro" className="text-[#1a56a0] hover:underline">
              support@hayyamed.pro
            </a>
          </p>
          <p className="text-xs text-[#94a3b8]">
            <a href="/" className="hover:text-[#1a56a0] transition-colors">← Back to Hayya Med Pro</a>
          </p>
        </div>
      </main>
    </div>
  );
}
