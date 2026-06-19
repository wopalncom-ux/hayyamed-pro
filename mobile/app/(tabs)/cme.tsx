import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { enqueueActivity, flushQueue, getQueueCount } from "@/lib/offlineQueue";
import { CmeActivity, CmeWallet } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  verified: "#16a34a",
  pending:  "#d97706",
  rejected: "#dc2626",
};

export default function CmeScreen() {
  const { user } = useAuth();
  const [wallet, setWallet]           = useState<CmeWallet | null>(null);
  const [activities, setActivities]   = useState<CmeActivity[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing]         = useState(false);
  const [refreshing, setRefreshing]   = useState(false);
  const [showAdd, setShowAdd]         = useState(false);

  async function loadData() {
    if (!user?.id) return;
    const [walletRes, actRes] = await Promise.all([
      supabase
        .from("cme_wallets")
        .select("*")
        .eq("professional_id", user.id)
        .eq("is_primary", true)
        .maybeSingle(),
      supabase
        .from("cme_activities")
        .select("*")
        .eq("professional_id", user.id)
        .order("activity_date", { ascending: false })
        .limit(20),
    ]);
    setWallet(walletRes.data ?? null);
    setActivities(actRes.data ?? []);
  }

  async function syncPending() {
    setSyncing(true);
    const synced = await flushQueue();
    if (synced > 0) await loadData();
    setPendingCount(await getQueueCount());
    setSyncing(false);
  }

  async function onRefresh() {
    setRefreshing(true);
    await syncPending();
    await loadData();
    setRefreshing(false);
  }

  // Flush offline queue every time this screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadData();
      syncPending();
    }, [user?.id])
  );

  const pct = wallet
    ? Math.min(100, Math.round((wallet.completed_credits / wallet.required_credits) * 100))
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="bg-white border-b border-border px-5 pt-4 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-gray-900">CME Wallet</Text>
          <Text className="text-sm text-muted mt-0.5">{wallet?.country} &bull; {wallet?.profession}</Text>
        </View>
        {pendingCount > 0 && (
          <TouchableOpacity
            onPress={syncPending}
            disabled={syncing}
            className="flex-row items-center gap-1.5 bg-warning-light px-3 py-1.5 rounded-full border border-warning"
            accessibilityLabel={`${pendingCount} activities pending sync`}
          >
            {syncing
              ? <ActivityIndicator size="small" color="#d97706" />
              : <Text style={{ color: "#d97706", fontSize: 12 }}>↑</Text>
            }
            <Text className="text-xs font-semibold" style={{ color: "#d97706" }}>
              {pendingCount} pending
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1a56a0" />}
        contentContainerClassName="pb-8"
      >
        {/* Progress card */}
        {wallet && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-5 border border-border">
            <View className="flex-row justify-between items-baseline mb-3">
              <Text className="text-2xl font-bold text-gray-900">
                {wallet.completed_credits}
                <Text className="text-base font-normal text-muted">/{wallet.required_credits} credits</Text>
              </Text>
              <Text className="text-lg font-bold" style={{ color: pct >= 100 ? "#16a34a" : "#1a56a0" }}>
                {pct}%
              </Text>
            </View>
            <View className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: pct >= 100 ? "#16a34a" : pct >= 60 ? "#1a56a0" : "#d97706",
                }}
              />
            </View>
            <Text className="text-xs text-muted mt-2">
              Cycle ends {new Date(wallet.cycle_end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </Text>
          </View>
        )}

        {/* Add activity button */}
        <TouchableOpacity
          className="bg-primary mx-4 mt-4 rounded-xl py-3.5 items-center"
          onPress={() => setShowAdd(true)}
          accessibilityRole="button"
          accessibilityLabel="Log CME activity"
        >
          <Text className="text-white font-semibold">+ Log CME Activity</Text>
        </TouchableOpacity>

        {/* Activity list */}
        <Text className="text-sm font-semibold text-gray-700 px-5 mt-6 mb-3">Recent activities</Text>
        {activities.length === 0 ? (
          <View className="items-center py-10 px-8">
            <Text className="text-4xl mb-3">📋</Text>
            <Text className="text-gray-900 font-semibold text-center">No activities yet</Text>
            <Text className="text-muted text-center text-sm mt-1">
              Log your first CME activity to start tracking compliance.
            </Text>
          </View>
        ) : (
          <View className="gap-2 px-4">
            {activities.map((act) => (
              <View key={act.id} className="bg-white rounded-xl border border-border px-4 py-3.5">
                <View className="flex-row justify-between items-start">
                  <Text className="text-sm font-semibold text-gray-900 flex-1 mr-2" numberOfLines={2}>
                    {act.title}
                  </Text>
                  <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: STATUS_COLORS[act.verification_status] + "20" }}>
                    <Text className="text-xs font-semibold capitalize" style={{ color: STATUS_COLORS[act.verification_status] }}>
                      {act.verification_status}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3 mt-1.5">
                  <Text className="text-xs text-muted">{new Date(act.activity_date).toLocaleDateString("en-GB")}</Text>
                  <Text className="text-xs text-primary font-semibold">{act.credits} credit{act.credits !== 1 ? "s" : ""}</Text>
                  {act.provider && <Text className="text-xs text-muted">{act.provider}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <AddActivityModal
        visible={showAdd}
        walletId={wallet?.id ?? ""}
        professionalId={user?.id ?? ""}
        onClose={() => setShowAdd(false)}
        onSaved={async () => {
          setShowAdd(false);
          setPendingCount(await getQueueCount());
          await loadData();
        }}
      />
    </SafeAreaView>
  );
}

function AddActivityModal({
  visible, walletId, professionalId, onClose, onSaved,
}: {
  visible: boolean; walletId: string; professionalId: string;
  onClose: () => void; onSaved: () => void;
}) {
  const [title, setTitle]       = useState("");
  const [credits, setCredits]   = useState("");
  const [date, setDate]         = useState(new Date().toISOString().slice(0, 10));
  const [provider, setProvider] = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSave() {
    if (!title.trim() || !credits) {
      Alert.alert("Required", "Title and credits are required.");
      return;
    }
    const cr = parseFloat(credits);
    if (isNaN(cr) || cr <= 0) {
      Alert.alert("Invalid", "Credits must be a positive number.");
      return;
    }
    setLoading(true);

    const payload = {
      wallet_id: walletId,
      professional_id: professionalId,
      title: title.trim(),
      credits: cr,
      activity_date: date,
      provider: provider.trim() || null,
      verification_status: "pending" as const,
      employer_visible: true,
    };

    const { error } = await supabase.from("cme_activities").insert(payload);
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("network") || error.message.toLowerCase().includes("fetch")) {
        // Network unavailable — queue locally
        await enqueueActivity({
          wallet_id: walletId,
          professional_id: professionalId,
          title: payload.title,
          credits: cr,
          activity_date: date,
          provider: payload.provider,
        });
        setTitle(""); setCredits(""); setProvider("");
        Alert.alert(
          "Saved offline",
          "You're offline. This activity has been queued and will sync when you reconnect.",
          [{ text: "OK", onPress: onSaved }]
        );
      } else {
        Alert.alert("Error", error.message);
      }
    } else {
      setTitle(""); setCredits(""); setProvider("");
      onSaved();
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-border bg-white">
          <Text className="text-lg font-bold text-gray-900">Log CME Activity</Text>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
            <Text className="text-muted text-2xl">✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="px-5 pt-5" keyboardShouldPersistTaps="handled">
          <Field label="Activity title *" value={title} onChange={setTitle} placeholder="e.g. Cardiology CME Conference" />
          <Field label="Credits *" value={credits} onChange={setCredits} placeholder="e.g. 5" keyboardType="decimal-pad" />
          <Field label="Date" value={date} onChange={setDate} placeholder="YYYY-MM-DD" />
          <Field label="Provider / organiser" value={provider} onChange={setProvider} placeholder="e.g. Qatar Medical Association" />

          <TouchableOpacity
            className={`bg-primary rounded-xl py-4 items-center mt-4 ${loading ? "opacity-60" : ""}`}
            onPress={handleSave}
            disabled={loading}
          >
            <Text className="text-white font-semibold">{loading ? "Saving…" : "Save activity"}</Text>
          </TouchableOpacity>

          <Text className="text-xs text-muted text-center mt-4 leading-5">
            Activities saved offline will sync automatically when you reconnect.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function Field({
  label, value, onChange, placeholder, keyboardType = "default",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; keyboardType?: "default" | "decimal-pad" | "email-address";
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-1.5">{label}</Text>
      <TextInput
        className="bg-white border border-border rounded-xl px-4 py-3.5 text-gray-900 text-base"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />
    </View>
  );
}
