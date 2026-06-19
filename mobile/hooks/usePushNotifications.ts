import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import Constants from "expo-constants";

const APP_VERSION = (Constants.expoConfig?.version ?? "1.0.0") as string;

// Called once after the user is authenticated.
// Registers for push, sends token to backend, sets up tap handler.
export function usePushNotifications(userId: string | null) {
  const router = useRouter();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!userId || registeredRef.current) return;
    registeredRef.current = true;

    registerForPushNotificationsAsync().then(async (token) => {
      if (!token) return;

      const session = (await supabase.auth.getSession()).data.session;
      if (!session) return;

      await fetch("https://hayyamed.pro/api/mobile/register-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          device_token: token,
          platform: Platform.OS === "ios" ? "ios" : "android",
          app_version: APP_VERSION,
          os_version: Platform.Version?.toString() ?? undefined,
        }),
      });
    });

    // Handle notification tap (app in background / quit)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, string> | undefined;
      if (data?.screen === "cme") router.push("/(tabs)/cme");
      else if (data?.screen === "licenses") router.push("/(tabs)/licenses");
      else if (data?.screen === "dashboard") router.push("/(tabs)");
    });

    return () => {
      responseListener.current?.remove();
      registeredRef.current = false;
    };
  }, [userId]);
}
