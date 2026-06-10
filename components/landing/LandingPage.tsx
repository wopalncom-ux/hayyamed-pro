"use client";

import { motion, useInView, MotionConfig } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Animated counter ────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  duration = 1800,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

// ── Fade-in wrapper ─────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const AUTHORITIES = [
  "QCHP Qatar", "SCFHS Saudi Arabia", "DHA Dubai", "DOH Abu Dhabi",
  "NHRA Bahrain", "OMSB Oman", "MOH Kuwait", "QCHP Qatar", "SCFHS Saudi Arabia",
  "DHA Dubai", "DOH Abu Dhabi", "NHRA Bahrain", "OMSB Oman", "MOH Kuwait",
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "CME Wallet",
    desc: "Log every conference, workshop, and online course. Auto-enforces category caps per authority.",
    badge: "Core",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "License Wallet",
    desc: "Visual countdown to expiry. Alerts at 90, 30, and 7 days — across every license you hold.",
    badge: "Core",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Compliance AI",
    desc: "Ask \"Am I on track?\" and get a personalised answer grounded in your actual activity history.",
    badge: "Pro",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Analytics",
    desc: "Monthly credit pace, projected completion, gap analysis by category — at a glance.",
    badge: "Core",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    ),
    title: "Employer Dashboard",
    desc: "Hospitals view staff compliance in real time — with professionals in full control of their privacy.",
    badge: "Employer",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "PDF Reports",
    desc: "One-click QCHP-ready compliance PDF. Attach to your renewal submission — no manual formatting.",
    badge: "Pro",
  },
];

const COUNTRIES = [
  { name: "Qatar", body: "QCHP", cycle: "2-year cycle · 80 CPD credits", color: "#8b0000" },
  { name: "Saudi Arabia", body: "SCFHS", cycle: "1–3 year cycle · 40–60 credits", color: "#006c35" },
  { name: "UAE (Dubai)", body: "DHA", cycle: "2-year cycle · 40 credits", color: "#003087" },
  { name: "UAE (Abu Dhabi)", body: "DOH", cycle: "1–2 year cycle · 30–50 CPD", color: "#003087" },
  { name: "Kuwait", body: "MOH", cycle: "1-year cycle · 30 credits", color: "#007a3d" },
  { name: "Bahrain", body: "NHRA", cycle: "2-year cycle · 40 CPD credits", color: "#ce1126" },
  { name: "Oman", body: "OMSB", cycle: "2-year cycle · 40 credits", color: "#db161b" },
];

const BADGE_COLORS: Record<string, string> = {
  Core: "bg-[#e8f0fe] text-[#1a56a0]",
  Pro: "bg-[#fdf4ff] text-[#7c3aed]",
  Employer: "bg-[#fff7ed] text-[#d97706]",
};

