import { NextRequest, NextResponse } from "next/server";
import { getPaddle } from "@/lib/paddle";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { sendSubscriptionActivatedEmail, sendSubscriptionCanceledEmail } from "@/lib/email";
import { EventName } from "@paddle/paddle-node-sdk";

export const runtime = "nodejs";

async function resolveUid(
  customData: { supabase_uid?: string } | null,
  paddleSubscriptionId: string | null,
): Promise<string | null> {
  if (customData?.supabase_uid) return customData.supabase_uid;
  if (!paddleSubscriptionId) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("professional_id")
    .eq("paddle_subscription_id", paddleSubscriptionId)
    .maybeSingle();
  return data?.professional_id ?? null;
}

async function getUserEmailAndName(uid: string): Promise<{ email: string; name: string } | null> {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("email, full_name")
    .eq("auth_id", uid)
    .maybeSingle();
  if (!profile?.email) return null;
  return { email: profile.email, name: profile.full_name ?? "Healthcare Professional" };
}

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
      const customData = tx.customData as {
        supabase_uid?: string;
        plan?: string;
        billing_interval?: string;
        employer_tier?: string;
      } | null;
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
        billing_interval: customData?.billing_interval ?? "annual",
        employer_tier: customData?.employer_tier ?? null,
      }, { onConflict: "professional_id" });

      await logAudit({ actorAuthId: uid, action: "subscription.activated", metadata: { plan, billing_interval: customData?.billing_interval, employer_tier: customData?.employer_tier } });

      // Fire-and-forget upgrade confirmation email
      getUserEmailAndName(uid).then((u) => {
        if (u) sendSubscriptionActivatedEmail({ to: u.email, name: u.name, plan, billingInterval: customData?.billing_interval, employerTier: customData?.employer_tier }).catch(() => {});
      });
      break;
    }

    case EventName.SubscriptionActivated: {
      // Fires after first successful payment — fills in current_period_end
      // which TransactionCompleted does not include
      const sub = event.data;
      const customData = sub.customData as {
        supabase_uid?: string;
        plan?: string;
        billing_interval?: string;
        employer_tier?: string;
      } | null;
      const paddleSubId = typeof sub.id === "string" ? sub.id : null;
      const uid = await resolveUid(customData, paddleSubId);
      if (!uid) break;

      await admin.from("subscriptions").update({
        status: "active",
        paddle_subscription_id: paddleSubId,
        current_period_end: sub.currentBillingPeriod?.endsAt ?? null,
        cancel_at_period_end: false,
        ...(customData?.plan ? { plan: customData.plan } : {}),
        ...(customData?.billing_interval ? { billing_interval: customData.billing_interval } : {}),
        ...(customData?.employer_tier !== undefined ? { employer_tier: customData.employer_tier } : {}),
      }).eq("professional_id", uid);

      await logAudit({ actorAuthId: uid, action: "subscription.activated_webhook", metadata: { paddle_subscription_id: paddleSubId } });
      break;
    }

    case EventName.SubscriptionUpdated: {
      const sub = event.data;
      const customData = sub.customData as {
        supabase_uid?: string;
        plan?: string;
        billing_interval?: string;
        employer_tier?: string;
      } | null;
      const paddleSubId = typeof sub.id === "string" ? sub.id : null;
      const uid = await resolveUid(customData, paddleSubId);
      if (!uid) break;

      await admin.from("subscriptions").update({
        status: sub.status,
        plan: sub.status === "canceled" ? "free" : (customData?.plan ?? "free"),
        current_period_end: sub.currentBillingPeriod?.endsAt ?? null,
        cancel_at_period_end: sub.scheduledChange?.action === "cancel",
        ...(customData?.billing_interval ? { billing_interval: customData.billing_interval } : {}),
        ...(customData?.employer_tier !== undefined ? { employer_tier: customData.employer_tier } : {}),
      }).eq("professional_id", uid);

      await logAudit({ actorAuthId: uid, action: "subscription.updated", metadata: { status: sub.status } });
      break;
    }

    case EventName.SubscriptionCanceled: {
      const sub = event.data;
      const customData = sub.customData as { supabase_uid?: string } | null;
      const paddleSubId = typeof sub.id === "string" ? sub.id : null;
      const uid = await resolveUid(customData, paddleSubId);
      if (!uid) break;

      await admin.from("subscriptions").update({
        status: "canceled",
        plan: "free",
        paddle_subscription_id: null,
        cancel_at_period_end: false,
      }).eq("professional_id", uid);

      await logAudit({ actorAuthId: uid, action: "subscription.canceled" });

      // Fire-and-forget cancellation email
      const periodEnd = (event.data as { currentBillingPeriod?: { endsAt?: string } })?.currentBillingPeriod?.endsAt ?? null;
      getUserEmailAndName(uid).then((u) => {
        if (u) sendSubscriptionCanceledEmail({ to: u.email, name: u.name, periodEnd }).catch(() => {});
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
