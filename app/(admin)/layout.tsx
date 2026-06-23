import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { template: "%s — Hayya Med Admin", default: "Admin — Hayya Med Pro" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [memberRes, profileRes, pendingRes] = await Promise.all([
    admin
      .from("organization_members")
      .select("role")
      .eq("auth_id", user.id)
      .in("role", ["founder", "master_admin", "super_admin"])
      .maybeSingle(),
    admin
      .from("professional_profiles")
      .select("full_name")
      .eq("auth_id", user.id)
      .maybeSingle(),
    Promise.all([
      admin.from("cme_activities").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
      admin.from("employer_link_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("training_providers").select("id", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("courses").select("id", { count: "exact", head: true }).eq("status", "draft"),
      admin.from("demo_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    ]),
  ]);

  if (!memberRes.data) redirect("/dashboard");

  const [cmeRes, linksRes, providersRes, coursesRes, demosRes] = pendingRes;

  const adminName = profileRes.data?.full_name ?? user.email?.split("@")[0] ?? "Admin";
  const role = memberRes.data.role;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <AdminSidebar
        role={role}
        adminName={adminName}
        pendingCme={cmeRes.count ?? 0}
        pendingLinks={linksRes.count ?? 0}
        pendingProviders={providersRes.count ?? 0}
        pendingCourses={coursesRes.count ?? 0}
        pendingDemos={demosRes.count ?? 0}
      />

      {/* Main — offset by sidebar width */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-[#e2e8f0] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-semibold text-white bg-[#1a56a0] px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0">
              Admin
            </span>
            <span className="text-sm text-[#64748b] hidden sm:block truncate">
              Hayya Med PRO — Master Control
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M8 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Public Site
            </a>
            <a
              href="/dashboard"
              className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors"
            >
              My Dashboard
            </a>
            <span className="text-xs font-medium text-[#374151] bg-[#f1f5f9] px-3 py-1.5 rounded-full">
              {adminName}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
