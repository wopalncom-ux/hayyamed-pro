import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

export const runtime = "nodejs";

const UpdateSchema = z.object({
  status: z.enum(["acknowledged", "completed"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const update: Record<string, unknown> = {
    status: parsed.data.status,
    updated_at: now,
  };

  if (parsed.data.status === "acknowledged") update.acknowledged_at = now;
  if (parsed.data.status === "completed") {
    update.acknowledged_at = now;
    update.completed_at = now;
  }

  const { error } = await admin
    .from("employer_tasks")
    .update(update)
    .eq("id", id)
    .eq("assigned_to", user.id);

  if (error) return NextResponse.json({ error: "Failed to update task" }, { status: 500 });

  return NextResponse.json({ success: true });
}
