import "server-only";
import { VertexAI } from "@google-cloud/vertexai";
import { routeTask, type AiTask } from "./router";

// ════════════════════════════════════════════════════════════════════════════
// Unified single-shot AI completion — the ONE place tasks are dispatched.
// Gemini via Google Vertex AI (GCP service-account auth). Claude/Anthropic was
// removed from the app runtime entirely on 2026-07-04 — every AI task now runs
// on Gemini Flash Lite.
//
// Streaming + tool-calling routes (compliance-chat) are handled in-route, not here.
// ════════════════════════════════════════════════════════════════════════════

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT ?? "project-38d955b0-84e7-44b6-8b5";
const REGION = process.env.VERTEX_REGION ?? "us-east5";

let _vertex: VertexAI | null = null;
function vertex(): VertexAI {
  if (!_vertex) _vertex = new VertexAI({ project: PROJECT, location: REGION });
  return _vertex;
}

export type AiImage = { mediaType: string; data: string }; // base64
export type AiMessage = { role: "user" | "assistant"; content: string };

export type AiCompleteInput = {
  task: AiTask;
  /** System prompt. Optional — some prompts are fully self-contained in the user message. */
  system?: string;
  messages: AiMessage[];
  maxTokens?: number;
  /** Ask for strict JSON output (Gemini uses responseMimeType; harmless for Claude). */
  json?: boolean;
  /** Optional images for a vision task (attached to the first user message). */
  images?: AiImage[];
};

export type AiCompleteResult = {
  text: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
};

export async function aiComplete(input: AiCompleteInput): Promise<AiCompleteResult> {
  const { task, system = "", messages, maxTokens = 1024, json = false, images = [] } = input;
  const { provider, modelId } = routeTask(task);
  return geminiComplete(modelId, provider, system, messages, maxTokens, json, images);
}

// ── Gemini (Vertex) ──────────────────────────────────────────────────────────
async function geminiComplete(
  model: string, provider: string, system: string, messages: AiMessage[],
  maxTokens: number, json: boolean, images: AiImage[],
): Promise<AiCompleteResult> {
  const gm = vertex().getGenerativeModel({ model });
  const contents = messages.map((m, i) => {
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: m.content }];
    // attach images to the first user message
    if (i === 0 && m.role === "user" && images.length) {
      for (const img of images) parts.push({ inlineData: { mimeType: img.mediaType, data: img.data } });
    }
    return { role: m.role === "assistant" ? "model" : "user", parts };
  });

  let result: Awaited<ReturnType<typeof gm.generateContent>>;
  try {
    result = await gm.generateContent({
      ...(system ? { systemInstruction: { role: "system", parts: [{ text: system }] } } : {}),
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        ...(json ? { responseMimeType: "application/json" } : {}),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/GoogleAuth|Unable to authenticate|Application Default|credential|service.?account/i.test(msg)) {
      throw new Error("AI features require GCP credentials and are available on the live platform (hayyamed.pro).");
    }
    throw err;
  }

  const resp = result.response;
  const text = resp.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  const um = resp.usageMetadata;
  return {
    text,
    provider,
    model,
    inputTokens: um?.promptTokenCount ?? 0,
    outputTokens: um?.candidatesTokenCount ?? 0,
  };
}

/** Convenience: current model id for a task (for logging/UI). */
export function modelForTask(task: AiTask): string {
  return routeTask(task).modelId;
}
