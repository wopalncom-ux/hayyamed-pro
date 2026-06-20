import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const BIOMETRIC_KEY = "biometric_enabled";

interface Subscription {
  plan: string;
  status: string;
}

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(BIOMETRIC_KEY).then((val) => {
      if (val === "true") setBiometricEnabled(true);
    });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("professional_id", user.id)
      .eq("status", "active")
      .maybeSingle()
      .then(({ data }) => setSubscription(data));
  }, [user?.id]);

  async function toggleBiometric(val: boolean) {
    if (val) {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled   = await LocalAuthentication.isEnrolledAsync();
      if (!compatible || !enrolled) {
        Alert.alert("Not available", "Biometric authentication is not set up on this device.");
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm to enable biometric sign-in",
        cancelLabel: "Cancel",
      });
      if (!result.success) return;
      await SecureStore.setItemAsync(BIOMETRIC_KEY, "true");
    } else {
      await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
    }
    setBiometricEnabled(val);
  }

  function confirmSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "HM";

  const completionPct = profile?.profile_completion_pct ?? 0;
  const isPro = subscription && subscription.plan !== "free";

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-white border-b border-border px-5 pt-4 pb-4">
        <Text className="text-xl font-bold text-gray-900">Profile</Text>
      </View>

      <ScrollView contentContainerClassName="pb-10">
        {/* Avatar + name */}
        <View className="items-center py-8 bg-white border-b border-border">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
            <Text className="text-white text-2xl font-bold">{initials}</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900">{profile?.full_name ?? "—"}</Text>
          <Text className="text-muted text-sm mt-0.5">{profile?.email}</Text>
          {profile?.profession && (
            <Text className="text-primary text-sm font-medium mt-1">{profile.profession}</Text>
          )}
          {isPro && (
            <View className="mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: "#1a56a010" }}>
              <Text style={{ color: "#1a56a0", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
                {subscription!.plan.toUpperCase()} PLAN
              </Text>
            </View>
          )}
          {completionPct < 100 && (
            <View className="w-48 mt-4">
              <Text className="text-xs text-muted text-center mb-1.5">Profile {completionPct}% complete</Text>
              <View className="bg-gray-100 rounded-full h-1.5">
                <View className="h-full rounded-full bg-primary" style={{ width: `${completionPct}%` }} />
              </View>
            </View>
          )}
        </View>

        {/* Account info */}
        <View className="px-5 pt-6">
          <SectionLabel>Account</SectionLabel>
          <InfoRow label="Country" value={profile?.country_of_residence ?? "—"} />
          <InfoRow label="Specialty" value={profile?.specialty ?? "—"} />
          <InfoRow label="License no." value={profile?.license_number ?? "—"} />
          <InfoRow label="Authority" value={profile?.licensing_authority ?? "—"} />
          {profile?.license_expiry && (
            <InfoRow
              label="License expiry"
              value={new Date(profile.license_expiry).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              accent={isExpiringSoon(profile.license_expiry) ? "#d97706" : undefined}
            />
          )}
        </View>

        {/* Subscription */}
        <View className="px-5 pt-6">
          <SectionLabel>Subscription</SectionLabel>
          <View className="bg-white border border-border rounded-xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-3.5">
              <View className="flex-1 mr-3">
                <Text className="text-sm font-medium text-gray-900">
                  {isPro
                    ? `${subscription!.plan.charAt(0).toUpperCase()}${subscription!.plan.slice(1)} Plan`
                    : "Free Plan"}
                </Text>
                <Text className="text-xs text-muted mt-0.5">
                  {isPro
                    ? "Full tracking · PDF reports · AI analysis"
                    : "Basic CME tracking · upgrade for PDF reports"}
                </Text>
              </View>
              {!isPro ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://hayyamed.pro/pricing")}
                  style={{ backgroundColor: "#1a56a0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Upgrade to Pro"
                >
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>Upgrade →</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://hayyamed.pro/settings/billing")}
                  accessibilityLabel="Manage subscription"
                >
                  <Text style={{ color: "#1a56a0", fontSize: 12, fontWeight: "600" }}>Manage</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Security */}
        <View className="px-5 pt-6">
          <SectionLabel>Security</SectionLabel>
          <View className="bg-white border border-border rounded-xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-3.5">
              <View>
                <Text className="text-sm font-medium text-gray-900">Biometric sign-in</Text>
                <Text className="text-xs text-muted mt-0.5">Face ID / Touch ID</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={toggleBiometric}
                trackColor={{ false: "#e2e8f0", true: "#1a56a0" }}
                thumbColor="#ffffff"
                accessibilityLabel="Enable biometric sign-in"
              />
            </View>
          </View>
        </View>

        {/* Links */}
        <View className="px-5 pt-6">
          <SectionLabel>About</SectionLabel>
          <View className="bg-white border border-border rounded-xl overflow-hidden">
            <LinkRow label="Terms of Service"  url="https://hayyamed.pro/terms" />
            <LinkRow label="Privacy Policy"     url="https://hayyamed.pro/privacy" />
            <LinkRow label="Help & Support"     url="https://hayyamed.pro/help" />
            <LinkRow label="App version"        value="1.0.0" />
          </View>
        </View>

        {/* Sign out */}
        <View className="px-5 pt-6">
          <TouchableOpacity
            className="bg-white border border-red-200 rounded-xl py-3.5 items-center"
            onPress={confirmSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Text className="text-danger font-semibold">Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* Mandatory compliance disclaimer */}
        <View className="mx-5 mt-6 mb-2 bg-gray-50 border border-border rounded-xl px-4 py-3">
          <Text className="text-xs text-muted leading-5 text-center">
            Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and
            does not replace official licensing authorities. Users must verify final requirements with
            their relevant regulatory body.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-xs font-bold text-muted uppercase tracking-widest mb-2">
      {children}
    </Text>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <View className="bg-white border border-border rounded-xl px-4 py-3 mb-2 flex-row justify-between items-center">
      <Text className="text-xs text-muted">{label}</Text>
      <Text className="text-sm font-medium" style={{ color: accent ?? "#111827" }}>
        {value}
      </Text>
    </View>
  );
}

function LinkRow({ label, value, url }: { label: string; value?: string; url?: string }) {
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center px-4 py-3.5 bg-white border-b border-border"
      onPress={url ? () => Linking.openURL(url) : undefined}
      accessibilityRole={url ? "link" : "text"}
    >
      <Text className="text-sm text-gray-900">{label}</Text>
      {value ? (
        <Text className="text-sm text-muted">{value}</Text>
      ) : (
        <Text className="text-muted text-lg">›</Text>
      )}
    </TouchableOpacity>
  );
}

function isExpiringSoon(dateStr: string) {
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  return days <= 90;
}
