import { NextRequest, NextResponse } from "next/server";
import { getPaddle } from "@/lib/paddle";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { EventName } from "@paddle/paddle-node-sdk";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET!, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.eventType) {
    case EventName.TransactionCompleted: {
      const tx = event.data;
      const customData = tx.customData as { supabase_uid?: string; plan?: string } | null;
      const uid = customData?.supabase_uid;
      const plan = customData?.plan;
      if (!uid || !plan) break;

      const customerId = typeof tx.customerId === "string" ? tx.customerId : null;
      const subscriptionId = typeof tx.subscriptionId === "string" ? tx.subscriptionId : null;

      await admin.from("subscriptions").upsert({
        professional_id: uid,
        paddle_customer_id: customerId,
        paddle_subscription_id: subscriptionId,
        plan,
        status: "active",
      }, { onConflict: "professional_id" });

      await logAudit({ actorAuthId: uid, action: "subscription.activated", metadata: { plan } });
      break;
    }

    case EventName.SubscriptionUpdated: {
      const sub = event.data;
      const customData = sub.customData as { supabase_uid?: string; plan?: string } | null;
      const uid = customData?.supabase_uid;
      if (!uid) break;

      await admin.from("subscriptions").update({
        status: sub.status,
        plan: sub.status === "canceled" ? "free" : (customData?.plan ?? "free"),
        current_period_end: sub.currentBillingPeriod?.endsAt ?? null,
        cancel_at_period_end: sub.scheduledChange?.action === "cancel",
      }).eq("professional_id", uid);

      await logAudit({ actorAuthId: uid, action: "subscription.updated", metadata: { status: sub.status } });
      break;
    }

    case EventName.SubscriptionCanceled: {
      const sub = event.data;
      const customData = sub.customData as { supabase_uid?: string } | null;
      const uid = customData?.supabase_uid;
      if (!uid) break;

      await admin.from("subscriptions").update({
        status: "canceled",
        plan: "free",
        paddle_subscription_id: null,
        cancel_at_period_end: false,
      }).eq("professional_id", uid);

      await logAudit({ actorAuthId: uid, action: "subscription.canceled" });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
