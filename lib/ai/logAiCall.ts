import { createAdminClient } from "@/lib/supabase/server";

// Per-million-token pricing (USD). Update when Anthropic adjusts pricing.
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5-20251001": { input: 0.80,  output: 4.00  },
  "claude-haiku-4-5":          { input: 0.80,  output: 4.00  },
  "claude-sonnet-4-6":         { input: 3.00,  output: 15.00 },
  "claude-opus-4-8":           { input: 15.00, output: 75.00 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_COSTS[model] ?? { input: 3.00, output: 15.00 };
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
