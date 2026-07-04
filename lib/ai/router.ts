/**
 * AI provider router — picks the right model for each task type.
 * Gemini via Vertex AI (authenticated via GCP service account, no API key required).
 * Claude/Anthropic is not used anywhere in the app runtime (removed 2026-07-04).
 */

export type AiTask =
  | "chat"          // fast, cheap chatbot
  | "gap_analysis"  // reasoning quality needed
  | "ocr"           // multimodal
  | "classify"      // simple classification
  | "forecast"      // complex long-context reasoning
  | "draft"         // email/broadcast drafts
  | "employer"      // multi-table analysis
  | "government";   // complex analytics

export type AiProvider = "gemini-flash";

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
  "gemini-flash":  "gemini-2.5-flash-lite",
};

export function routeTask(task: AiTask): { provider: AiProvider; modelId: string } {
  const provider = TASK_ROUTING[task];
  return { provider, modelId: MODEL_IDS[provider] };
}

// Cost estimates per million tokens (USD) — used by logAiCall
export const PROVIDER_COSTS: Record<AiProvider, { input: number; output: number }> = {
  "gemini-flash":  { input: 0.075, output: 0.30  },
};
