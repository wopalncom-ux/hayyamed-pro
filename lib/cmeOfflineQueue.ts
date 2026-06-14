const QUEUE_KEY = "hayyamed_cme_offline_queue";

export interface QueuedCmeActivity {
  id: string;
  walletId: string;
  title: string;
  provider: string | null;
  activityDate: string;
  credits: number;
  category: string | null;
  queuedAt: string;
}

export function getQueue(): QueuedCmeActivity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function enqueue(item: Omit<QueuedCmeActivity, "id" | "queuedAt">): QueuedCmeActivity {
  const entry: QueuedCmeActivity = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    queuedAt: new Date().toISOString(),
  };
  const queue = getQueue();
  queue.push(entry);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return entry;
}

export function dequeue(id: string): void {
  const queue = getQueue().filter((item) => item.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}

export function queueSize(): number {
  return getQueue().length;
}
