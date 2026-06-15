import { createAdminClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";

export type WebhookEventType =
  | "staff.compliance_changed"
  | "license.expiring"
  | "course.completed"
  | "cme.verified"
  | "staff.linked"
  | "staff.unlinked"
  | "staff.task_completed";

type WebhookPayload = Record<string, unknown>;

/**
 * Dispatch a webhook event to all active endpoints registered for an organisation
 * that subscribe to this event type.
 *
 * Fire-and-forget — never throws. Failures are recorded in webhook_deliveries
 * for retry by the process-notifications cron.
 */
export async function dispatchWebhook(
  organizationId: string,
  eventType: WebhookEventType,
  payload: WebhookPayload
): Promise<void> {
  try {
    const admin = createAdminClient();

    // Find active endpoints for this org that subscribe to this event
    const { data: endpoints } = await admin
      .from("webhook_endpoints")
      .select("id, url, secret, events")
      .eq("organization_id", organizationId)
      .eq("is_active", true);

    if (!endpoints?.length) return;

    const matching = endpoints.filter(
      (ep) => (ep.events as string[]).includes(eventType)
    );
    if (!matching.length) return;

    const body = JSON.stringify({
      event: eventType,
      timestamp: new Date().toISOString(),
      organization_id: organizationId,
      data: payload,
    });

    // Queue one delivery row per endpoint — cron picks them up for actual HTTP send
    const deliveries = matching.map((ep) => {
      const sig = createHmac("sha256", ep.secret)
        .update(body)
        .digest("hex");

      return {
        endpoint_id: ep.id,
        event_type: eventType,
        payload: {
          body,
          signature: `sha256=${sig}`,
          url: ep.url,
        },
        status: "pending" as const,
      };
    });

    await admin.from("webhook_deliveries").insert(deliveries);
  } catch {
    // Intentionally swallowed — webhook dispatch must never break the main flow
  }
}

/**
 * Actually send a queued webhook delivery via HTTP POST.
 * Called by the webhook delivery cron (not yet built — see process-webhooks route).
 */
export async function sendWebhookDelivery(deliveryId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const admin = createAdminClient();

    const { data: delivery } = await admin
      .from("webhook_deliveries")
      .select("id, endpoint_id, event_type, payload, attempts")
      .eq("id", deliveryId)
      .maybeSingle();

    if (!delivery) return { ok: false, error: "Delivery not found" };

    const p = delivery.payload as { body: string; signature: string; url: string };

    const res = await fetch(p.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-HMP-Signature": p.signature,
        "X-HMP-Event": delivery.event_type ?? "webhook",
        "User-Agent": "HayyaMed-Webhooks/1.0",
      },
      body: p.body,
      signal: AbortSignal.timeout(10_000),
    });

    if (res.ok) {
      await admin
        .from("webhook_deliveries")
        .update({
          status: "delivered",
          response_status: res.status,
          response_body: (await res.text()).slice(0, 500),
          delivered_at: new Date().toISOString(),
          attempts: delivery.attempts + 1,
        })
        .eq("id", deliveryId);
      return { ok: true };
    }

    const errBody = (await res.text()).slice(0, 500);
    await admin
      .from("webhook_deliveries")
      .update({
        status: "failed",
        response_status: res.status,
        response_body: errBody,
        attempts: delivery.attempts + 1,
        next_retry_at: new Date(Date.now() + Math.pow(2, delivery.attempts + 1) * 60_000).toISOString(),
      })
      .eq("id", deliveryId);

    return { ok: false, error: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
