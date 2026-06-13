import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: profiles, error } = await admin
    .from("professional_profiles")
    .select(`
      auth_id,
      full_name,
      profession,
      specialty,
      country,
      city,
      license_number,
      license_expiry,
      onboarding_complete,
      onboarding_step,
      created_at,
      cme_wallets (
        required_credits,
        completed_credits,
        compliance_status
      ),
      subscriptions (
        plan,
        status
      )
    `)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (profiles ?? []).map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wallet = Array.isArray((p as any).cme_wallets) ? (p as any).cme_wallets[0] : (p as any).cme_wallets;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sub = Array.isArray((p as any).subscriptions) ? (p as any).subscriptions[0] : (p as any).subscriptions;
    return [
      p.auth_id ?? "",
      csvEsc(p.full_name),
      csvEsc(p.profession),
      csvEsc(p.specialty),
      csvEsc(p.country),
      csvEsc(p.city),
      csvEsc(p.license_number),
      p.license_expiry ?? "",
      p.onboarding_complete ? "Yes" : "No",
      String(p.onboarding_step ?? 1),
      sub?.plan ?? "free",
      sub?.status ?? "",
      wallet?.required_credits ?? "",
      wallet?.completed_credits ?? "",
      wallet?.compliance_status ?? "",
      p.created_at ? new Date(p.created_at).toISOString().split("T")[0] : "",
    ].join(",");
  });

  const header = [
    "auth_id", "full_name", "profession", "specialty", "country", "city",
    "license_number", "license_expiry", "onboarding_complete", "onboarding_step",
    "plan", "subscription_status",
    "required_credits", "completed_credits", "compliance_status",
    "created_at",
  ].join(",");

  const csv = [header, ...rows].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hayyamed-professionals-${date}.csv"`,
    },
  });
}

function csvEsc(v: string | null | undefined): string {
  if (!v) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
