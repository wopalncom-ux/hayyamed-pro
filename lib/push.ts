import webpush from "web-push";

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

function configuredWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  return webpush;
}

export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
) {
  try {
    await configuredWebPush().sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      JSON.stringify(payload)
    );
    return { error: null };
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode;
    // 410 Gone = subscription expired, caller should delete it
    return { error: err, expired: status === 410 || status === 404 };
  }
}
