import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/changelog — latest 5 published entries for logged-in users
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: [] });

  const { data } = await supabase
    .from("changelog_entries")
    .select("id, version, title, summary, items, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(5);

  return NextResponse.json({ data: data ?? [] });
}
