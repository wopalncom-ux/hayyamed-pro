import { createAdminClient } from "@/lib/supabase/server";
import { MODEL_IDS, PROVIDER_COSTS, type AiProvider } from "./router";

// Per-million-token pricing (USD), derived from router.ts (the single source
// of truth for provider→model→cost) so this never drifts out of sync again —
// it previously fell back to Sonnet pricing for every Gemini call, a ~40×
// cost overestimate in ai_call_logs since the 2026-07-01 Gemini switch.
const MODEL_COSTS: Record<string, { input: number; output: number }> = Object.fromEntries(
  (Object.keys(MODEL_IDS) as AiProvider[]).map((provider) => [MODEL_IDS[provider], PROVIDER_COSTS[provider]])
);
// A couple of prior model-id strings seen in historical logs, for accurate re-estimation only.
MODEL_COSTS["gemini-2.0-flash-lite"] = PROVIDER_COSTS["gemini-flash"];
MODEL_COSTS["gemini-2.0-flash-001"] = { input: 0.10, output: 0.40 };

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_COSTS[model] ?? PROVIDER_COSTS["gemini-flash"];
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}

type AiCallEntry = {
  professionalId: string;
  action: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
  promptVersion?: string;
  success?: boolean;
  errorMessage?: string;
};

/**
 * Fire-and-forget AI call log.
 * Records cost, tokens, and latency for every AI call — FinOps + SOC 2 audit trail.
 * Never throws — must never break the main request flow.
 */
export async function logAiCall({
  professionalId,
  action,
  model,
  inputTokens = 0,
  outputTokens = 0,
  latencyMs,
  promptVersion,
  success = true,
  errorMessage,
}: AiCallEntry): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("ai_call_logs").insert({
      professional_id: professionalId,
      action,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latency_ms: latencyMs ?? null,
      cost_usd: estimateCost(model, inputTokens, outputTokens),
      prompt_version: promptVersion ?? null,
      success,
      error_message: errorMessage ?? null,
    });
  } catch {
    // Intentionally swallowed — logging must never break the main request
  }
}
