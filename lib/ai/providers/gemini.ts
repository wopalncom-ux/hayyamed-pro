import { VertexAI } from "@google-cloud/vertexai";

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
