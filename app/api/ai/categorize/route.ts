import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkAndLogRateLimit({ action: "ai_categorize", userId: user.id, maxPerHour: 100 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const body = await req.json();
  const { title, provider, credits, countryCode } = body as {
    title: string;
    provider?: string;
    credits?: number;
    countryCode?: string;
  };

  if (!title?.trim() || title.trim().length < 3) {
    return NextResponse.json({ error: "Title too short" }, { status: 400 });
  }

  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 256,
      system: `You are a CME (Continuing Medical Education) classification expert for GCC healthcare professionals. Classify activities into the correct category. Respond ONLY with valid JSON matching this exact schema with no other text:
{"category":"<category>","confidence":"high|medium|low","creditSuggestion":<number or null>,"notes":"<one sentence>"}

Valid categories: conference, online, workshop, journal, teaching, simulation, mandatory, patient_safety, other`,
      messages: [
        {
          role: "user",
          content: `Classify this CME activity:
Title: "${title.trim()}"${provider ? `\nProvider: "${provider}"` : ""}${credits ? `\nCredits entered: ${credits}` : ""}
Country: ${countryCode || "QA"}

- conference: in-person conferences, seminars, symposia, grand rounds
- online: webinars, e-learning, online courses, distance learning
- workshop: hands-on practical workshops, procedural training
- journal: journal reading, self-assessment programs (SAP)
- teaching: teaching, lecturing, supervising trainees
- simulation: simulation labs, OSCE, skill station training
- mandatory: mandatory structured credits (Saudi Arabia SCFHS)
- patient_safety: patient safety modules (DHA Dubai)
- other: anything else

Set creditSuggestion to null if entered credits seem reasonable, or suggest a better value if clearly wrong.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No AI response" }, { status: 500 });
    }

    const result = JSON.parse(textBlock.text.trim());
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Categorization failed" }, { status: 500 });
  }
}
