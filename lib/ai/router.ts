/**
 * AI provider router — picks the right model for each task type.
 * Claude via Vertex AI (authenticated via GCP service account, no API key required).
 * Gemini via Vertex AI (same auth, zero extra config).
 */

export type AiTask =
  | "chat"          // Haiku: fast, cheap chatbot
  | "gap_analysis"  // Sonnet: reasoning quality needed
  | "ocr"           // Sonnet: multimodal
  | "classify"      // Haiku: simple classification
  | "forecast"      // Opus: complex long-context reasoning
  | "draft"         // Haiku: email/broadcast drafts
  | "employer"      // Sonnet: multi-table analysis
  | "government";   // Sonnet: complex analytics

export type AiProvider = "claude-haiku" | "claude-sonnet" | "claude-opus" | "gemini-flash";

// Cost policy: every task routes to low-cost Gemini Flash (Vertex AI).
// To move a task back to Claude, change its value to "claude-haiku" |
// "claude-sonnet" | "claude-opus" — that single line is the whole switch.
const TASK_ROUTING: Record<AiTask, AiProvider> = {
  chat:        "gemini-flash",
  classify:    "gemini-flash",
  draft:       "gemini-flash",
  gap_analysis: "gemini-flash",
  ocr:         "gemini-flash",
  employer:    "gemini-flash",
  government:  "gemini-flash",
  forecast:    "gemini-flash",
};

export const MODEL_IDS: Record<AiProvider, string> = {
  "claude-haiku":  "claude-haiku-4-5-20251001",
  "claude-sonnet": "claude-sonnet-4-6",
  "claude-opus":   "claude-opus-4-8",
  "gemini-flash":  "gemini-2.0-flash-001",
};

export function routeTask(task: AiTask): { provider: AiProvider; modelId: string } {
  const provider = TASK_ROUTING[task];
  return { provider, modelId: MODEL_IDS[provider] };
}

// Cost estimates per million tokens (USD) — used by logAiCall
export const PROVIDER_COSTS: Record<AiProvider, { input: number; output: number }> = {
  "claude-haiku":  { input: 0.80,  output: 4.00  },
  "claude-sonnet": { input: 3.00,  output: 15.00 },
  "claude-opus":   { input: 15.00, output: 75.00 },
  "gemini-flash":  { input: 0.075, output: 0.30  }, // ~10× cheaper than Haiku
};
