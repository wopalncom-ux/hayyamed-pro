"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type WalletUpdate = {
  compliance_status: string;
  completed_credits: number;
  required_credits: number;
};

export function useRealtimeWallet(
  walletId: string | null,
  initial: WalletUpdate
) {
  const [wallet, setWallet] = useState<WalletUpdate>(initial);

  useEffect(() => {
    if (!walletId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`wallet:${walletId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "cme_wallets",
          filter: `id=eq.${walletId}`,
        },
        (payload) => {
          const row = payload.new as WalletUpdate;
          setWallet({
            compliance_status: row.compliance_status,
            completed_credits: row.completed_credits,
            required_credits: row.required_credits,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [walletId]);

  return wallet;
}
