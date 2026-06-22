import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { CmeWallet, Subscription } from "@/lib/types";
import { ComplianceRing } from "@/components/dashboard/ComplianceRing";
import { StatCard } from "@/components/ui/StatCard";

export default function DashboardScreen() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [wallet, setWallet]             = useState<CmeWallet | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [licenseCount, setLicenseCount] = useState(0);
  const [refreshing, setRefreshing]     = useState(false);

  async function loadData() {
    if (!user?.id) return;
    const [walletRes, subRes, licRes] = await Promise.all([
      supabase
        .from("cme_wallets")
        .select("*")
        .eq("professional_id", user.id)
        .eq("is_primary", true)
        .maybeSingle(),
      supabase
        .from("subscriptions")
        .select("*")
        .eq("professional_id", user.id)
        .maybeSingle(),
      supabase
        .from("licenses")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", user.id),
    ]);
    setWallet(walletRes.data ?? null);
    setSubscription(subRes.data ?? null);
    setLicenseCount(licRes.count ?? 0);
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const pct = wallet
    ? Math.min(100, Math.round((wallet.completed_credits / wallet.required_credits) * 100))
    : 0;

  const statusColor =
    wallet?.compliance_status === "compliant" ? "#16a34a" :
    wallet?.compliance_status === "at_risk"   ? "#d97706" : "#dc2626";

  const firstName = profile?.full_name?.split(" ")[0] ?? "Doctor";

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1a56a0" />}
        contentContainerClassName="pb-6"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-border">
          <View>
            <Text className="text-xs text-muted font-medium">Good morning,</Text>
            <Text className="text-lg font-bold text-gray-900">{firstName}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            {subscription?.plan && subscription.plan !== "free" && (
              <View className="bg-primary-light rounded-full px-3 py-1">
                <Text className="text-primary text-xs font-bold uppercase">{subscription.plan}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={signOut}
              accessibilityLabel="Sign out"
              className="w-9 h-9 rounded-full bg-surface border border-border items-center justify-center"
            >
              <Text style={{ fontSize: 16 }}>↪</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Compliance Ring */}
        <View className="items-center py-8">
          <ComplianceRing
            percentage={pct}
            color={statusColor}
            completed={wallet?.completed_credits ?? 0}
            required={wallet?.required_credits ?? 0}
            country={wallet?.country ?? ""}
          />
        </View>

        {/* Stat cards */}
        <View className="flex-row gap-3 px-5 mb-4">
          <StatCard
            label="CME Credits"
            value={`${wallet?.completed_credits ?? 0}/${wallet?.required_credits ?? 0}`}
            sub="this cycle"
            color="#1a56a0"
          />
          <StatCard
            label="Licenses"
            value={String(licenseCount)}
            sub="tracked"
            color="#16a34a"
          />
        </View>

        {/* Quick actions */}
        <View className="px-5">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Quick actions</Text>
          <View className="gap-3">
            <QuickAction
              label="Log a CME activity"
              sub="Add credits to your wallet"
              onPress={() => router.push("/(tabs)/cme")}
            />
            <QuickAction
              label="View licenses"
              sub="Check renewal dates"
              onPress={() => router.push("/(tabs)/licenses")}
            />
            <QuickAction
              label="Open web dashboard"
              sub="Full features at hayyamed.pro"
              onPress={() => Linking.openURL("https://hayyamed.pro/dashboard")}
            />
          </View>
        </View>

        {/* Disclaimer */}
        <Text className="text-xs text-muted text-center px-8 mt-8 leading-5">
          Hayya Med Pro supports CME tracking only. Verify requirements with your regulatory authority.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ label, sub, onPress }: { label: string; sub: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="bg-white border border-border rounded-xl px-4 py-3.5 flex-row items-center justify-between"
      onPress={onPress}
      accessibilityRole="button"
    >
      <View>
        <Text className="text-sm font-semibold text-gray-900">{label}</Text>
        <Text className="text-xs text-muted mt-0.5">{sub}</Text>
      </View>
      <Text className="text-muted text-lg">›</Text>
    </TouchableOpacity>
  );
}
