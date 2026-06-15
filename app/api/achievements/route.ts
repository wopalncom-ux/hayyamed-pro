import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";

export const runtime = "nodejs";

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin
    .from("professional_achievements")
    .select("badge_key, awarded_at")
    .eq("professional_id", user.id)
    .order("awarded_at", { ascending: true });

  return NextResponse.json({ achievements: data ?? [] });
}
