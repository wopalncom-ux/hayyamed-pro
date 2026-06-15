import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin
    .from("professional_achievements")
    .select("badge_key, awarded_at")
    .eq("professional_id", user.id)
    .order("awarded_at", { ascending: true });

  return NextResponse.json({ achievements: data ?? [] });
}
