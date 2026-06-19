import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { License } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  active:    { label: "Active",    bg: "#dcfce7", text: "#16a34a" },
  expired:   { label: "Expired",   bg: "#fee2e2", text: "#dc2626" },
  pending:   { label: "Pending",   bg: "#fef3c7", text: "#d97706" },
  suspended: { label: "Suspended", bg: "#fee2e2", text: "#dc2626" },
};

export default function LicensesScreen() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    if (!user?.id) return;
    const { data } = await supabase
      .from("licenses")
      .select("*")
      .eq("professional_id", user.id)
      .order("expiry_date", { ascending: true });
    setLicenses(data ?? []);
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => { loadData(); }, [user?.id]);

  function daysUntilExpiry(dateStr: string | null) {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
    return diff;
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-white border-b border-border px-5 pt-4 pb-4">
        <Text className="text-xl font-bold text-gray-900">Licenses</Text>
        <Text className="text-sm text-muted mt-0.5">{licenses.length} license{licenses.length !== 1 ? "s" : ""} tracked</Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1a56a0" />}
        contentContainerClassName="pb-8 px-4 pt-4"
      >
        {licenses.length === 0 ? (
          <View className="items-center py-12 px-8">
            <Text className="text-5xl mb-4">🪪</Text>
            <Text className="text-gray-900 font-semibold text-center text-base">No licenses yet</Text>
            <Text className="text-muted text-center text-sm mt-2 leading-5">
              Add your professional licenses on the web dashboard to track renewal dates.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {licenses.map((lic) => {
              const cfg = STATUS_CONFIG[lic.status] ?? STATUS_CONFIG.active;
              const days = daysUntilExpiry(lic.expiry_date);
              const expiringSoon = days !== null && days > 0 && days <= 30;

              return (
                <View
                  key={lic.id}
                  className="bg-white rounded-2xl border p-4"
                  style={{ borderColor: expiringSoon ? "#d97706" : "#e2e8f0" }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-sm font-bold text-gray-900">{lic.license_type}</Text>
                      <Text className="text-xs text-muted mt-0.5">{lic.issuing_authority} &bull; {lic.country}</Text>
                    </View>
                    <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: cfg.bg }}>
                      <Text className="text-xs font-bold" style={{ color: cfg.text }}>{cfg.label}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-4 mt-1">
                    <Text className="text-xs text-muted">
                      No. <Text className="text-gray-700 font-medium">{lic.license_number}</Text>
                    </Text>
                  </View>

                  {lic.expiry_date && (
                    <View className="mt-3 pt-3 border-t border-border flex-row justify-between items-center">
                      <Text className="text-xs text-muted">Expires</Text>
                      <Text className="text-xs font-semibold" style={{ color: expiringSoon ? "#d97706" : "#374151" }}>
                        {new Date(lic.expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        {expiringSoon && days !== null && ` (${days}d)`}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
