import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { toCountryCode } from "@/lib/countryCode";
import { getUserPlan, isPro } from "@/lib/subscription";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { buildComplianceChatSystem } from "@/lib/ai/prompts/compliance-chat";
import { HAYYA_TOOLS, type ToolName } from "@/lib/ai/tools/index";
import { executeToolCall } from "@/lib/ai/tools/handlers";
import type { MessageParam, ToolResultBlockParam } from "@anthropic-ai/sdk/resources";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return new Response("Unauthorized", { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return new Response("Pro plan required", { status: 403 });
  if (!await isFeatureEnabled("ai_compliance_chat", plan)) return new Response("Feature unavailable", { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai_compliance_chat", userId: user.id, maxPerHour: 30 });
  if (!rl.allowed) return new Response("Rate limit exceeded", { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const body = await req.json();
  const messages: ChatMessage[] = body.messages ?? [];
  if (!messages.length) return new Response("No messages", { status: 400 });

  const admin = createAdminClient();

  const [walletRes, activitiesRes] = await Promise.all([
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
    admin
      .from("cme_activities")
      .select("title, provider, activity_date, credits, category, verification_status")
      .eq("professional_id", user.id)
      .order("activity_date", { ascending: false })
      .limit(20),
  ]);

  const wallet = walletRes.data;
  const activities = activitiesRes.data ?? [];
  const countryCode = wallet?.country ? toCountryCode(wallet.country) : "";
  let categoryBreakdown = "";
  let mainRule = "";

  if (wallet?.country) {
    const [catRes, ruleRes] = await Promise.all([
      admin
        .from("compliance_activity_categories")
        .select("category_name, max_credits_per_cycle, min_credits_per_cycle, accreditation_required")
        .eq("country_code", countryCode),
      admin
        .from("country_compliance_rules")
        .select("total_credits_required, credit_terminology, online_credits_max_pct, mandatory_credits_min, cycle_years")
        .eq("country_code", countryCode)
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
          let line = `• ${cat.category_name}: ${earned}${cat.max_credits_per_cycle ? `/${cat.max_credits_per_cycle}` : ""} credits`;
          if (cat.min_credits_per_cycle > 0 && earned < cat.min_credits_per_cycle) line += " ⚠ MINIMUM NOT MET";
          if (cat.max_credits_per_cycle && earned > cat.max_credits_per_cycle) line += " ⚠ OVERCAPPED";
          return line;
        })
        .join("\n");
    }
  }

  const daysLeft = wallet?.cycle_end_date
    ? Math.ceil((new Date(wallet.cycle_end_date).getTime() - Date.now()) / 86400000)
    : null;

  const systemPrompt = buildComplianceChatSystem(
    wallet
      ? { country: wallet.country, profession: wallet.profession, specialty: wallet.specialty ?? null, cycle_start_date: wallet.cycle_start_date, cycle_end_date: wallet.cycle_end_date, compliance_status: wallet.compliance_status, required_credits: wallet.required_credits, completed_credits: wallet.completed_credits, mainRule, categoryBreakdown, daysLeft, countryCode, recentActivities: activities }
      : null
  );

  const startTime = Date.now();
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const claude = getAnthropicClient();

        // Agentic loop: up to 2 rounds of tool use before streaming final answer
        let conversationMessages: MessageParam[] = messages
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        let toolRounds = 0;
        const MAX_TOOL_ROUNDS = 2;

        while (toolRounds < MAX_TOOL_ROUNDS) {
          const toolResponse = await claude.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            system: systemPrompt,
            messages: conversationMessages,
            tools: HAYYA_TOOLS,
            tool_choice: { type: "auto" },
          });

          // If no tool calls, break and stream from here
          const toolUseBlocks = toolResponse.content.filter((b) => b.type === "tool_use");
          if (!toolUseBlocks.length) break;

          // Add assistant tool-use message to conversation
          conversationMessages = [
            ...conversationMessages,
            { role: "assistant", content: toolResponse.content },
          ];

          // Execute all tool calls in parallel
          const toolResults = await Promise.all(
            toolUseBlocks.map(async (block) => {
              if (block.type !== "tool_use") return null;
              const result = await executeToolCall(
                block.name as ToolName,
                block.input as Record<string, unknown>,
                user.id,
              );
              return {
                type: "tool_result" as const,
                tool_use_id: block.id,
                content: result,
              };
            })
          );

          // Add tool results to conversation
          conversationMessages = [
            ...conversationMessages,
            { role: "user", content: toolResults.filter(Boolean) as ToolResultBlockParam[] },
          ];

          toolRounds++;
        }

        // Stream the final response
        const stream = claude.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: systemPrompt,
          messages: conversationMessages,
        });

        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }

        stream.finalMessage().then((finalMsg) => {
          const latencyMs = Date.now() - startTime;
          logAudit({ actorAuthId: user.id, action: "ai.compliance_chat", targetTable: "audit_logs", metadata: { model: "claude-haiku-4-5-20251001", input_tokens: finalMsg.usage?.input_tokens ?? 0, output_tokens: finalMsg.usage?.output_tokens ?? 0, latency_ms: latencyMs } }).catch(() => {});
          logAiCall({ professionalId: user.id, action: "ai.compliance_chat", model: "claude-haiku-4-5-20251001", inputTokens: finalMsg.usage?.input_tokens ?? 0, outputTokens: finalMsg.usage?.output_tokens ?? 0, latencyMs }).catch(() => {});
        }).catch(() => {});

      } catch {
        controller.enqueue(encoder.encode("\n\n[I ran into an error — please try again.]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
