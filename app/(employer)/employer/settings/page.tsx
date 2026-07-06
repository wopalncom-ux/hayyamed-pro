import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import BrandingSettings from "@/components/employer/BrandingSettings";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Organisation Settings — Hayya Med Pro Employer",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function EmployerSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name, type, country, city, verified, brand_color, brand_logo_url, brand_name_override, brand_email_from)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .limit(1)
    .maybeSingle();

  if (!member) redirect("/employer/register");

  const orgId = member.organization_id;
  const _orgs = member.organizations as {
    name: string; type: string; country: string | null; city: string | null;
    verified: boolean;
    brand_color: string | null; brand_logo_url: string | null;
    brand_name_override: string | null; brand_email_from: string | null;
  }[] | {
    name: string; type: string; country: string | null; city: string | null;
    verified: boolean;
    brand_color: string | null; brand_logo_url: string | null;
    brand_name_override: string | null; brand_email_from: string | null;
  } | null;

  const org = Array.isArray(_orgs) ? _orgs[0] : _orgs;
  if (!org) redirect("/employer");

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#111] mb-1">Organisation settings</h1>
        <p className="text-sm text-[#64748b]">
          Manage branding, profile, and configuration for{" "}
          <strong className="text-[#374151]">{org.name}</strong>.
        </p>
      </div>

      {/* Organisation Profile (read-only) */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-[#f1f5f9] flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#111]">Organisation profile</h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              To update your organisation&apos;s registered details, contact{" "}
              <a href="mailto:support@hayyamed.pro" className="text-[#1a56a0] hover:underline">support@hayyamed.pro</a>.
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
            org.verified
              ? "bg-[#dcfce7] text-[#16a34a]"
              : "bg-[#fff7ed] text-[#d97706]"
          }`}>
            {org.verified ? "Verified" : "Pending verification"}
          </span>
        </div>
        <div className="px-6 py-5 grid sm:grid-cols-2 gap-4">
          {[
            { label: "Organisation name",  value: org.name },
            { label: "Type",               value: org.type?.replace(/_/g, " ") ?? "—" },
            { label: "Country",            value: org.country ?? "—" },
            { label: "City",               value: org.city ?? "—" },
            { label: "Organisation ID",    value: orgId },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-[#94a3b8] uppercase tracking-wide font-medium mb-0.5">{label}</p>
              <p className={`text-sm text-[#374151] ${label === "Organisation ID" ? "font-mono text-xs" : ""}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Branding */}
      <div className="mb-6">
        <BrandingSettings
          organizationId={orgId}
          orgName={org.name}
          initial={{
            brand_color:         org.brand_color,
            brand_logo_url:      org.brand_logo_url,
            brand_name_override: org.brand_name_override,
            brand_email_from:    org.brand_email_from,
          }}
        />
      </div>

      {/* Quick links to other settings */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f1f5f9]">
          <h3 className="text-sm font-semibold text-[#111]">More settings</h3>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {[
            { href: "/employer/api-keys",          label: "API Keys",             desc: "Manage HRIS integration API keys and scopes" },
            { href: "/employer/webhooks",           label: "Webhooks",             desc: "Configure event notifications to your system" },
            { href: "/employer/integration",        label: "Integration guide",    desc: "REST API documentation and code samples" },
            { href: "/employer/required-training",  label: "Required training",    desc: "Set mandatory CME courses for your staff" },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-[#f8fafc] transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-[#111] group-hover:text-[#1a56a0] transition-colors">{label}</p>
                <p className="text-xs text-[#64748b]">{desc}</p>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
