import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Invalid id", { status: 400 });
  }

  const admin = createAdminClient();

  const [profileRes, walletRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, country_of_residence")
      .eq("auth_id", id)
      .maybeSingle(),
    admin
      .from("cme_wallets")
      .select("completed_credits, required_credits, compliance_status, cycle_end_date, country")
      .eq("professional_id", id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const profile = profileRes.data;
  if (!profile) return new Response("Not found", { status: 404 });

  const wallet = walletRes.data;
  const completed = wallet?.completed_credits ?? 0;
  const required = wallet?.required_credits ?? 50;
  const pct = required > 0 ? Math.min(100, Math.round((completed / required) * 100)) : 0;
  const status = (wallet?.compliance_status ?? "non_compliant") as string;
  const country = wallet?.country ?? profile.country_of_residence ?? "Qatar";
  const cycleEnd = wallet?.cycle_end_date ?? null;

  const statusConfig: Record<string, { label: string; color: string }> = {
    compliant:     { label: "Compliant",     color: "#16a34a" },
    at_risk:       { label: "At Risk",       color: "#d97706" },
    non_compliant: { label: "Non-Compliant", color: "#dc2626" },
  };
  const sc = statusConfig[status] ?? { label: "In Progress", color: "#64748b" };

  const issuedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const profession = profile.profession ?? null;
  const specialty = profile.specialty ?? null;
  const subtitle = [profession, specialty, country].filter(Boolean).join("  Â·  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 628,
          background: "linear-gradient(135deg, #0f1f3d 0%, #1a2f5a 60%, #0c1a33 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 500,
            height: 500,
            background: `radial-gradient(circle, ${sc.color}22 0%, transparent 65%)`,
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -200,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(26,86,160,0.18) 0%, transparent 65%)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "52px 72px",
          }}
        >
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "#1a56a0",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontSize: 22, fontWeight: 800 }}>H</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 22, fontWeight: 700 }}>
                Hayya Med Pro
              </span>
            </div>

            {/* Status badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: sc.color + "22",
                border: `1.5px solid ${sc.color}55`,
                borderRadius: 100,
                padding: "8px 20px",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: sc.color,
                }}
              />
              <span style={{ color: sc.color, fontSize: 17, fontWeight: 700 }}>
                {sc.label}
              </span>
            </div>
          </div>

          {/* Main content â€” two columns */}
          <div style={{ display: "flex", flex: 1, gap: 56, alignItems: "center" }}>
            {/* Left: professional info */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                CME Compliance Badge
              </div>

              <div style={{ color: "white", fontSize: 44, fontWeight: 800, lineHeight: 1.1, marginBottom: 10 }}>
                {profile.full_name ?? "Healthcare Professional"}
              </div>

              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 20, marginBottom: 36 }}>
                {subtitle}
              </div>

              {/* Credits */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "#60a5fa", fontSize: 40, fontWeight: 800 }}>{completed}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 22 }}>/ {required}</span>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, marginLeft: 4 }}>CME credits</span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: 10,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 100,
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: pct >= 100 ? "#16a34a" : "#1a56a0",
                    borderRadius: 100,
                  }}
                />
              </div>

              {cycleEnd && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                  Renewal cycle ends {cycleEnd}
                </div>
              )}
            </div>

            {/* Right: big percentage circle */}
            <div
              style={{
                width: 216,
                height: 216,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: sc.color + "18",
                border: `2px solid ${sc.color}44`,
                borderRadius: "50%",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "white", fontSize: 60, fontWeight: 900, lineHeight: 1 }}>{pct}%</span>
              <span style={{ color: sc.color, fontSize: 13, fontWeight: 700, marginTop: 6, letterSpacing: "0.08em" }}>
                {sc.label.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 18,
              marginTop: 20,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Issued {issuedDate}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              hayyamed.pro
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
    }
  );
}
