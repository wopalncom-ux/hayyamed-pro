import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

// Dynamic OG image for all SEO pages.
// Params:
//   t  = title (main headline)
//   s  = subtitle (credits/cycle summary or value proposition)
//   a  = authority badge (e.g. "ðŸ‡¶ðŸ‡¦ QCHP")
//   k  = kind tag shown top-right (e.g. "Authority Guide", "Renewal Guide")
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title    = (searchParams.get("t") ?? "CME Compliance").slice(0, 72);
  const subtitle = (searchParams.get("s") ?? "").slice(0, 110);
  const badge    = (searchParams.get("a") ?? "").slice(0, 30);
  const kind     = (searchParams.get("k") ?? "").slice(0, 30);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1f3d 0%, #1a3563 55%, #0f1f3d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "52px 72px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 520,
            height: 520,
            background: "radial-gradient(circle, rgba(26,86,160,0.38) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            background: "radial-gradient(circle, rgba(26,86,160,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top row: logo + kind tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            marginBottom: 40,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: "#1a56a0",
                borderRadius: 10,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontSize: 22, fontWeight: 800 }}>H</span>
            </div>
            <span style={{ color: "white", fontSize: 24, fontWeight: 700, letterSpacing: "-0.3px" }}>
              Hayya Med{" "}
              <span style={{ color: "#60a5fa" }}>Pro</span>
            </span>
          </div>

          {/* Kind tag */}
          {kind && (
            <div
              style={{
                display: "flex",
                background: "rgba(96,165,250,0.15)",
                border: "1px solid rgba(96,165,250,0.3)",
                borderRadius: 100,
                padding: "7px 18px",
              }}
            >
              <span style={{ color: "#93c5fd", fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {kind}
              </span>
            </div>
          )}
        </div>

        {/* Centre content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            zIndex: 1,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Authority badge */}
          {badge && (
            <div
              style={{
                display: "flex",
                width: "fit-content",
                background: "rgba(26,86,160,0.35)",
                border: "1.5px solid rgba(96,165,250,0.35)",
                borderRadius: 100,
                padding: "8px 22px",
              }}
            >
              <span style={{ color: "#bfdbfe", fontSize: 18, fontWeight: 600 }}>
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              color: "white",
              fontSize: title.length > 45 ? 46 : 58,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              maxWidth: 900,
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                color: "rgba(255,255,255,0.62)",
                fontSize: 22,
                lineHeight: 1.5,
                fontWeight: 400,
                maxWidth: 800,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            marginTop: 36,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 15 }}>
            hayyamed.pro
          </span>
          <div
            style={{
              display: "flex",
              background: "#1a56a0",
              borderRadius: 100,
              padding: "10px 24px",
            }}
          >
            <span style={{ color: "white", fontSize: 15, fontWeight: 700 }}>
              Track free â†’
            </span>
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
