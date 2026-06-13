import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getPaddle } from "@/lib/paddle";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL!));

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("paddle_customer_id, paddle_subscription_id")
    .eq("professional_id", user.id)
    .maybeSingle();

  if (!sub?.paddle_customer_id) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=no_subscription", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  try {
    const paddle = getPaddle();
    const session = await paddle.customerPortalSessions.create(
      sub.paddle_customer_id,
      sub.paddle_subscription_id ? [sub.paddle_subscription_id] : [],
    );
    const portalUrl = session.urls.general.overview;
    return NextResponse.redirect(portalUrl);
  } catch {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=portal_unavailable", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