const CHAT_MESSAGES = [
  { role: "user", text: "Am I on track for my QCHP renewal?" },
  { role: "ai", text: "You have 52 of 80 required CPD credits — 65% complete with 9 months left in your 2-year cycle. At your current pace of 5.2 credits/month you will reach 80 credits in approximately 5.4 months. You are on track." },
  { role: "user", text: "What categories am I missing?" },
  { role: "ai", text: "Your Category 1 (clinical/scientific) is strong at 38 credits. Category 2 needs 8 more credits. I recommend adding one online CME course (3–5 credits) and attending the upcoming QCHP-approved webinar series." },
];

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className={`font-bold text-base tracking-tight transition-colors ${scrolled ? "text-[#111]" : "text-white"}`}>
            Hayya Med <span className={scrolled ? "text-[#1a56a0]" : "text-[#60a5fa]"}>PRO</span>
          </span>
        </a>

        <nav className={`hidden sm:flex items-center gap-7 text-sm transition-colors ${scrolled ? "text-[#64748b]" : "text-white/80"}`}>
          <a href="#features" className="hover:text-[#1a56a0] transition-colors">Features</a>
          <a href="#countries" className="hover:text-[#1a56a0] transition-colors">Coverage</a>
          <a href="/pricing" className="hover:text-[#1a56a0] transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className={`text-sm hidden sm:block transition-colors ${scrolled ? "text-[#64748b] hover:text-[#111]" : "text-white/80 hover:text-white"}`}
          >
            Sign in
          </a>
          <a
            href="/register"
            className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors shadow-sm"
          >
            Get started free
          </a>
        </div>
      </div>
    </header>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const words = ["Your", "CME", "compliance,", "sorted."];

  return (
    <section className="relative bg-[#0f1f3d] min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1a56a0]/25 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#1e3a6e]/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-white/8 border border-white/12 text-[#93c5fd] text-xs font-semibold px-4 py-2 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          QCHP · SCFHS · DHA · DOH · NHRA · OMSB · MOH Kuwait
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6 text-white">
          {words.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block mr-[0.3em] ${word === "sorted." ? "text-[#60a5fa]" : ""}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Track CME credits, manage license renewals, and generate compliance reports — built for healthcare
          professionals across Qatar and the GCC.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="/register"
            className="bg-white text-[#1a56a0] px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-all shadow-xl shadow-black/20"
          >
            Start tracking for free
          </a>
          <a
            href="/pricing"
            className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-base hover:border-white/40 hover:bg-white/5 transition-all"
          >
            View pricing
          </a>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-white/30 text-sm mt-3"
        >
          Free forever · No credit card required
        </motion.p>
      </div>

      {/* Dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto mt-14"
      >
        <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/40">Renewal cycle: 2025-01-01 → 2026-12-31</p>
              <p className="text-xs text-white/40">Medicine · Cardiology · QA (QCHP CPD)</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#dcfce7]/15 text-[#4ade80] border border-[#4ade80]/20">
              ON TRACK
            </span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-white">52</span>
            <span className="text-xl text-white/40 mb-0.5">/ 80 CPD credits</span>
            <span className="text-sm text-white/30 mb-0.5 ml-auto">65%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
              className="bg-[#60a5fa] h-2.5 rounded-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Activities logged", val: "21" },
              { label: "Avg / month", val: "5.2 credits" },
              { label: "Days remaining", val: "274" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 rounded-lg p-3 border border-white/8">
                <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold text-white">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Trust bar ───────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <section className="bg-[#0a1628] border-y border-white/8 py-5 overflow-hidden">
      <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
        {AUTHORITIES.map((name, i) => (
          <span
            key={i}
            className="text-sm font-semibold text-white/30 tracking-wider uppercase px-6"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

// ── Stats ───────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { n: 7, suffix: "", label: "GCC Countries" },
    { n: 8, suffix: "", label: "Licensing Authorities" },
    { n: 80, suffix: "", label: "Max CPD Credits tracked" },
    { n: 100, suffix: "%", label: "Free to get started" },
  ];

  return (
    <section className="bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-14">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        {items.map(({ n, suffix, label }, i) => (
          <FadeUp key={label} delay={i * 0.08} className="text-center">
            <div className="text-4xl font-bold text-[#1a56a0] tabular-nums">
              <AnimatedCounter target={n} suffix={suffix} />
            </div>
            <p className="text-sm text-[#64748b] mt-1">{label}</p>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ── Features ────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="px-6 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-sm font-semibold text-[#1a56a0] uppercase tracking-widest mb-3">Platform</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Everything you need for renewal readiness
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-lg">
            Purpose-built for GCC healthcare professionals who cannot afford to miss a renewal deadline.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc, badge }, i) => (
            <FadeUp key={title} delay={i * 0.07}>
              <div className="group h-full bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0] hover:border-[#1a56a0]/35 hover:shadow-lg hover:shadow-blue-900/8 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a56a0] flex items-center justify-center group-hover:bg-[#1a56a0] group-hover:text-white transition-colors duration-300">
                    {icon}
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${BADGE_COLORS[badge]}`}>
                    {badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#111] mb-2">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── AI Spotlight ─────────────────────────────────────────────────────────────
function AISpotlight() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const tick = () => {
      i++;
      setVisible(i);
      if (i < CHAT_MESSAGES.length) setTimeout(tick, 900);
    };
    setTimeout(tick, 400);
  }, [inView]);

  return (
    <section className="bg-[#0f1f3d] px-6 py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left text */}
        <FadeUp>
          <p className="text-sm font-semibold text-[#60a5fa] uppercase tracking-widest mb-4">AI Compliance Assistant</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5 leading-tight">
            Ask anything about your renewal — get a real answer.
          </h2>
          <p className="text-white/55 text-lg leading-relaxed mb-6">
            Your compliance AI knows your activity history, your licensing authority&apos;s rules, and your remaining
            cycle time. It gives answers grounded in facts, not generic advice.
          </p>
          <ul className="space-y-3">
            {[
              "Am I on track for my QCHP renewal?",
              "Which CME categories am I missing credits in?",
              "What activities count towards Cat 1 in SCFHS?",
            ].map((q) => (
              <li key={q} className="flex items-start gap-3 text-white/60 text-sm">
                <span className="text-[#60a5fa] mt-0.5">→</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-white/30 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            Available on Pro plan · Powered by Claude Sonnet
          </div>
        </FadeUp>

        {/* Right chat demo */}
        <FadeUp delay={0.15}>
          <div ref={ref} className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-white/8">
              <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="text-xs text-white/40 font-medium">Compliance AI · Hayya Med PRO</span>
            </div>
            {CHAT_MESSAGES.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={visible > i ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1a56a0] text-white"
                      : "bg-white/8 text-white/80 border border-white/8"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {visible < CHAT_MESSAGES.length && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Create your account",
      desc: "Sign up free in under 2 minutes. No credit card required. Your data stays yours.",
    },
    {
      n: "02",
      title: "Configure your wallet",
      desc: "Select your profession, licensing authority, and renewal cycle. Your CME wallet configures automatically.",
    },
    {
      n: "03",
      title: "Log activities & stay compliant",
      desc: "Add CME activities as you complete them. Track caps, gaps, and your renewal timeline in real time.",
    },
  ];

  return (
    <section className="px-6 py-20 bg-[#f8fafc] border-y border-[#e2e8f0]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-sm font-semibold text-[#1a56a0] uppercase tracking-widest mb-3">Setup</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Up and running in minutes
          </h2>
          <p className="text-[#64748b] text-lg">No complex setup. No IT department required.</p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-7 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent" />

          {steps.map(({ n, title, desc }, i) => (
            <FadeUp key={n} delay={i * 0.1} className="text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-[#1a56a0] text-white text-lg font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-900/20 relative z-10">
                {n}
              </div>
              <h3 className="text-base font-semibold text-[#111] mb-2">{title}</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Countries ────────────────────────────────────────────────────────────────
function Countries() {
  return (
    <section id="countries" className="px-6 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-sm font-semibold text-[#1a56a0] uppercase tracking-widest mb-3">Coverage</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111] tracking-tight mb-4">
            GCC-wide compliance rules, built in
          </h2>
          <p className="text-[#64748b] max-w-xl mx-auto text-lg">
            Each authority has its own cycle, credit requirements, and category caps.
            We track every one — no manual configuration.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {COUNTRIES.map(({ name, body, cycle }, i) => (
            <FadeUp key={`${name}-${body}`} delay={i * 0.06}>
              <div className="group bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#1a56a0]/40 hover:shadow-md hover:shadow-blue-900/6 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#111]">{name}</p>
                  <span className="text-xs font-bold text-[#1a56a0] bg-[#e8f0fe] px-2.5 py-1 rounded-full">
                    {body}
                  </span>
                </div>
                <p className="text-xs text-[#64748b]">{cycle}</p>
              </div>
            </FadeUp>
          ))}
          {/* Coming soon */}
          <FadeUp delay={0.42}>
            <div className="bg-[#f8fafc] rounded-xl border border-dashed border-[#e2e8f0] p-5">
              <p className="text-sm font-semibold text-[#94a3b8] mb-1">More countries</p>
              <p className="text-xs text-[#94a3b8]">UK · India · Australia · EU — coming soon</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Employer Section ─────────────────────────────────────────────────────────
function EmployerSection() {
  const capabilities = [
    "Real-time staff compliance overview",
    "Assign CME tasks with credit targets",
    "Send compliance reminders to individuals",
    "Export team compliance report as PDF",
    "Professionals control their own privacy settings",
  ];

  return (
    <section className="bg-[#f0f6ff] border-y border-[#d0e4fa] px-6 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <FadeUp>
          <p className="text-sm font-semibold text-[#1a56a0] uppercase tracking-widest mb-4">For Employers</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111] tracking-tight mb-5 leading-tight">
            Compliance visibility for the whole team — without the spreadsheets.
          </h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-7">
            Hospitals, clinics, and health networks get a live view of staff renewal status
            — with each professional keeping full control of their own data.
          </p>
          <ul className="space-y-3 mb-8">
            {capabilities.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-[#374151]">
                <span className="w-5 h-5 rounded-full bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {c}
              </li>
            ))}
          </ul>
          <a
            href="/pricing"
            className="inline-block bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-sm"
          >
            Explore Employer plan →
          </a>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg shadow-blue-900/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <p className="text-sm font-semibold text-[#111]">Staff Compliance Overview</p>
              <span className="text-xs text-[#64748b]">Hamad General Hospital</span>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {[
                { name: "Dr. Sarah Al-Mansoori", role: "Cardiologist", pct: 82, status: "on_track" },
                { name: "Dr. Ahmed Khalid", role: "Emergency Med.", pct: 45, status: "at_risk" },
                { name: "Nurse Fatima Hassan", role: "ICU Nursing", pct: 100, status: "compliant" },
                { name: "Dr. Omar Saleh", role: "Pediatrics", pct: 20, status: "non_compliant" },
              ].map(({ name, role, pct, status }) => (
                <div key={name} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-xs font-bold text-[#1a56a0] flex-shrink-0">
                    {name.split(" ")[1]?.[0] ?? name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#111] truncate">{name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-[#f1f5f9] rounded-full h-1.5 hidden sm:block">
                      <div
                        className={`h-1.5 rounded-full ${
                          status === "compliant" ? "bg-[#16a34a]"
                          : status === "on_track" ? "bg-[#1a56a0]"
                          : status === "at_risk" ? "bg-[#d97706]"
                          : "bg-[#dc2626]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      status === "compliant" ? "bg-[#dcfce7] text-[#16a34a]"
                      : status === "on_track" ? "bg-[#e8f0fe] text-[#1a56a0]"
                      : status === "at_risk" ? "bg-[#fff7ed] text-[#d97706]"
                      : "bg-[#fef2f2] text-[#dc2626]"
                    }`}>
                      {pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever free",
      highlight: false,
      features: ["CME wallet & tracking", "Compliance dashboard", "Analytics & charts", "Employer linking", "License wallet"],
      cta: "Get started free",
      href: "/register",
    },
    {
      name: "Pro",
      price: "$49",
      period: "/year · ≈ $4/month",
      highlight: true,
      features: ["Everything in Free", "PDF compliance reports", "AI compliance chat", "License expiry alerts", "Priority support"],
      cta: "Get Pro — $49/year",
      href: "/pricing",
    },
    {
      name: "Employer",
      price: "Custom",
      period: "per organisation",
      highlight: false,
      features: ["Everything in Pro (per staff)", "Staff compliance dashboard", "Task assignment & reminders", "Bulk PDF export", "HRIS integration"],
      cta: "Contact sales",
      href: "/pricing",
    },
  ];

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-sm font-semibold text-[#1a56a0] uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Start free. Upgrade when you need more.
          </h2>
          <p className="text-[#64748b] text-lg">
            CME tracking is free forever. Upgrade for PDF reports, AI chat, and employer features.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map(({ name, price, period, highlight, features, cta, href }, i) => (
            <FadeUp key={name} delay={i * 0.08}>
              <div
                className={`h-full rounded-2xl p-7 flex flex-col border ${
                  highlight
                    ? "bg-[#1a56a0] border-[#1a56a0] shadow-xl shadow-blue-900/25"
                    : "bg-white border-[#e2e8f0]"
                }`}
              >
                <div className="mb-5">
                  <p className={`text-sm font-medium mb-1 ${highlight ? "text-white/70" : "text-[#64748b]"}`}>{name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${highlight ? "text-white" : "text-[#111]"}`}>{price}</span>
                    <span className={`text-sm ${highlight ? "text-white/50" : "text-[#94a3b8]"}`}>{period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${highlight ? "text-white/85" : "text-[#374151]"}`}>
                      <span className={highlight ? "text-[#86efac]" : "text-[#16a34a]"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={href}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                    highlight
                      ? "bg-white text-[#1a56a0] hover:bg-blue-50"
                      : "border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
                  }`}
                >
                  {cta}
                </a>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ──────────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative bg-[#0f1f3d] px-6 py-24 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="absolute inset-0 bg-[#1a56a0]/15 blur-3xl pointer-events-none" />
      <FadeUp className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
          Don&apos;t let your license lapse.
        </h2>
        <p className="text-white/55 text-lg mb-10 leading-relaxed">
          Join healthcare professionals across Qatar and the GCC who track their CME compliance with Hayya Med PRO.
        </p>
        <a
          href="/register"
          className="inline-block bg-white text-[#1a56a0] px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-2xl shadow-black/30"
        >
          Create your free account
        </a>
        <p className="text-white/25 text-sm mt-4">No credit card · Cancel anytime</p>
      </FadeUp>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-[#e2e8f0] px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#94a3b8] mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="font-semibold text-[#1a56a0]">Hayya Med PRO</span>
        </div>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <a href="#features" className="hover:text-[#111] transition-colors">Features</a>
          <a href="#countries" className="hover:text-[#111] transition-colors">Coverage</a>
          <a href="/pricing" className="hover:text-[#111] transition-colors">Pricing</a>
          <a href="/login" className="hover:text-[#111] transition-colors">Sign in</a>
          <a href="/register" className="hover:text-[#111] transition-colors">Register</a>
          <a href="/terms" className="hover:text-[#111] transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-[#111] transition-colors">Privacy</a>
        </div>
        <p>© {new Date().getFullYear()} Hayya Med. All rights reserved.</p>
      </div>
      <p className="text-center text-xs text-[#94a3b8] max-w-2xl mx-auto">
        Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace
        official licensing authorities. Users must verify final requirements with their relevant regulatory body
        (QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait).
      </p>
    </footer>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
      <Nav />
      <Hero />
      <TrustBar />
      <Stats />
      <Features />
      <HowItWorks />
      <AISpotlight />
      <Countries />
      <EmployerSection />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
    </MotionConfig>
  );
}
