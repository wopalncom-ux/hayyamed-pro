import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Create your free Hayya Med Pro account — CME tracking for GCC healthcare professionals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function RegisterOGImage() {
  const steps = [
    { n: "1", label: "Create account", sub: "Free in 30 seconds" },
    { n: "2", label: "Set up your CME wallet", sub: "Country + profession" },
    { n: "3", label: "Log your first activity", sub: "Track credits instantly" },
  ];

  const authorities = ["QCHP", "SCFHS", "DHA", "DOH", "NHRA", "OMSB", "MOH"];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1f3d 0%, #1a3563 50%, #0f1f3d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 450,
            height: 450,
            background: "radial-gradient(circle, rgba(26,86,160,0.35) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1, marginBottom: 40 }}>
          <div
            style={{
              background: "#1a56a0",
              borderRadius: 10,
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ color: "white", fontSize: 22, fontWeight: 800 }}>H</div>
          </div>
          <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>
            Hayya Med <span style={{ color: "#60a5fa" }}>Pro</span>
          </span>
        </div>

        {/* Two column layout */}
        <div style={{ display: "flex", gap: 60, flex: 1, zIndex: 1 }}>
          {/* Left */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div
              style={{
                background: "rgba(22,163,74,0.15)",
                border: "1px solid rgba(22,163,74,0.3)",
                borderRadius: 100,
                padding: "6px 16px",
                display: "inline-flex",
                width: "fit-content",
                marginBottom: 20,
              }}
            >
              <span style={{ color: "#4ade80", fontSize: 14, fontWeight: 600 }}>Free to start · No credit card</span>
            </div>

            <div style={{ color: "white", fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 20 }}>
              Start tracking your
              {" "}<span style={{ color: "#60a5fa" }}>CME compliance</span>
              {" "}today.
            </div>

            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 20, lineHeight: 1.5, marginBottom: 32 }}>
              Join GCC healthcare professionals already tracking CPD credits across 7 countries and 8 licensing authorities.
            </div>

            {/* Authorities strip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {authorities.map((a) => (
                <div
                  key={a}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    display: "flex",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: steps */}
          <div
            style={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {steps.map((step, i) => (
              <div
                key={step.n}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: i === 0 ? "#1a56a0" : "rgba(26,86,160,0.25)",
                    border: `1.5px solid ${i === 0 ? "rgba(96,165,250,0.5)" : "rgba(26,86,160,0.3)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "white", fontSize: 16, fontWeight: 800 }}>{step.n}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ color: "white", fontSize: 17, fontWeight: 700 }}>{step.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>{step.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
