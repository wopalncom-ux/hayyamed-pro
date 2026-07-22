import { PushPayload } from "@/lib/push";

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

export async function sendExpoPushNotification(deviceToken: string, payload: PushPayload) {
  try {
    const res = await fetch(EXPO_PUSH_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          to: deviceToken,
          title: payload.title,
          body: payload.body,
          data: payload.url ? { url: payload.url } : undefined,
          sound: "default",
        },
      ]),
    });

    const json = (await res.json().catch(() => null)) as {
      data?: Array<{ status: "ok" | "error"; message?: string; details?: { error?: string } }>;
    } | null;

    const ticket = json?.data?.[0];
    if (!res.ok || !ticket || ticket.status === "error") {
      const errorCode = ticket?.details?.error;
      // DeviceNotRegistered / InvalidCredentials mean the token is dead — caller should deactivate it.
      const expired = errorCode === "DeviceNotRegistered";
      return { error: ticket?.message ?? `Expo push HTTP ${res.status}`, expired };
    }

    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : String(err), expired: false };
  }
}
