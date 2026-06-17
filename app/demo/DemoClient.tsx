"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";

// ── Sample data ──────────────────────────────────────────────────────────────
const DEMO_USER = {
  name: "Dr. Ahmad Al-Rashidi",
  profession: "Cardiologist",
  country: "Qatar (QCHP)",
  avatar: "AR",
  licenseNo: "QCHP-2021-45892",
  licenseDays: 87,
  cycleStart: "Jan 2024",
  cycleEnd: "Dec 2025",
};

const QATAR_WALLET = { completed: 65, required: 80, label: "Qatar · QCHP", flag: "🇶🇦", pct: 81 };
const KSA_WALLET   = { completed: 28, required: 60, label: "Saudi Arabia · SCFHS", flag: "🇸🇦", pct: 47 };

const ACTIVITIES = [
  { id: 1, title: "Advanced Cardiac Life Support — QCHP Refresher",  credits: 8, category: "Clinical", accreditor: "QCHP Accredited",  status: "verified",  date: "15 Apr 2025" },
  { id: 2, title: "Hypertension Management in GCC Populations",       credits: 4, category: "Online",   accreditor: "Heart Foundation",  status: "verified",  date: "03 Mar 2025" },
  { id: 3, title: "Echocardiography Update — Qatar Cardiac Society",  credits: 6, category: "Conference", accreditor: "QCS",             status: "verified",  date: "22 Feb 2025" },
  { id: 4, title: "Atrial Fibrillation — New ESC Guidelines 2025",    credits: 4, category: "Online",   accreditor: "ESC / Medscape",    status: "verified",  date: "10 Jan 2025" },
  { id: 5, title: "Hospital Patient Safety Workshop",                  credits: 3, category: "Internal", accreditor: "HMC",              status: "pending",   date: "02 Jun 2025" },
];

const AI_GAPS = [
  { type: "gap",  text: "Need 15 more credits before Dec 2025 deadline", urgent: true },
  { type: "tip",  text: "Completing a QCHP-accredited ethics module covers 6 credits and is mandatory" },
  { type: "tip",  text: "SCFHS wallet is 47% — schedule 2 Saudi CME events before Q4" },
  { type: "rec",  text: "Arab Health Dubai (Jan 2026) — 12 accredited GCC CME credits in 3 days" },
];

