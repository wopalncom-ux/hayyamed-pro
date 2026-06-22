import { useEffect, useRef, useState } from "react";
import * as Network from "expo-network";
import { flushQueue, getQueueCount } from "@/lib/offlineQueue";

interface NetworkSyncState {
  isOnline: boolean;
  pendingCount: number;
  syncing: boolean;
}

/**
 * Monitors network connectivity and auto-flushes the offline CME activity queue
 * when the device comes back online. Returns current online state and pending count.
 */
export function useNetworkSync(): NetworkSyncState {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // Track previous online state to detect reconnection
  const wasOnline = useRef(true);

  async function refreshPendingCount() {
    const count = await getQueueCount();
    setPendingCount(count);
  }

  async function tryFlush() {
    const count = await getQueueCount();
    if (count === 0) return;
    setSyncing(true);
    try {
      await flushQueue();
    } finally {
      await refreshPendingCount();
      setSyncing(false);
    }
  }

  useEffect(() => {
    // Initialise pending count and online state
    refreshPendingCount();
    Network.getNetworkStateAsync().then((state) => {
      const online = state.isInternetReachable ?? true;
      setIsOnline(online);
      wasOnline.current = online;
    });

    const subscription = Network.addNetworkStateListener((state) => {
      const online = state.isInternetReachable ?? true;
      setIsOnline(online);

      // Came back online — flush any queued activities
      if (online && !wasOnline.current) {
        tryFlush();
      }
      wasOnline.current = online;
    });

    return () => subscription.remove();
  }, []);

  return { isOnline, pendingCount, syncing };
}
