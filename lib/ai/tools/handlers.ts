import { createAdminClient } from "@/lib/supabase/server";
import type { ToolName } from "./index";
export type { ToolName };

type ToolInput = Record<string, unknown>;

export async function executeToolCall(
  toolName: ToolName,
  input: ToolInput,
  professionalId: string,
): Promise<string> {
  const admin = createAdminClient();

  try {
    switch (toolName) {
      case "lookup_compliance_rules": {
        const countryCode = input.country_code as string;
        const [ruleRes, catRes] = await Promise.all([
          admin
            .from("country_compliance_rules")
            .select("country_name, total_credits_required, credit_terminology, cycle_years, online_credits_max_pct, mandatory_credits_min")
            .eq("country_code", countryCode)
            .maybeSingle(),
          admin
            .from("compliance_activity_categories")
            .select("category_name, max_credits_per_cycle, min_credits_per_cycle, accreditation_required, notes")
            .eq("country_code", countryCode)
            .limit(20),
        ]);

        if (!ruleRes.data) return `No compliance rules found for country code: ${countryCode}`;

        const r = ruleRes.data;
        let result = `${r.country_name} (${countryCode}) — Official CME Rules:\n`;
        result += `• ${r.total_credits_required} ${r.credit_terminology} required per ${r.cycle_years}-year cycle\n`;
        result += `• Online CME maximum: ${r.online_credits_max_pct}%\n`;
        result += `• Mandatory credits minimum: ${r.mandatory_credits_min}\n`;

        if (catRes.data?.length) {
          result += `\nCategory caps:\n`;
          for (const c of catRes.data) {
            result += `• ${c.category_name}`;
            if (c.max_credits_per_cycle) result += ` — max ${c.max_credits_per_cycle}`;
            if (c.min_credits_per_cycle > 0) result += `, min ${c.min_credits_per_cycle}`;
            if (c.accreditation_required) result += ` [accreditation required]`;
            result += "\n";
          }
        }
        return result;
      }

      case "calculate_credit_gap": {
        const [walletRes, activitiesRes, catRulesRes] = await Promise.all([
          admin.from("cme_wallets").select("*").eq("professional_id", professionalId).maybeSingle(),
          admin
            .from("cme_activities")
            .select("title, credits, category, verification_status, activity_date")
            .eq("professional_id", professionalId)
            .neq("verification_status", "rejected")
            .order("activity_date", { ascending: false }),
          admin.from("cme_wallets").select("country").eq("professional_id", professionalId).maybeSingle(),
        ]);

        const wallet = walletRes.data;
        if (!wallet) return "CME wallet not set up yet. Please complete onboarding step 5 at /onboarding/5.";

        const activities = activitiesRes.data ?? [];
        const totalEarned = wallet.completed_credits;
        const required = wallet.required_credits;
        const gap = Math.max(0, required - totalEarned);

        const byCategory: Record<string, number> = {};
        for (const a of activities) {
          if (a.category) byCategory[a.category] = (byCategory[a.category] ?? 0) + a.credits;
        }

        let result = `Credit Gap Analysis:\n`;
        result += `• Required: ${required} credits\n`;
        result += `• Completed: ${totalEarned} credits\n`;
        result += `• Gap: ${gap} credits ${gap === 0 ? "✅ COMPLETE" : "⚠ NEEDED"}\n`;
        result += `• Compliance status: ${wallet.compliance_status}\n`;

        if (wallet.cycle_end_date) {
          const daysLeft = Math.ceil((new Date(wallet.cycle_end_date).getTime() - Date.now()) / 86400000);
          result += `• Days until cycle ends: ${daysLeft}\n`;
        }

        if (Object.keys(byCategory).length > 0) {
          result += `\nEarned by category:\n`;
          for (const [cat, earned] of Object.entries(byCategory)) {
            result += `• ${cat}: ${earned} credits\n`;
          }
        }

        // Check for uncategorized activities
        const uncategorized = activities.filter((a) => !a.category).length;
        if (uncategorized > 0) {
          result += `\n⚠ ${uncategorized} activities have no category assigned — categorize them to ensure accurate compliance.`;
        }

        return result;
      }

      case "search_marketplace_courses": {
        let query = admin
          .from("courses")
          .select("id, title, credits, credit_type, delivery_mode, is_free, price_usd, category, training_providers(name, is_accredited)")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(5);

        if (input.category) query = query.eq("category", input.category as string);
        if (input.delivery_mode) query = query.eq("delivery_mode", input.delivery_mode as string);
        if (input.free_only === true) query = query.eq("is_free", true);

        const { data: courses } = await query;

        if (!courses?.length) {
          return "No courses found matching those criteria. Try browsing the full marketplace at /dashboard/marketplace.";
        }

        let result = `Found ${courses.length} course${courses.length !== 1 ? "s" : ""}:\n`;
        for (const c of courses) {
          const provider = Array.isArray(c.training_providers) ? c.training_providers[0] : c.training_providers;
          result += `\n• "${c.title}"`;
          if (provider?.name) result += ` by ${provider.name}`;
          result += `\n  ${c.credits} ${c.credit_type} | ${c.delivery_mode} | ${c.is_free ? "Free" : `$${c.price_usd}`}`;
          if (provider?.is_accredited) result += " | ✅ Accredited";
          result += `\n  View: /dashboard/marketplace/${c.id}`;
        }
        return result;
      }

      case "check_license_status": {
        const { data: profile } = await admin
          .from("professional_profiles")
          .select("license_number, license_country, license_expiry_date, profession, specialty")
          .eq("auth_id", professionalId)
          .maybeSingle();

        if (!profile) return "Profile not found.";
        if (!profile.license_number) return "No license on file. Add your license at /dashboard/licenses.";

        let result = `License Status:\n`;
        result += `• License number: ${profile.license_number}\n`;
        result += `• Country: ${profile.license_country ?? "Not set"}\n`;
        result += `• Profession: ${profile.profession ?? "Not set"}\n`;

        if (profile.license_expiry_date) {
          const expiry = new Date(profile.license_expiry_date);
          const daysToExpiry = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
          result += `• Expiry: ${expiry.toLocaleDateString()} (${daysToExpiry > 0 ? `${daysToExpiry} days remaining` : "EXPIRED"})`;
          if (daysToExpiry <= 90 && daysToExpiry > 0) result += " ⚠ Renewal recommended";
          if (daysToExpiry <= 0) result += " 🔴 Action required";
        } else {
          result += `• Expiry: Not set — add at /dashboard/licenses`;
        }

        return result;
      }

      case "log_cme_activity": {
        const title = input.title as string;
        const credits = input.credits as number;
        const activityDate = input.activity_date as string;
        const category = input.category as string | undefined;
        const provider = input.provider as string | undefined;

        if (!title || !credits || !activityDate) {
          return "Missing required fields: title, credits, activity_date.";
        }

        const { error } = await admin.from("cme_activities").insert({
          professional_id: professionalId,
          title,
          credits,
          activity_date: activityDate,
          category: category ?? null,
          provider: provider ?? null,
          verification_status: "pending",
          source: "ai_chat",
        });

        if (error) return `Failed to log activity: ${error.message}`;
        return `✅ Activity logged successfully: "${title}" — ${credits} credits on ${activityDate}. Status: pending verification. View at /dashboard/cme.`;
      }

      default:
        return "Unknown tool.";
    }
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : "Unknown error"}`;
  }
}