// ── Compliance ring ──────────────────────────────────────────────────────────
function Ring({ pct, size = 120, stroke = 9, color = "#1a56a0" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (displayed / 100) * circ;

  useEffect(() => {
    let frame: number;
    let v = 0;
    const step = () => {
      v += (pct - v) * 0.07;
      setDisplayed(Math.round(v));
      if (Math.abs(v - pct) > 0.3) frame = requestAnimationFrame(step);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(step); }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, [pct]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.05s linear" }}
      />
    </svg>
  );
}

// ── Animated number ──────────────────────────────────────────────────────────
function AnimNum({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let frame: number;
    let cur = 0;
    const step = () => {
      cur += (to - cur) * 0.08;
      setV(Math.round(cur));
      if (Math.abs(cur - to) > 0.3) frame = requestAnimationFrame(step);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(step); }, 400);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, [to]);
  return <>{v}{suffix}</>;
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function Bar({ pct, color = "#1a56a0" }: { pct: number; color?: string }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 350);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ background: "#e2e8f0", borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, background: color, height: "100%", borderRadius: 99, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    verified: { bg: "#f0fdf4", color: "#16a34a", label: "Verified ✓" },
    pending:  { bg: "#fff7ed", color: "#d97706", label: "Pending Review" },
  };
  const s = cfg[status] ?? cfg.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function DemoClient() {
  const [wallet, setWallet] = useState<"qatar" | "ksa">("qatar");
  const [showPdfGate, setShowPdfGate] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);
  const trackedRef = useRef(false);
  const w = wallet === "qatar" ? QATAR_WALLET : KSA_WALLET;

  useEffect(() => {
    if (!trackedRef.current) {
      trackedRef.current = true;
      try { posthog.capture("demo_viewed", { source: "page_load" }); } catch {}
    }
  }, []);

  function trackCta(cta: string) {
    try { posthog.capture("demo_cta_clicked", { cta }); } catch {}
  }

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: "#f0f4f8", minHeight: "100vh" }}>

      {/* ── Demo banner ── */}
      <div style={{ background: "#0f1f3d", borderBottom: "1px solid #1e3a5f" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
            <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>Live Interactive Demo</span>
            <span style={{ background: "#1e3a5f", color: "#93c5fd", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 99 }}>Sample Data — Not Real</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>Ready to track your real CME?</span>
            <Link href="/register?source=demo" onClick={() => trackCta("demo_banner")}
              style={{ background: "#1a56a0", color: "white", padding: "7px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Start Free →
            </Link>
          </div>
        </div>
      </div>

      {/* ── App nav ── */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "#1a56a0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Hayya Med <span style={{ color: "#1a56a0" }}>Pro</span></span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {["Dashboard", "CME Wallet", "Licenses", "AI Analysis", "Settings"].map((item, i) => (
              <span key={item} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", color: i === 0 ? "#1a56a0" : "#64748b", background: i === 0 ? "#eff6ff" : "transparent" }}>
                {item}
              </span>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a56a0", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
              {DEMO_USER.avatar}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>

        {/* Welcome row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Good morning, {DEMO_USER.name}</h1>
            <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>{DEMO_USER.profession} · {DEMO_USER.country} · Cycle {DEMO_USER.cycleStart}–{DEMO_USER.cycleEnd}</p>
          </div>
          <Link href="/register?source=demo_header" onClick={() => trackCta("dashboard_header")}
            style={{ background: "#1a56a0", color: "white", padding: "10px 20px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Log CME Activity
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Credits Completed", value: 65, suffix: "", sub: "of 80 required this cycle", color: "#1a56a0" },
            { label: "License Expires In", value: 87, suffix: " days", sub: "QCHP-2021-45892", color: "#d97706" },
            { label: "Verified Activities", value: 4, suffix: "", sub: "1 pending admin review", color: "#16a34a" },
            { label: "Countries Tracked", value: 2, suffix: "", sub: "Qatar · Saudi Arabia", color: "#7c3aed" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: stat.color, margin: "0 0 4px", lineHeight: 1 }}>
                <AnimNum to={stat.value} suffix={stat.suffix} />
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* CME Wallet */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>CME / CPD Wallet</h2>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["qatar", "ksa"] as const).map((k) => {
                    const label = k === "qatar" ? "🇶🇦 Qatar" : "🇸🇦 KSA";
                    return (
                      <button key={k} onClick={() => setWallet(k)}
                        style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          borderColor: wallet === k ? "#1a56a0" : "#e2e8f0",
                          background: wallet === k ? "#eff6ff" : "white",
                          color: wallet === k ? "#1a56a0" : "#64748b" }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Ring pct={w.pct} size={120} stroke={10} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}><AnimNum to={w.pct} suffix="%" /></span>
                    <span style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Complete</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px" }}>{w.flag} {w.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 2px", lineHeight: 1 }}>
                    <AnimNum to={w.completed} /> <span style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}>/ {w.required} credits</span>
                  </p>
                  <p style={{ fontSize: 13, color: "#d97706", margin: "0 0 16px", fontWeight: 500 }}>
                    {w.required - w.completed} credits remaining · Deadline Dec 2025
                  </p>

                  {[
                    { label: "Clinical / Conferences", val: 20, max: 40, color: "#1a56a0" },
                    { label: "Online / eLearning", val: 28, max: 30, color: "#7c3aed" },
                    { label: "Internal / Teaching", val: wallet === "qatar" ? 17 : 0, max: 20, color: "#16a34a" },
                  ].map((cat) => (
                    <div key={cat.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{cat.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{cat.val} / {cat.max}</span>
                      </div>
                      <Bar pct={Math.min(100, Math.round((cat.val / cat.max) * 100))} color={cat.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent activities */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Recent CME Activities</h2>
                <span style={{ background: "#eff6ff", color: "#1a56a0", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>5 activities</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {ACTIVITIES.map((a, i) => (
                  <div key={a.id} style={{ padding: "14px 0", borderBottom: i < ACTIVITIES.length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: a.status === "verified" ? "#f0fdf4" : "#fff7ed", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={a.status === "verified" ? "#16a34a" : "#d97706"} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>{a.accreditor} · {a.date}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1a56a0" }}>+{a.credits}</span>
                      <Badge status={a.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF report gate */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Compliance PDF Report</h2>

              {/* Blurred preview */}
              <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <div style={{ filter: "blur(5px)", opacity: 0.4, pointerEvents: "none", padding: "20px", background: "#f8fafc" }}>
                  <div style={{ background: "#1a56a0", color: "white", padding: "12px 16px", borderRadius: 8, marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Hayya Med Pro — Compliance Report</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>Dr. Ahmad Al-Rashidi · Cardiologist · QCHP</div>
                  </div>
                  {[80, 120, 100, 60, 90].map((w, i) => (
                    <div key={i} style={{ height: 12, background: "#e2e8f0", borderRadius: 4, marginBottom: 8, width: `${w}%` }} />
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} style={{ height: 40, background: "#e2e8f0", borderRadius: 8 }} />
                    ))}
                  </div>
                </div>

                {/* Overlay */}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(248,250,252,0.85)", backdropFilter: "blur(2px)", padding: 24 }}>
                  <div style={{ width: 48, height: 48, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#1a56a0" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", margin: "0 0 6px", textAlign: "center" }}>QCHP-Ready PDF Report</p>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", textAlign: "center", maxWidth: 280 }}>Download your full compliance report formatted for QCHP, SCFHS, or DHA submission. Pro feature.</p>
                  <Link href="/register?source=demo_pdf" onClick={() => trackCta("pdf_report")}
                    style={{ background: "#1a56a0", color: "white", padding: "11px 22px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                    Unlock PDF Report — $6/month
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* License card */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 14px" }}>Active License</h3>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>🇶🇦</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Qatar — QCHP</span>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px" }}>{DEMO_USER.licenseNo}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1 }}>
                    <Bar pct={Math.round(((365 - 87) / 365) * 100)} color="#d97706" />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706", whiteSpace: "nowrap" }}>
                    <AnimNum to={87} /> days
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0" }}>Expires Sep 2025</p>
              </div>
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#c2410c", margin: "0 0 2px" }}>⚠ Renewal approaching</p>
                <p style={{ fontSize: 12, color: "#9a3412", margin: 0 }}>You need 15 more credits before renewal. AI analysis available below.</p>
              </div>
            </div>

            {/* AI gap analysis */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, background: "#eff6ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#1a56a0" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>AI Gap Analysis</h3>
                <span style={{ background: "#eff6ff", color: "#1a56a0", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, marginLeft: "auto" }}>Pro</span>
              </div>

              {AI_GAPS.slice(0, aiExpanded ? undefined : 2).map((g, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "10px 12px", borderRadius: 8,
                  background: g.type === "gap" ? "#fef2f2" : g.type === "tip" ? "#f0fdf4" : "#faf5ff",
                  border: `1px solid ${g.type === "gap" ? "#fecaca" : g.type === "tip" ? "#bbf7d0" : "#e9d5ff"}` }}>
                  <span style={{ fontSize: 14 }}>{g.type === "gap" ? "⚠️" : g.type === "tip" ? "💡" : "📅"}</span>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.5 }}>{g.text}</p>
                </div>
              ))}

              {!aiExpanded && (
                <button onClick={() => setAiExpanded(true)}
                  style={{ width: "100%", padding: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#64748b", cursor: "pointer", fontWeight: 500 }}>
                  Show 2 more insights ↓
                </button>
              )}

              <Link href="/register?source=demo_ai" onClick={() => trackCta("ai_analysis")}
                style={{ display: "block", marginTop: 12, textAlign: "center", background: "#eff6ff", color: "#1a56a0", padding: "10px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, border: "1px solid #bfdbfe" }}>
                Run Full AI Analysis on Your Data →
              </Link>
            </div>

            {/* Authorities */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>Supported Authorities</h3>
              {[
                { flag: "🇶🇦", name: "QCHP / DHP-AS", country: "Qatar", credits: "80 CPD / 2yr" },
                { flag: "🇸🇦", name: "SCFHS",         country: "Saudi Arabia", credits: "40–60 CME / yr" },
                { flag: "🇦🇪", name: "DHA · DOH",     country: "UAE",          credits: "40 CME / 2yr" },
                { flag: "🇰🇼", name: "MOH Kuwait",    country: "Kuwait",       credits: "30 CME / yr" },
                { flag: "🇧🇭", name: "NHRA",          country: "Bahrain",      credits: "40 CPD / 2yr" },
                { flag: "🇴🇲", name: "OMSB",          country: "Oman",         credits: "40 CME / 2yr" },
              ].map((a) => (
                <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 18 }}>{a.flag}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{a.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{a.credits}</p>
                  </div>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{ background: "#0f1f3d", borderRadius: 16, padding: "40px 32px", marginTop: 32, textAlign: "center" }}>
          <p style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>
            You just saw the real product
          </p>
          <h2 style={{ color: "white", fontSize: 28, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
            Start tracking your CME today.<br />
            <span style={{ color: "#60a5fa" }}>Free forever. No credit card.</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 15, margin: "0 0 28px" }}>
            Join healthcare professionals across Qatar, Saudi Arabia, and the UAE who use Hayya Med Pro to stay compliant.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register?source=demo_bottom" onClick={() => trackCta("bottom_signup")}
              style={{ background: "#1a56a0", color: "white", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 700 }}>
              Create Free Account →
            </Link>
            <Link href="/pricing" onClick={() => trackCta("bottom_pricing")}
              style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 600, border: "1px solid rgba(255,255,255,0.12)" }}>
              View Pricing
            </Link>
          </div>
          <p style={{ color: "#475569", fontSize: 12, margin: "20px 0 0" }}>
            Free plan includes: unlimited CME tracking · license countdown · 10 verified activities/year
          </p>
        </div>

      </div>
    </div>
  );
}
