"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeActivityStatus(
  professionalId: string | null,
  initialPending: number
) {
  const [pendingCount, setPendingCount] = useState(initialPending);

  useEffect(() => {
    if (!professionalId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`activities:${professionalId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cme_activities",
          filter: `professional_id=eq.${professionalId}`,
        },
        () => {
          // Re-count pending activities on any change
          supabase
            .from("cme_activities")
            .select("id", { count: "exact", head: true })
            .eq("professional_id", professionalId)
            .eq("verification_status", "pending")
            .then(({ count }) => {
              setPendingCount(count ?? 0);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  return pendingCount;
}
