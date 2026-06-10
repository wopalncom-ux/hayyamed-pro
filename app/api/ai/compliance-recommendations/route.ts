import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkAndLogRateLimit({ action: "ai_compliance_recommendations", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const body = await req.json();
  const { profession, specialty, country, totalRequired, totalCompleted, gaps, cycleEndDate } = body as {
    profession: string;
    specialty: string | null;
    country: string;
    totalRequired: number;
    totalCompleted: number;
    gaps: { category: string; earned: number; needed: number }[];
    cycleEndDate: string | null;
  };

  if (!gaps?.length) {
    return NextResponse.json({
      summary: "All your CME categories are on track — no gaps to address.",
      recommendations: [],
      courses: {},
    });
  }

  const deficit = totalRequired - totalCompleted;
  const daysLeft = cycleEndDate
    ? Math.ceil((new Date(cycleEndDate).getTime() - Date.now()) / 86400000)
    : null;

  const gapLines = gaps
    .map((g) => `  - ${g.category}: have ${g.earned}, need ${g.needed} more`)
    .join("\n");

  const prompt = `You are a healthcare CME compliance advisor. A ${profession}${specialty ? ` specializing in ${specialty}` : ""} in ${country} has these gaps in their current license renewal cycle${daysLeft !== null ? ` (${daysLeft} days remaining)` : ""}:

Overall deficit: ${deficit} credits (${totalCompleted}/${totalRequired} completed)
Category gaps:
${gapLines}

Give exactly 3 ranked, actionable recommendations to close the highest-priority gaps. Return only valid JSON — no markdown, no text outside the JSON:

{
  "summary": "One sentence summarizing priority and timeline",
  "recommendations": [
    {
      "title": "Specific action title (max 8 words)",
      "category": "exactly one of: conference, online, workshop, journal, teaching, simulation, mandatory, patient_safety, other",
      "credits": <integer — how many credits this activity typically yields>,
      "reason": "One sentence why this closes their specific gap",
      "action_label": "Browse courses",
      "urgency": "high"
    }
  ]
}

Rank by urgency: largest deficit first. Urgency: high (gap > 5 or < 60 days), medium (gap 2-5), low (gap 1-2).`;

  let summary = "";
  let recommendations: {
    title: string;
    category: string;
    credits: number;
    reason: string;
    action_label: string;
    urgency: "high" | "medium" | "low";
  }[] = [];

  try {
    const client = getAnthropicClient();
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (res.content[0] as { type: string; text: string }).text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      summary = parsed.summary ?? "";
      recommendations = parsed.recommendations ?? [];
    }
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }

  // Fetch matching marketplace courses for each recommended category
  const admin = createAdminClient();
  const categories = [...new Set(recommendations.map((r) => r.category))];
  const courses: Record<string, { id: string; title: string; provider_name: string; credits: number; is_free: boolean }[]> = {};

  if (categories.length > 0) {
    const { data: matched } = await admin
      .from("courses")
      .select("id, title, credits, is_free, category, provider_id, training_providers(name)")
      .eq("status", "active")
      .in("category", categories)
      .limit(9);

    for (const course of matched ?? []) {
      const tp = course.training_providers as { name: string }[] | { name: string } | null;
      const providerName = Array.isArray(tp) ? tp[0]?.name : (tp as { name: string } | null)?.name ?? "—";
      const cat = course.category as string;
      if (!courses[cat]) courses[cat] = [];
      if (courses[cat].length < 2) {
        courses[cat].push({
          id: course.id,
          title: course.title,
          provider_name: providerName,
          credits: course.credits,
          is_free: course.is_free,
        });
      }
    }
  }

  return NextResponse.json({ summary, recommendations, courses });
}
