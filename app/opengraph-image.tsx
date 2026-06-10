import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Hayya Med PRO — CME Tracking & License Compliance for GCC Healthcare Professionals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1f3d 0%, #1a3563 50%, #0f1f3d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Glow orb */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(26,86,160,0.4) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        {/* Top: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
          <div style={{
            background: "#1a56a0",
            borderRadius: 12,
            width: 48, height: 48,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ color: "white", fontSize: 24, fontWeight: 800 }}>H</div>
          </div>
          <span style={{ color: "white", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
            Hayya Med <span style={{ color: "#60a5fa" }}>PRO</span>
          </span>
        </div>

        {/* Centre: Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, zIndex: 1, maxWidth: 700 }}>
          <div style={{
            background: "rgba(26,86,160,0.3)",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: 100,
            padding: "8px 20px",
            display: "inline-flex",
            width: "fit-content",
          }}>
            <span style={{ color: "#93c5fd", fontSize: 16, fontWeight: 600 }}>
              QCHP · SCFHS · DHA · DOH · NHRA · OMSB
            </span>
          </div>
          <div style={{ color: "white", fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Your CME compliance,{" "}
            <span style={{ color: "#60a5fa" }}>sorted.</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 24, lineHeight: 1.5, fontWeight: 400 }}>
            Track credits, manage license renewals, and stay compliant
            with every GCC licensing authority — in one platform.
          </div>
        </div>

        {/* Bottom: Stats */}
        <div style={{ display: "flex", gap: 40, zIndex: 1 }}>
          {[
            { n: "7", label: "GCC Countries" },
            { n: "8", label: "Licensing Authorities" },
            { n: "Free", label: "to get started" },
          ].map(({ n, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "white", fontSize: 36, fontWeight: 800 }}>{n}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
