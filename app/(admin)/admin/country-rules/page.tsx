import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Country Rules Engine — Admin" };

const COUNTRY_NAMES: Record<string, string> = {
  QA: "Qatar",
  SA: "Saudi Arabia",
  "AE-DU": "UAE — Dubai (DHA)",
  "AE-AZ": "UAE — Abu Dhabi (DOH)",
  KW: "Kuwait",
  BH: "Bahrain",
  OM: "Oman",
};

const FLAG: Record<string, string> = {
  QA: "🇶🇦",
  SA: "🇸🇦",
  "AE-DU": "🇦🇪",
  "AE-AZ": "🇦🇪",
  KW: "🇰🇼",
  BH: "🇧🇭",
  OM: "🇴🇲",
};

export default async function CountryRulesPage() {
  const admin = createAdminClient();

  const [{ data: rules }, { data: categories }] = await Promise.all([
    admin
      .from("country_compliance_rules")
      .select("id, country_code, profession_code, cycle_years, total_credits_required, credit_terminology, online_credits_max_pct, mandatory_credits_min, employer_report_required, effective_from, effective_to")
      .order("country_code")
      .order("profession_code"),
    admin
      .from("compliance_activity_categories")
      .select("country_code")
  ]);

  const allRules = rules ?? [];
  const catCounts: Record<string, number> = {};
  (categories ?? []).forEach((c) => {
    catCounts[c.country_code] = (catCounts[c.country_code] ?? 0) + 1;
  });

  // Group by country
  const byCountry = new Map<string, typeof allRules>();
  allRules.forEach((r) => {
    if (!byCountry.has(r.country_code)) byCountry.set(r.country_code, []);
    byCountry.get(r.country_code)!.push(r);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Country Rules Engine</h1>
          <p className="text-sm text-[#64748b] mt-1">
            CME/CPD compliance rules per country and profession. Changes take effect immediately.
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...byCountry.entries()].map(([countryCode, countryRules]) => {
          const defaultRule = countryRules.find((r) => r.profession_code === "all") ?? countryRules[0];
          const isActive = !defaultRule.effective_to || new Date(defaultRule.effective_to) > new Date();

          return (
            <Link
              key={countryCode}
              href={`/admin/country-rules/${encodeURIComponent(countryCode)}`}
              className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-md hover:border-[#1a56a0]/30 transition-all block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{FLAG[countryCode] ?? "🌐"}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#111]">
                      {COUNTRY_NAMES[countryCode] ?? countryCode}
                    </p>
                    <p className="text-xs text-[#64748b]">{countryCode}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isActive ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                  {isActive ? "Active" : "Expired"}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">Credits required</span>
                  <span className="font-semibold text-[#111]">
                    {defaultRule.total_credits_required} {defaultRule.credit_terminology}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">Renewal cycle</span>
                  <span className="font-semibold text-[#111]">{defaultRule.cycle_years} year{defaultRule.cycle_years !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">Online max</span>
                  <span className="font-semibold text-[#111]">{defaultRule.online_credits_max_pct}%</span>
                </div>
                {defaultRule.mandatory_credits_min > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748b]">Mandatory min</span>
                    <span className="font-semibold text-[#d97706]">{defaultRule.mandatory_credits_min} credits</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#94a3b8]">
                <span>{countryRules.length} rule{countryRules.length !== 1 ? "s" : ""}</span>
                <span>{catCounts[countryCode] ?? 0} categories</span>
              </div>
            </Link>
          );
        })}
      </div>

      {byCountry.size === 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-sm text-[#64748b]">No country rules configured yet. Run the SQL migrations first.</p>
        </div>
      )}
    </div>
  );
}
