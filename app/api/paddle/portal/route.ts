import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getPaddle } from "@/lib/paddle";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("paddle_customer_id")
    .eq("professional_id", user.id)
    .maybeSingle();

  if (!sub?.paddle_customer_id) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 });
  }

  const session = await getPaddle().customerPortalSessions.create(sub.paddle_customer_id, []);

  return NextResponse.json({ url: session.urls.general.overview });
}
