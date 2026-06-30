import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/announcements — active announcements for the logged-in user.
// Merges platform-wide announcements with jurisdiction-scoped authority
// announcements. RLS on authority_announcements limits rows to the user's country.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ data: [] });

  const nowIso = new Date().toISOString();

  const [platformRes, authorityRes] = await Promise.all([
    supabase
      .from("platform_announcements")
      .select("id, title, message, type, target_audience, dismissible, cta_label, cta_url")
      .eq("is_active", true)
      .lte("starts_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("authority_announcements")
      .select("id, title, message, type, dismissible, cta_label, cta_url, attachment_url, attachment_name")
      .eq("is_active", true)
      .lte("starts_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const authority = (authorityRes.data ?? []).map((a) => ({ ...a, source: "authority" as const }));
  const data = [...authority, ...(platformRes.data ?? [])];

  return NextResponse.json({ data });
}
