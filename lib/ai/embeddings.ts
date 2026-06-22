// v1 — Vertex AI text-embedding-004 embeddings (768 dimensions)
// Uses google-auth-library ADC: works in Cloud Run (metadata server)
// and locally when GOOGLE_APPLICATION_CREDENTIALS is set.

type AuthClient = { getAccessToken(): Promise<{ token: string | null }> };
let authClient: AuthClient | null = null;

async function getAuthToken(): Promise<string> {
  if (!authClient) {
    const { GoogleAuth } = await import("google-auth-library");
    const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
    authClient = (await auth.getClient()) as AuthClient;
  }
  const { token } = await authClient.getAccessToken();
  if (!token) throw new Error("No ADC token — check GOOGLE_APPLICATION_CREDENTIALS or Cloud Run IAM");
  return token;
}

export async function getTextEmbedding(text: string): Promise<number[]> {
  const projectId =
    process.env.GCP_PROJECT_ID ??
    process.env.GOOGLE_CLOUD_PROJECT ??
    "project-38d955b0-84e7-44b6-8b5";
  if (!projectId) throw new Error("No GCP project ID — set GCP_PROJECT_ID or GOOGLE_CLOUD_PROJECT");

  const location = "us-central1";
  const bearerToken = await getAuthToken();

  const res = await fetch(
    `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/text-embedding-004:predict`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ content: text.slice(0, 2048) }],
        parameters: { outputDimensionality: 768 },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Vertex AI embedding error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    predictions: Array<{ embeddings: { values: number[] } }>;
  };

  return data.predictions[0].embeddings.values;
}

export function buildCourseEmbeddingText(course: {
  title: string;
  description?: string | null;
  category: string;
  credits: number;
  professions: string[];
  country_codes: string[];
}): string {
  const parts = [
    `Course: ${course.title}`,
    course.description ? `Description: ${course.description}` : null,
    `Category: ${course.category}`,
    `CME Credits: ${course.credits}`,
    `For: ${course.professions.join(", ")}`,
    `Countries: ${course.country_codes.join(", ")}`,
  ].filter(Boolean);
  return parts.join(". ");
}
