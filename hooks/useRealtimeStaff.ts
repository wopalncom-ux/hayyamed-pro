"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type StaffCompliance = {
  compliant: number;
  at_risk: number;
  non_compliant: number;
};

export function useRealtimeStaffCompliance(
  organizationId: string | null,
  initial: StaffCompliance
) {
  const [counts, setCounts] = useState<StaffCompliance>(initial);

  const refresh = useCallback(async (orgId: string) => {
    const supabase = createClient();

    const { data: links } = await supabase
      .from("employer_link_requests")
      .select("professional_id")
      .eq("organization_id", orgId)
      .eq("status", "approved");

    if (!links?.length) return;

    const ids = links.map((l) => l.professional_id);

    const { data: wallets } = await supabase
      .from("cme_wallets")
      .select("compliance_status")
      .in("professional_id", ids);

    const next: StaffCompliance = { compliant: 0, at_risk: 0, non_compliant: 0 };
    for (const w of wallets ?? []) {
      if (w.compliance_status === "compliant")     next.compliant++;
      else if (w.compliance_status === "at_risk")  next.at_risk++;
      else                                          next.non_compliant++;
    }
    setCounts(next);
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    const supabase = createClient();

    // Watch for any wallet change for staff in this org
    const channel = supabase
      .channel(`staff_compliance:${organizationId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "cme_wallets" },
        () => refresh(organizationId)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "employer_link_requests",
          filter: `organization_id=eq.${organizationId}` },
        () => refresh(organizationId)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, refresh]);

  return counts;
}
