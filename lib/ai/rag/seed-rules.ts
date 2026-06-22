/**
 * Seeds the knowledge_chunks table from country_compliance_rules
 * and compliance_activity_categories in the database.
 * Run via POST /api/admin/ai/sync-knowledge (master_admin only).
 */

import { getTextEmbedding } from "@/lib/ai/embeddings";
import { createAdminClient } from "@/lib/supabase/server";

type SeedResult = {
  inserted: number;
  skipped: number;
  errors: string[];
};

export async function seedComplianceRules(): Promise<SeedResult> {
  const admin = createAdminClient();
  const result: SeedResult = { inserted: 0, skipped: 0, errors: [] };

  // Fetch all country rules + category caps
  const [rulesRes, catsRes] = await Promise.all([
    admin
      .from("country_compliance_rules")
      .select("country_code, country_name, profession, total_credits_required, credit_terminology, cycle_years, online_credits_max_pct, mandatory_credits_min, notes"),
    admin
      .from("compliance_activity_categories")
      .select("country_code, category_name, max_credits_per_cycle, min_credits_per_cycle, accreditation_required, notes"),
  ]);

  if (rulesRes.error) result.errors.push(`Rules fetch: ${rulesRes.error.message}`);
  if (catsRes.error)  result.errors.push(`Categories fetch: ${catsRes.error.message}`);

  const rules = rulesRes.data ?? [];
  const cats  = catsRes.data ?? [];

  // Clear existing auto-generated chunks (keep manually authored FAQ chunks)
  await admin
    .from("knowledge_chunks")
    .delete()
    .in("source_type", ["compliance_rule", "category_cap"]);

  // Embed and insert country compliance rules
  for (const rule of rules) {
    const title = `${rule.country_name} (${rule.country_code}) CME/CPD Requirements${rule.profession ? ` — ${rule.profession}` : ""}`;
    const content = [
      `Country: ${rule.country_name} (${rule.country_code})`,
      `Required: ${rule.total_credits_required} ${rule.credit_terminology} per ${rule.cycle_years}-year renewal cycle`,
      `Online CME maximum: ${rule.online_credits_max_pct}% of total credits`,
      `Mandatory credits minimum: ${rule.mandatory_credits_min}`,
      rule.notes ? `Notes: ${rule.notes}` : null,
    ].filter(Boolean).join("\n");

    try {
      const embedding = await getTextEmbedding(`${title}\n${content}`);
      await admin.from("knowledge_chunks").insert({
        source_type: "compliance_rule",
        source_id: `${rule.country_code}${rule.profession ? `_${rule.profession}` : ""}`,
        country_code: rule.country_code,
        profession: rule.profession ?? null,
        title,
        content,
        embedding,
        metadata: { country_name: rule.country_name, credit_terminology: rule.credit_terminology },
      });
      result.inserted++;
    } catch (err) {
      result.errors.push(`Rule ${rule.country_code}: ${err instanceof Error ? err.message : "unknown"}`);
      result.skipped++;
    }

    // Avoid rate limits on embedding API
    await new Promise((r) => setTimeout(r, 100));
  }

  // Embed and insert category caps
  for (const cat of cats) {
    const title = `${cat.country_code} — ${cat.category_name} Category Cap`;
    const content = [
      `Category: ${cat.category_name}`,
      cat.max_credits_per_cycle ? `Maximum credits per cycle: ${cat.max_credits_per_cycle}` : "No maximum cap",
      cat.min_credits_per_cycle > 0 ? `Minimum required: ${cat.min_credits_per_cycle} credits` : null,
      cat.accreditation_required ? "Accreditation required for credits to count" : null,
      cat.notes ? `Notes: ${cat.notes}` : null,
    ].filter(Boolean).join("\n");

    try {
      const embedding = await getTextEmbedding(`${title}\n${content}`);
      await admin.from("knowledge_chunks").insert({
        source_type: "category_cap",
        source_id: `${cat.country_code}_${cat.category_name}`,
        country_code: cat.country_code,
        title,
        content,
        embedding,
        metadata: { category_name: cat.category_name },
      });
      result.inserted++;
    } catch (err) {
      result.errors.push(`Cat ${cat.country_code}/${cat.category_name}: ${err instanceof Error ? err.message : "unknown"}`);
      result.skipped++;
    }

    await new Promise((r) => setTimeout(r, 100));
  }

  return result;
}
