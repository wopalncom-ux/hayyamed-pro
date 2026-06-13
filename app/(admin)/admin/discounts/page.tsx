import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Discount } from "@/lib/types";
import { createDiscount, toggleDiscount } from "./actions";

export default async function DiscountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: discounts } = await admin
    .from("discounts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Discount Management</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Create targeted discounts for individual members, employers, or global promo codes.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#111] mb-4 uppercase tracking-wide">Create Discount</h2>
        <form action={createDiscount} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-[#64748b] mb-1">Discount name *</label>
            <input name="name" required className={inputCls} placeholder="e.g. QCHP Partner 20%" />
          </div>

          <div>
            <label className="block text-xs text-[#64748b] mb-1">Type</label>
            <select name="discount_type" className={inputCls}>
              <option value="percentage">Percentage off (%)</option>
              <option value="fixed_amount">Fixed amount off ($)</option>
              <option value="free_upgrade">Free upgrade (100% off)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Value (% or $)</label>
            <input name="discount_value" type="number" step="0.01" min="0" defaultValue="0" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs text-[#64748b] mb-1">Target type</label>
            <select name="target_type" className={inputCls}>
              <option value="global">Global (all users)</option>
              <option value="user">Specific user</option>
              <option value="organization">Specific organization</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Target ID (UUID — leave blank for global)</label>
            <input name="target_id" className={inputCls} placeholder="user or org UUID" />
          </div>

          <div>
            <label className="block text-xs text-[#64748b] mb-1">Applicable plans (comma-separated)</label>
            <input name="applicable_plans" defaultValue="pro" className={inputCls} placeholder="pro, employer" />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Promo code (optional, global only)</label>
            <input name="promo_code" className={inputCls} placeholder="PARTNER2026" />
          </div>

          <div>
            <label className="block text-xs text-[#64748b] mb-1">Valid until (optional)</label>
            <input name="valid_until" type="datetime-local" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-[#64748b] mb-1">Max uses (optional)</label>
            <input name="max_uses" type="number" min="1" className={inputCls} placeholder="Unlimited" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-[#64748b] mb-1">Internal notes</label>
            <input name="notes" className={inputCls} placeholder="e.g. Agreed with QCHP partnership team" />
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="bg-[#1a56a0] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1547a0] transition-colors">
              Create discount
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Value</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Target</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Plans</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Uses</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Expires</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {!discounts?.length && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-[#94a3b8] text-sm">
                  No discounts created yet.
                </td>
              </tr>
            )}
            {discounts?.map((d: Discount) => (
              <tr key={d.id} className="hover:bg-[#f8fafc]">
                <td className="px-4 py-3 font-medium text-[#111]">
                  {d.name}
                  {d.promo_code && <span className="ml-2 text-xs bg-[#e8f0fe] text-[#1a56a0] px-2 py-0.5 rounded">{d.promo_code}</span>}
                </td>
                <td className="px-4 py-3 text-[#64748b] capitalize">{d.discount_type.replace("_", " ")}</td>
                <td className="px-4 py-3 text-[#111] font-semibold">
                  {d.discount_type === "free_upgrade"
                    ? "FREE"
                    : d.discount_type === "percentage"
                    ? `${d.discount_value}%`
                    : `$${d.discount_value}`}
                </td>
                <td className="px-4 py-3 text-[#64748b] capitalize">
                  {d.target_type}
                  {d.target_id && <span className="ml-1 text-xs text-[#94a3b8]">(specific)</span>}
                </td>
                <td className="px-4 py-3 text-[#64748b]">{d.applicable_plans.join(", ")}</td>
                <td className="px-4 py-3 text-[#64748b]">
                  {d.current_uses}/{d.max_uses ?? "∞"}
                </td>
                <td className="px-4 py-3 text-[#64748b]">
                  {d.valid_until ? new Date(d.valid_until).toLocaleDateString("en-GB") : "Never"}
                </td>
                <td className="px-4 py-3">
                  <form action={toggleDiscount.bind(null, d.id, !d.is_active)}>
                    <button
                      type="submit"
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        d.is_active
                          ? "bg-[#dcfce7] text-[#16a34a] hover:bg-[#bbf7d0]"
                          : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                      }`}
                    >
                      {d.is_active ? "Active" : "Inactive"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]";
