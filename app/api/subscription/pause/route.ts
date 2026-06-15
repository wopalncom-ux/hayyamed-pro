import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getPaddle } from "@/lib/paddle";

export async function POST() {
  const user = await getRequestUser(await headers());
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("paddle_subscription_id, plan, status, current_period_end, cancel_at_period_end")
    .eq("professional_id", user.id)
    .maybeSingle();

  if (!sub || !sub.paddle_subscription_id) {
    return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
  }
  if (sub.cancel_at_period_end) {
    return NextResponse.json({ error: "Subscription is already scheduled to cancel" }, { status: 409 });
  }

  // Cancel at next billing period via Paddle (same as cancel — paddle has no native pause)
  try {
    await getPaddle().subscriptions.cancel(sub.paddle_subscription_id, {
      effectiveFrom: "next_billing_period",
    });
  } catch (err) {
    return NextResponse.json({ error: `Paddle error: ${String(err)}` }, { status: 502 });
  }

  // Grant 30 days of free Pro after current period ends
  const baseDate = sub.current_period_end
    ? new Date(sub.current_period_end)
    : new Date();
  const trialEnd = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  await Promise.all([
    admin
      .from("subscriptions")
      .update({ cancel_at_period_end: true, updated_at: new Date().toISOString() })
      .eq("professional_id", user.id),
    admin
      .from("professional_profiles")
      .update({ pro_trial_ends_at: trialEnd.toISOString() })
      .eq("auth_id", user.id),
  ]);

  await admin.from("audit_logs").insert({
    actor_auth_id: user.id,
    action: "subscription.paused",
    metadata: {
      paddle_subscription_id: sub.paddle_subscription_id,
      plan: sub.plan,
      free_trial_ends_at: trialEnd.toISOString(),
    },
  });

  return NextResponse.json({ ok: true, trialEndsAt: trialEnd.toISOString() });
}
