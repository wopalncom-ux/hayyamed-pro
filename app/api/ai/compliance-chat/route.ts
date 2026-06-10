import { NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const rl = await checkAndLogRateLimit({ action: "ai_compliance_chat", userId: user.id, maxPerHour: 30 });
  if (!rl.allowed) return new Response("Rate limit exceeded", { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const body = await req.json();
  const messages: { role: "user" | "assistant"; content: string }[] =
    body.messages ?? [];

  if (!messages.length) return new Response("No messages", { status: 400 });

  const admin = createAdminClient();

  const [walletRes, activitiesRes] = await Promise.all([
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).maybeSingle(),
    admin
      .from("cme_activities")
      .select("title, provider, activity_date, credits, category, verification_status")
      .eq("professional_id", user.id)
      .order("activity_date", { ascending: false })
      .limit(20),
  ]);

  const wallet = walletRes.data;
  const activities = activitiesRes.data ?? [];

  let categoryBreakdown = "";
  let mainRule = "";

  if (wallet?.country) {
    const [catRes, ruleRes] = await Promise.all([
      admin
        .from("compliance_activity_categories")
        .select(
          "category_name, max_credits_per_cycle, min_credits_per_cycle, accreditation_required, notes"
        )
        .eq("country_code", wallet.country),
      admin
        .from("country_compliance_rules")
        .select(
          "total_credits_required, credit_terminology, online_credits_max_pct, mandatory_credits_min, cycle_years"
        )
        .eq("country_code", wallet.country)
        .maybeSingle(),
    ]);

    if (ruleRes.data) {
      const r = ruleRes.data;
      mainRule = `${r.total_credits_required} ${r.credit_terminology} per ${r.cycle_years}-year cycle | Online max ${r.online_credits_max_pct}% | Mandatory min ${r.mandatory_credits_min}`;
    }

    if (catRes.data?.length) {
      const valid = activities.filter((a) => a.verification_status !== "rejected");
      const byCategory: Record<string, number> = {};
      for (const a of valid) {
        if (a.category) byCategory[a.category] = (byCategory[a.category] ?? 0) + a.credits;
      }

      categoryBreakdown = catRes.data
        .map((cat) => {
          const earned = byCategory[cat.category_name] ?? 0;
          const cap = cat.max_credits_per_cycle;
          const min = cat.min_credits_per_cycle;
          let line = `• ${cat.category_name}: ${earned}${cap ? `/${cap}` : ""} credits`;
          if (min > 0) line += ` (min ${min} required)`;
          if (cap && earned > cap) line += " ⚠ OVERCAPPED";
          if (min > 0 && earned < min) line += " ⚠ MINIMUM NOT MET";
          if (cat.accreditation_required) line += " [accreditation required]";
          return line;
        })
        .join("\n");
    }
  }

  const cycleEnd = wallet?.cycle_end_date ? new Date(wallet.cycle_end_date) : null;
  const daysLeft = cycleEnd
    ? Math.ceil((cycleEnd.getTime() - Date.now()) / 86400000)
    : null;

  const systemPrompt = wallet
    ? `You are a CME compliance advisor embedded in Hayya Med Pro, a GCC healthcare professional platform. Answer the professional's questions about their CME compliance accurately and concisely. Use their exact data below.

PROFESSIONAL CME STATUS:
Country/Authority: ${wallet.country}
Profession: ${wallet.profession}${wallet.specialty ? ` — ${wallet.specialty}` : ""}
Renewal cycle: ${wallet.cycle_start_date} → ${wallet.cycle_end_date}${daysLeft !== null ? ` (${daysLeft} days left)` : ""}
Status: ${wallet.compliance_status}

CREDITS:
Required: ${wallet.required_credits}
Completed: ${wallet.completed_credits}
Remaining: ${Math.max(0, wallet.required_credits - wallet.completed_credits)}
${mainRule ? `Rule: ${mainRule}` : ""}

CATEGORY BREAKDOWN:
${categoryBreakdown || "No category data available."}

RECENT ACTIVITIES (newest first):
${
  activities.length
    ? activities
        .slice(0, 10)
        .map(
          (a) =>
            `• ${a.activity_date}: "${a.title}"${a.category ? ` [${a.category}]` : " [no category]"} — ${a.credits} credits (${a.verification_status})`
        )
        .join("\n")
    : "No activities logged yet."
}

GUIDELINES:
- Be specific and use the actual numbers above
- If they ask about a rule you're unsure of, say so and refer them to their regulatory body
- Keep answers brief unless complexity demands detail
- Always end with a disclaimer if giving regulatory advice: "Verify final requirements with ${wallet.country === "QA" ? "QCHP" : wallet.country === "SA" ? "SCFHS" : wallet.country === "AE-DU" ? "DHA" : "your regulatory authority"} directly."
- You may suggest they log missing activities or update uncategorized ones`
    : `You are a CME compliance advisor. This professional hasn't set up their CME wallet yet. Encourage them to complete their profile setup at /onboarding/5 to unlock CME tracking and personalized compliance guidance.`;

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const claude = getAnthropicClient();
        const stream = claude.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.slice(-10),
        });

        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\n[I ran into an error — please try again.]")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
