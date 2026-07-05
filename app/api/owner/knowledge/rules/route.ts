import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOwnerApiAuth } from "@/lib/auth/requireOwnerApi";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const BodySchema = z.object({ rule_text: z.string().min(3).max(1000) });

// POST /api/owner/knowledge/rules
// Adds an always-on behavior rule for the compliance chatbot (e.g. "never
// recommend a specific course provider"). Unlike documents/websites/Q&A,
// rules are not retrieved via similarity search — every active rule is
// injected into the system prompt on every request.
export async function POST(req: NextRequest) {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "rule_text is required (3-1000 chars)" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("assistant_rules")
    .insert({ rule_text: parsed.data.rule_text, created_by: owner.userId })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: owner.userId,
    action: "owner.knowledge.rule_added",
    targetTable: "assistant_rules",
    targetId: data.id,
    metadata: { rule_text: parsed.data.rule_text },
  });

  return NextResponse.json({ success: true, id: data.id });
}
