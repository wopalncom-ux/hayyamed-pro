import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Partner } from "@/lib/types";
import Image from "next/image";
import { createPartner, togglePartner } from "./actions";

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: partners } = await admin
    .from("partners")
    .select("*")
    .order("display_order");

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Partner Management</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Manage partner logos shown on the landing page and in the professional dashboard.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#111] mb-4 uppercase tracking-wide">Add Partner</h2>
        <form action={createPartner} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Partner name *</label>
            <input name="name" required className={inputCls} placeholder="e.g. QCHP" />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Partner type</label>
            <select name="partner_type" className={inputCls}>
              <option value="">— Select —</option>
              <option value="accreditor">Accreditor</option>
              <option value="government">Government</option>
              <option value="hospital">Hospital</option>
              <option value="university">University</option>
              <option value="employer">Employer</option>
              <option value="technology">Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#64748b] mb-1">Logo URL (HTTPS)</label>
            <input name="logo_url" type="url" className={inputCls} placeholder="https://…/logo.png" />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Website URL</label>
            <input name="website_url" type="url" className={inputCls} placeholder="https://…" />
          </div>

          <div>
            <label className="block text-xs text-[#64748b] mb-1">Country code</label>
            <input name="country_code" className={inputCls} placeholder="QA / SA / AE" maxLength={2} />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Display order (lower = first)</label>
            <input name="display_order" type="number" defaultValue="0" className={inputCls} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-[#64748b] mb-1">Tagline (shown on landing page)</label>
            <input name="tagline" className={inputCls} placeholder="Official CME accreditor — Qatar" />
          </div>

          <div>
            <label className="block text-xs text-[#64748b] mb-1">Show on landing page?</label>
            <select name="show_on_landing" className={inputCls}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Show in dashboard?</label>
            <select name="show_on_dashboard" className={inputCls}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="bg-[#1a56a0] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1547a0] transition-colors">
              Add partner
            </button>
          </div>
        </form>
      </div>

      {/* Partner list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!partners?.length && (
          <p className="col-span-3 text-[#94a3b8] text-sm py-8 text-center">No partners added yet.</p>
        )}
        {partners?.map((p: Partner) => (
          <div
            key={p.id}
            className={`bg-white rounded-xl border p-5 flex flex-col gap-3 ${
              p.is_active ? "border-[#e2e8f0]" : "border-[#e2e8f0] opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {p.logo_url ? (
                <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden border border-[#e2e8f0] bg-white">
                  <Image
                    src={p.logo_url}
                    alt={p.name}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-center text-[#94a3b8] text-xs font-bold uppercase">
                  {p.name.slice(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-[#111] text-sm truncate">{p.name}</p>
                {p.tagline && <p className="text-xs text-[#64748b] truncate">{p.tagline}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {p.partner_type && (
                <span className="text-xs bg-[#e8f0fe] text-[#1a56a0] px-2 py-0.5 rounded capitalize">{p.partner_type}</span>
              )}
              {p.country_code && (
                <span className="text-xs bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded">{p.country_code.toUpperCase()}</span>
              )}
              {p.show_on_landing && (
                <span className="text-xs bg-[#f0fdf4] text-[#16a34a] px-2 py-0.5 rounded">Landing</span>
              )}
              {p.show_on_dashboard && (
                <span className="text-xs bg-[#fef9c3] text-[#92400e] px-2 py-0.5 rounded">Dashboard</span>
              )}
            </div>

            <form action={togglePartner.bind(null, p.id, !p.is_active)}>
              <button
                type="submit"
                className={`w-full text-xs font-semibold py-1.5 rounded-lg transition-colors ${
                  p.is_active
                    ? "bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2]"
                    : "bg-[#dcfce7] text-[#16a34a] hover:bg-[#bbf7d0]"
                }`}
              >
                {p.is_active ? "Deactivate" : "Activate"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls = "w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]";
