import "../global.css";
import "react-native-url-polyfill/auto";
import { useEffect } from "react";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import OfflineBanner from "@/components/ui/OfflineBanner";

const queryClient = new QueryClient();

function RootGuard() {
  const { session, user, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Register for push notifications once authenticated
  usePushNotifications(user?.id ?? null);

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    if (!session) {
      if (!inAuth) router.replace("/(auth)/login");
      return;
    }

    if (profile && !profile.onboarding_complete) {
      if (!inOnboarding) router.replace("/onboarding");
      return;
    }

    if (session && profile?.onboarding_complete && (inAuth || inOnboarding)) {
      router.replace("/(tabs)");
    }
  }, [session, profile, loading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootGuard />
        <StatusBar style="auto" />
        <View style={{ flex: 1 }}>
          <OfflineBanner />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
          </Stack>
        </View>
      </AuthProvider>
    </QueryClientProvider>
  );
}
