import { VertexAI, type Content, type FunctionDeclaration } from "@google-cloud/vertexai";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT ?? "project-38d955b0-84e7-44b6-8b5";
const REGION  = process.env.VERTEX_REGION ?? "us-east5";

export type GeminiMessage = { role: "user" | "model"; parts: { text: string }[] };

let _vertex: VertexAI | null = null;
function getVertex(): VertexAI {
  if (!_vertex) _vertex = new VertexAI({ project: PROJECT, location: REGION });
  return _vertex;
}

export async function geminiChat(
  model: string,
  system: string,
  messages: GeminiMessage[],
  maxTokens = 1024,
): Promise<string> {
  const vertex = getVertex();
  const gm = vertex.getGenerativeModel({ model });
  const result = await gm.generateContent({
    systemInstruction: { role: "system", parts: [{ text: system }] },
    contents: messages,
    generationConfig: { maxOutputTokens: maxTokens },
  });
  return result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function* geminiStream(
  model: string,
  system: string,
  messages: GeminiMessage[],
  maxTokens = 1024,
): AsyncGenerator<string> {
  const vertex = getVertex();
  const gm = vertex.getGenerativeModel({ model });
  const stream = await gm.generateContentStream({
    systemInstruction: { role: "system", parts: [{ text: system }] },
    contents: messages,
    generationConfig: { maxOutputTokens: maxTokens },
  });
  for await (const chunk of stream.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) yield text;
  }
}

// ── Agentic tool-use (function calling) — used by compliance-chat ───────────
// Same Content[] shape as GeminiMessage but also allows functionCall /
// functionResponse parts, since a tool round has to feed the model's own
// function-call turn and our tool results back into the next turn.

export type GeminiFunctionCall = { name: string; args: Record<string, unknown> };

/** One non-streaming turn with tools attached. Returns any function calls the
 * model wants to make, plus its raw content (needed to replay into history). */
export async function geminiStep(
  model: string,
  system: string,
  contents: Content[],
  tools: FunctionDeclaration[],
  maxTokens = 1024,
): Promise<{ functionCalls: GeminiFunctionCall[]; content: Content | null }> {
  const vertex = getVertex();
  const gm = vertex.getGenerativeModel({
    model,
    tools: tools.length ? [{ functionDeclarations: tools }] : undefined,
  });
  const result = await gm.generateContent({
    systemInstruction: { role: "system", parts: [{ text: system }] },
    contents,
    generationConfig: { maxOutputTokens: maxTokens },
  });
  const content = result.response.candidates?.[0]?.content ?? null;
  const functionCalls: GeminiFunctionCall[] = (content?.parts ?? [])
    .filter((p) => !!p.functionCall)
    .map((p) => ({ name: p.functionCall!.name, args: (p.functionCall!.args ?? {}) as Record<string, unknown> }));
  return { functionCalls, content };
}

/** Same as geminiStream but takes full Content[] (post tool-loop history may
 * include functionCall/functionResponse parts, not just plain text turns). */
export async function* geminiStreamContents(
  model: string,
  system: string,
  contents: Content[],
  maxTokens = 1024,
): AsyncGenerator<string> {
  const vertex = getVertex();
  const gm = vertex.getGenerativeModel({ model });
  const stream = await gm.generateContentStream({
    systemInstruction: { role: "system", parts: [{ text: system }] },
    contents,
    generationConfig: { maxOutputTokens: maxTokens },
  });
  for await (const chunk of stream.stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) yield text;
  }
}
