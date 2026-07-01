import "server-only";
import { VertexAI } from "@google-cloud/vertexai";
import { getAnthropicClient } from "@/lib/anthropic";
import { routeTask, MODEL_IDS, type AiTask } from "./router";

// ════════════════════════════════════════════════════════════════════════════
// Unified single-shot AI completion — the ONE place tasks are dispatched to a
// provider. Which model each task uses is decided by the routing table in
// router.ts, so switching a task between Claude and Gemini is a one-line change
// there. Everything runs on Google Vertex AI (same GCP service-account auth).
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

  if (provider.startsWith("gemini")) {
    return geminiComplete(modelId, provider, system, messages, maxTokens, json, images);
  }
  return claudeComplete(modelId, provider, system, messages, maxTokens, images);
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

  const result = await gm.generateContent({
    ...(system ? { systemInstruction: { role: "system", parts: [{ text: system }] } } : {}),
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      ...(json ? { responseMimeType: "application/json" } : {}),
    },
  });

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

// ── Claude (Vertex) — kept so any task can be flipped back in router.ts ────────
async function claudeComplete(
  model: string, provider: string, system: string, messages: AiMessage[],
  maxTokens: number, images: AiImage[],
): Promise<AiCompleteResult> {
  const client = getAnthropicClient();
  type Block = { type: "text"; text: string } | { type: "image"; source: { type: "base64"; media_type: string; data: string } };
  const msgs = messages.map((m, i) => {
    if (i === 0 && m.role === "user" && images.length) {
      const content: Block[] = [{ type: "text", text: m.content }];
      for (const img of images) content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } });
      return { role: m.role, content };
    }
    return { role: m.role, content: m.content };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resp = await client.messages.create({ model, max_tokens: maxTokens, ...(system ? { system } : {}), messages: msgs as any });
  const block = resp.content.find((b) => b.type === "text");
  const text = block && block.type === "text" ? block.text : "";
  return {
    text,
    provider,
    model,
    inputTokens: resp.usage?.input_tokens ?? 0,
    outputTokens: resp.usage?.output_tokens ?? 0,
  };
}

/** Convenience: current model id for a task (for logging/UI). */
export function modelForTask(task: AiTask): string {
  return MODEL_IDS[routeTask(task).provider];
}
