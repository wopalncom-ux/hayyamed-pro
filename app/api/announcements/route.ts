import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/announcements — active announcements for the logged-in user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: [] });

  const { data } = await supabase
    .from("platform_announcements")
    .select("id, title, message, type, target_audience, dismissible, cta_label, cta_url")
    .eq("is_active", true)
    .lte("starts_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({ data: data ?? [] });
}
