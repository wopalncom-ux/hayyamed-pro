import AnthropicVertex from "@anthropic-ai/vertex-sdk";

export function getAnthropicClient(): AnthropicVertex {
  return new AnthropicVertex({
    projectId: process.env.GOOGLE_CLOUD_PROJECT ?? "project-38d955b0-84e7-44b6-8b5",
    region: process.env.VERTEX_REGION ?? "us-east5",
  });
}
