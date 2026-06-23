import type { Metadata } from "next";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import { createAdminClient } from "@/lib/supabase/server";
import OwnerSidebar from "@/components/owner/OwnerSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { template: "%s — Owner Command Center", default: "Owner — Hayya Med Pro" },
};

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireOwnerAuth();
  const admin = createAdminClient();

  const [pendingRes, totalUsersRes, emergencyRes] = await Promise.all([
    Promise.all([
      admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
      admin.from("employer_link_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("training_providers").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
    admin.from("platform_emergency_controls").select("maintenance_mode").maybeSingle(),
  ]);

  const [cmeRes, linksRes, providersRes] = pendingRes;

  return (
    <div className="min-h-screen flex" style={{ background: "#f0f4f8" }}>
      <OwnerSidebar
        role={session.role}
        ownerName={session.name}
        email={session.email}
        pendingCme={cmeRes.count ?? 0}
        pendingLinks={linksRes.count ?? 0}
        pendingProviders={providersRes.count ?? 0}
        totalUsers={totalUsersRes.count ?? 0}
        maintenanceMode={emergencyRes.data?.maintenance_mode ?? false}
      />

      {/* Main content — offset by sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between gap-4"
          style={{ background: "#06090f", borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: "#f59e0b", color: "#0a0500" }}
            >
              {session.role === "founder" ? "FOUNDER" : "OWNER"}
            </span>
            <span className="text-sm font-semibold text-white hidden sm:block">
              Hayya Med Pro — Owner Command Center
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M8 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9M10 2h4m0 0v4m0-4L7 9"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              hayyamed.pro
            </a>
            <a href="/admin" className="text-xs text-gray-400 hover:text-white transition-colors">
              Admin Panel
            </a>
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: "#111827", color: "#d1d5db" }}
            >
              {session.name}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
