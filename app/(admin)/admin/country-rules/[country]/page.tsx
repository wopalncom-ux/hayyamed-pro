import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import CountryRuleForm from "@/components/admin/CountryRuleForm";
import CategoryRulesTable from "@/components/admin/CategoryRulesTable";
import AddProfessionRuleForm from "@/components/admin/AddProfessionRuleForm";

const COUNTRY_NAMES: Record<string, string> = {
  QA: "Qatar (QCHP)",
  SA: "Saudi Arabia (SCFHS)",
  "AE-DU": "UAE — Dubai (DHA)",
  "AE-AZ": "UAE — Abu Dhabi (DOH)",
  KW: "Kuwait (MOH)",
  BH: "Bahrain (NHRA)",
  OM: "Oman (OMSB)",
};

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const code = decodeURIComponent(country);
  return { title: `${COUNTRY_NAMES[code] ?? code} Rules — Admin` };
}

export default async function CountryRuleDetailPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const countryCode = decodeURIComponent(country);

  const admin = createAdminClient();

  const [{ data: rules }, { data: categories }, { data: authorities }] = await Promise.all([
    admin
      .from("country_compliance_rules")
      .select("*")
      .eq("country_code", countryCode)
      .order("profession_code"),
    admin
      .from("compliance_activity_categories")
      .select("*")
      .eq("country_code", countryCode)
      .order("category_name"),
    admin
      .from("licensing_authorities")
      .select("id, abbreviation, authority_name")
      .order("abbreviation"),
  ]);

  if (!rules || rules.length === 0) notFound();

  const allRules = rules;
  const allCategories = categories ?? [];
  const allAuthorities = authorities ?? [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/country-rules" className="text-sm text-[#64748b] hover:text-[#111]">
          ← Country Rules
        </Link>
        <span className="text-[#e2e8f0]">/</span>
        <span className="text-sm text-[#111] font-medium">
          {COUNTRY_NAMES[countryCode] ?? countryCode}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111]">
          {COUNTRY_NAMES[countryCode] ?? countryCode}
        </h1>
        <span className="text-xs font-mono bg-[#f1f5f9] text-[#374151] px-2.5 py-1.5 rounded-lg">
          {countryCode}
        </span>
      </div>

      {/* Compliance Rules */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#111]">Compliance Rules</h2>
          <p className="text-xs text-[#64748b]">{allRules.length} rule{allRules.length !== 1 ? "s" : ""}</p>
        </div>
        {allRules.map((rule) => (
          <CountryRuleForm key={rule.id} rule={rule} authorities={allAuthorities} />
        ))}
        <AddProfessionRuleForm countryCode={countryCode} />
      </div>

      {/* Activity Categories */}
      <div>
        <h2 className="text-base font-semibold text-[#111] mb-4">Activity Categories</h2>
        <CategoryRulesTable
          countryCode={countryCode}
          categories={allCategories}
          authorities={allAuthorities}
        />
      </div>
    </div>
  );
}
