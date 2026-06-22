import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Network from "expo-network";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const check = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOffline(!state.isConnected || !state.isInternetReachable);
    };

    check();
    interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isOffline) return null;

  return (
    <View className="bg-yellow-500 px-4 py-2 flex-row items-center justify-center gap-2">
      <Text className="text-white text-xs font-semibold text-center">
        You are offline — CME activities will sync when you reconnect
      </Text>
    </View>
  );
}
