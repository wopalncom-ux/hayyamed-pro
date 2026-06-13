import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Hayya Med Pro Pricing — Free, Pro ($6/mo), and Employer plans for GCC healthcare compliance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function PricingOGImage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      highlight: false,
      features: ["10 CME activities", "License wallet", "Basic analytics"],
      color: "#64748b",
    },
    {
      name: "Pro",
      price: "$6",
      period: "/month",
      highlight: true,
      features: ["Unlimited activities", "PDF reports", "AI compliance chat"],
      color: "#1a56a0",
    },
    {
      name: "Employer",
      price: "$50",
      period: "/month",
      highlight: false,
      features: ["Team compliance grid", "Bulk PDF reports", "Staff management"],
      color: "#d97706",
    },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1f3d 0%, #1a3563 50%, #0f1f3d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "52px 64px",
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

        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            background: "radial-gradient(circle, rgba(26,86,160,0.35) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1, marginBottom: 36 }}>
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

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, zIndex: 1, marginBottom: 44 }}>
          <div style={{ color: "white", fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Simple, transparent pricing.
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 22, fontWeight: 400 }}>
            Start free. Upgrade when you need PDF reports, AI tools, and team management.
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: "flex", gap: 20, zIndex: 1, flex: 1, alignItems: "stretch" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                flex: 1,
                background: plan.highlight ? "rgba(26,86,160,0.35)" : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${plan.highlight ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 16,
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                position: "relative",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#1a56a0",
                    border: "1.5px solid rgba(96,165,250,0.5)",
                    borderRadius: 100,
                    padding: "4px 14px",
                    display: "flex",
                  }}
                >
                  <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>MOST POPULAR</span>
                </div>
              )}

              <div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ color: "white", fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 16 }}>{plan.period}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: plan.highlight ? "#60a5fa22" : "rgba(255,255,255,0.08)",
                        border: `1px solid ${plan.highlight ? "#60a5fa55" : "rgba(255,255,255,0.15)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ color: plan.highlight ? "#60a5fa" : "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 24, zIndex: 1 }}>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
            14-day free trial on Pro · No credit card required · Cancel anytime
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
