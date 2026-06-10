import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getPaddle, PLANS, type PlanKey } from "@/lib/paddle";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const plan = body.plan as PlanKey;
  if (!PLANS[plan]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("paddle_customer_id")
    .eq("professional_id", user.id)
    .maybeSingle();

  // Create transaction — Paddle returns a hosted checkout URL
  const transaction = await getPaddle().transactions.create({
    items: [{ priceId: PLANS[plan].paddlePriceId, quantity: 1 }],
    ...(sub?.paddle_customer_id
      ? { customer: { id: sub.paddle_customer_id } }
      : { customer: { email: user.email! } }),
    customData: { supabase_uid: user.id, plan },
  });

  if (!transaction.checkout?.url) {
    return NextResponse.json({ error: "Could not create checkout" }, { status: 500 });
  }

  return NextResponse.json({ url: transaction.checkout.url });
}
