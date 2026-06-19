import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

const QUEUE_KEY = "hmp_cme_offline_queue";

export interface QueuedActivity {
  localId: string;
  wallet_id: string;
  professional_id: string;
  title: string;
  credits: number;
  activity_date: string;
  provider: string | null;
  queued_at: string;
}

export async function enqueueActivity(activity: Omit<QueuedActivity, "localId" | "queued_at">): Promise<void> {
  const existing = await getQueue();
  const entry: QueuedActivity = {
    ...activity,
    localId: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    queued_at: new Date().toISOString(),
  };
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([...existing, entry]));
}

export async function getQueue(): Promise<QueuedActivity[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedActivity[]) : [];
  } catch {
    return [];
  }
}

export async function getQueueCount(): Promise<number> {
  return (await getQueue()).length;
}

// Returns number of activities successfully synced
export async function flushQueue(): Promise<number> {
  const queue = await getQueue();
  if (queue.length === 0) return 0;

  const succeeded: string[] = [];

  for (const item of queue) {
    try {
      const { error } = await supabase.from("cme_activities").insert({
        wallet_id: item.wallet_id,
        professional_id: item.professional_id,
        title: item.title,
        credits: item.credits,
        activity_date: item.activity_date,
        provider: item.provider,
        verification_status: "pending",
        employer_visible: true,
      });
      if (!error) succeeded.push(item.localId);
    } catch {
      // Network still down — leave in queue
    }
  }

  if (succeeded.length > 0) {
    const remaining = queue.filter((q) => !succeeded.includes(q.localId));
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  }

  return succeeded.length;
}
