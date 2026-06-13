"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, MotionConfig } from "framer-motion";
import Link from "next/link";

// ── Reduced-motion hook ──────────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setValue(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration, reduced]);

  return <span ref={ref}>{value}{suffix}</span>;
}

// ── FadeUp ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── 3-D tilt card ────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 320, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 320, damping: 30 });
  const reduced = useReducedMotion();

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my, reduced]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Magnetic button ──────────────────────────────────────────────────────────
function MagneticButton({ children, href, className = "" }: { children: React.ReactNode; href: string; className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 350, damping: 25 });
  const sy = useSpring(my, { stiffness: 350, damping: 25 });
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.28);
    my.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.a ref={ref} href={href} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </motion.a>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const AUTHORITIES = [
  "QCHP Qatar", "SCFHS Saudi Arabia", "DHA Dubai", "DOH Abu Dhabi",
  "NHRA Bahrain", "OMSB Oman", "MOH Kuwait", "QCHP Qatar", "SCFHS Saudi Arabia",
  "DHA Dubai", "DOH Abu Dhabi", "NHRA Bahrain", "OMSB Oman", "MOH Kuwait",
];

const FEATURES = [
  {
    icon: <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />,
    extra: <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />,
    title: "CME Wallet",
    desc: "Log every conference, workshop, and online course. Auto-enforces category caps per authority.",
    badge: "Core",
  },
  {
    icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    extra: null,
    title: "License Wallet",
    desc: "Visual countdown to expiry. Alerts at 90, 30, and 7 days — across every license you hold.",
    badge: "Core",
  },
  {
    icon: <><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" /></>,
    extra: null,
    title: "Compliance AI",
    desc: "Ask \"Am I on track?\" and get a personalised answer grounded in your actual activity history.",
    badge: "Pro",
  },
  {
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />,
    extra: null,
    title: "Analytics",
    desc: "Monthly credit pace, projected completion, gap analysis by category — at a glance.",
    badge: "Core",
  },
  {
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" /><path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round" /></>,
    extra: null,
    title: "Employer Dashboard",
    desc: "Hospitals view staff compliance in real time — with professionals in full control of their privacy.",
    badge: "Employer",
  },
  {
    icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    extra: null,
    title: "PDF Reports",
    desc: "One-click QCHP-ready compliance PDF. Attach to your renewal submission — no manual formatting.",
    badge: "Pro",
  },
];

const BADGE_COLORS: Record<string, string> = {
  Core: "bg-[#e8f0fe] text-[#1a56a0]",
  Pro: "bg-[#fdf4ff] text-[#7c3aed]",
  Employer: "bg-[#fff7ed] text-[#d97706]",
};

const COUNTRIES = [
  { name: "Qatar", body: "QCHP", cycle: "2-year · 80 CPD credits", flag: "🇶🇦", href: "/qchp" },
  { name: "Saudi Arabia", body: "SCFHS", cycle: "1–3 year · 40–60 credits", flag: "🇸🇦", href: "/scfhs" },
  { name: "UAE (Dubai)", body: "DHA", cycle: "2-year · 40 credits", flag: "🇦🇪", href: "/dha" },
  { name: "UAE (Abu Dhabi)", body: "DOH", cycle: "1–2 year · 30–50 CPD", flag: "🇦🇪", href: "/doh" },
  { name: "Kuwait", body: "MOH", cycle: "1-year · 30 credits", flag: "🇰🇼", href: "/moh-kuwait" },
  { name: "Bahrain", body: "NHRA", cycle: "2-year · 40 CPD credits", flag: "🇧🇭", href: "/nhra" },
  { name: "Oman", body: "OMSB", cycle: "2-year · 40 credits", flag: "🇴🇲", href: "/omsb" },
];

const CHAT_MESSAGES = [
  { role: "user", text: "Am I on track for my QCHP renewal?" },
  { role: "ai", text: "You have 52 of 80 required CPD credits — 65% complete with 9 months left. At 5.2 credits/month you'll reach 80 in ~5.4 months. You are on track." },
  { role: "user", text: "Which categories am I missing?" },
  { role: "ai", text: "Category 2 needs 8 more credits. One online CME course (3–5 credits) plus the upcoming QCHP-approved webinar series would close the gap." },
];

// ── Nav ──────────────────────────────────────────────────────────────────────
const MOB_NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#countries", label: "Coverage" },
  { href: "/cme-tracker", label: "CME Guides" },
  { href: "/employers", label: "For Employers" },
  { href: "/pricing", label: "Pricing" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 30);
      if (window.scrollY > 80) setMobileOpen(false);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled || mobileOpen ? "rgba(255,255,255,0.97)" : "transparent",
        borderBottomColor: scrolled || mobileOpen ? "rgba(226,232,240,1)" : "transparent",
        boxShadow: scrolled || mobileOpen ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
      }}
      transition={{ duration: 0.25 }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Hayya Med Pro — home">
          <motion.div
            className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="text-white text-sm font-bold" aria-hidden="true">H</span>
          </motion.div>
          <span className={`font-bold text-base tracking-tight transition-colors duration-300 ${scrolled || mobileOpen ? "text-[#111]" : "text-white"}`}>
            Hayya Med <span className={scrolled || mobileOpen ? "text-[#1a56a0]" : "text-[#60a5fa]"}>Pro</span>
          </span>
        </Link>

        <nav className={`hidden sm:flex items-center gap-7 text-sm transition-colors duration-300 ${scrolled ? "text-[#64748b]" : "text-white/75"}`} aria-label="Main navigation">
          <a href="#features" className="hover:text-[#1a56a0] transition-colors">Features</a>
          <a href="#countries" className="hover:text-[#1a56a0] transition-colors">Coverage</a>
          <Link href="/cme-tracker" className="hover:text-[#1a56a0] transition-colors">CME Guides</Link>
          <Link href="/employers" className="hover:text-[#1a56a0] transition-colors">For Employers</Link>
          <Link href="/pricing" className="hover:text-[#1a56a0] transition-colors">Pricing</Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className={`text-sm transition-colors duration-300 ${scrolled ? "text-[#64748b] hover:text-[#111]" : "text-white/75 hover:text-white"}`}
          >
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link
              href="/register"
              className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/25"
            >
              Get started free
            </Link>
          </motion.div>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/register"
            className="text-sm bg-[#1a56a0] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors"
          >
            Start free
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg text-[#374151] hover:bg-[#f1f5f9] transition-colors"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden sm:hidden border-t border-[#e2e8f0] bg-white"
          >
            <nav className="px-6 py-4 flex flex-col" aria-label="Mobile navigation">
              {MOB_NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm text-[#374151] hover:text-[#1a56a0] py-3 border-b border-[#f1f5f9] last:border-0 transition-colors font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/register"
                  className="block text-center text-sm bg-[#1a56a0] text-white py-3 rounded-xl font-semibold hover:bg-[#1547a0] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started free →
                </Link>
                <Link
                  href="/login"
                  className="block text-center text-sm text-[#64748b] hover:text-[#111] py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // GSAP: parallax + float on hero orbs
  useEffect(() => {
    if (reduced) return;
    let gsapInstance: typeof import("gsap").gsap | null = null;
    let rafIds: number[] = [];

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;

        if (!orb1.current || !orb2.current || !orb3.current) return;

        // Floating loops
        gsap.to(orb1.current, { x: 40, y: -30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(orb2.current, { x: -30, y: 25, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
        gsap.to(orb3.current, { x: 20, y: -15, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4 });

        // Scroll parallax
        ScrollTrigger.create({
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            if (!orb1.current || !orb2.current) return;
            gsap.set(orb1.current, { y: self.progress * -120 });
            gsap.set(orb2.current, { y: self.progress * -60 });
          },
        });
      });
    });

    return () => {
      rafIds.forEach(cancelAnimationFrame);
      if (gsapInstance) {
        // @ts-ignore
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.getAll().forEach((t: { kill: () => void }) => t.kill()));
        [orb1.current, orb2.current, orb3.current].forEach((el) => { if (el) gsapInstance!.killTweensOf(el); });
      }
    };
  }, [reduced]);

  const words = ["Your", "CME", "compliance,", "sorted."];

  return (
    <section id="hero" className="relative bg-[#0a1628] min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
        aria-hidden="true"
      />

      {/* Animated orbs */}
      <div ref={orb1} className="absolute pointer-events-none" style={{ left: "8%", top: "15%", width: 700, height: 700, background: "radial-gradient(circle, rgba(26,86,160,0.45) 0%, transparent 65%)", filter: "blur(90px)", borderRadius: "50%" }} aria-hidden="true" />
      <div ref={orb2} className="absolute pointer-events-none" style={{ right: "5%", top: "30%", width: 500, height: 500, background: "radial-gradient(circle, rgba(14,30,72,0.55) 0%, transparent 65%)", filter: "blur(80px)", borderRadius: "50%" }} aria-hidden="true" />
      <div ref={orb3} className="absolute pointer-events-none" style={{ left: "40%", bottom: "5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(30,58,110,0.4) 0%, transparent 65%)", filter: "blur(100px)", borderRadius: "50%" }} aria-hidden="true" />

      {/* Subtle moving gradient mesh (CSS animation) */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(26,86,160,0.08) 0%, transparent 50%, rgba(14,30,72,0.12) 100%)", animation: reduced ? "none" : "gradientShift 15s ease-in-out infinite alternate" }} aria-hidden="true" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="inline-flex items-center gap-2 border border-white/10 bg-white/6 backdrop-blur-sm text-[#93c5fd] text-xs font-semibold px-4 py-2 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ animation: reduced ? "none" : "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
          QCHP · SCFHS · DHA · DOH · NHRA · OMSB · MOH Kuwait
        </motion.div>

        {/* Headline with stagger */}
        <h1 className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6 text-white">
          {words.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block mr-[0.28em] ${word === "sorted." ? "text-[#60a5fa]" : ""}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.56, ease: "easeOut" }}
          className="text-lg sm:text-xl text-white/55 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Track CME credits, manage license renewals, and generate compliance reports —
          built for healthcare professionals across Qatar and the GCC.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.72 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <MagneticButton
            href="/register"
            className="bg-white text-[#1a56a0] px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-2xl shadow-black/25 cursor-pointer inline-block"
          >
            Start tracking for free
          </MagneticButton>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/pricing"
              className="border border-white/15 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-base hover:border-white/30 hover:bg-white/8 transition-all inline-block"
            >
              View pricing →
            </Link>
          </motion.div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.92 }}
          className="text-white/25 text-sm mt-3"
        >
          Free forever · No credit card required
        </motion.p>
      </div>

      {/* Floating dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 52 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.88, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto mt-14"
        style={reduced ? {} : { animation: "floatCard 6s ease-in-out infinite" }}
      >
        <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50" style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/35">Renewal cycle: 2025-01-01 → 2026-12-31</p>
              <p className="text-xs text-white/35">Medicine · Cardiology · QA (QCHP CPD)</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20">ON TRACK</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-white tabular-nums">52</span>
            <span className="text-xl text-white/35 mb-0.5">/ 80 CPD credits</span>
            <span className="text-sm text-white/25 mb-0.5 ml-auto">65%</span>
          </div>
          <div className="w-full bg-white/8 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.4, delay: 1.15, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] h-2 rounded-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Activities logged", val: "21" },
              { label: "Avg / month", val: "5.2 crd" },
              { label: "Days remaining", val: "274" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/[0.04] rounded-lg p-3 border border-white/[0.06]">
                <p className="text-[10px] text-white/25 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold text-white">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Trust bar ─────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <section className="bg-[#060f20] border-y border-white/6 py-5 overflow-hidden" aria-label="Supported licensing authorities">
      <div className="flex gap-0 whitespace-nowrap" style={{ animation: "marquee 28s linear infinite" }}>
        {[...AUTHORITIES, ...AUTHORITIES].map((name, i) => (
          <span key={i} className="text-xs font-semibold text-white/22 tracking-widest uppercase px-8">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { n: 7, suffix: "", label: "GCC Countries" },
    { n: 8, suffix: "", label: "Licensing Authorities" },
    { n: 3, suffix: "", label: "min to set up" },
    { n: 100, suffix: "%", label: "Free to start" },
  ];

  return (
    <section className="bg-[#0a1628] px-6 py-16 border-b border-white/5">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map(({ n, suffix, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/[0.04] border border-white/8 rounded-2xl p-6 text-center backdrop-blur-sm"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            <p className="text-4xl font-bold text-white tabular-nums">
              <AnimatedCounter target={n} suffix={suffix} />
            </p>
            <p className="text-xs text-white/40 mt-2 leading-tight">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Why This Matters ──────────────────────────────────────────────────────────
function WhyItMatters() {
  const signals = [
    {
      path: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
      title: "Official sources only",
      desc: "Rules sourced directly from QCHP, SCFHS, DHA, NHRA, OMSB, and MOH Kuwait publications — updated when authorities update.",
    },
    {
      path: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z",
      title: "Your data, your control",
      desc: "You decide what your employer sees. Toggle visibility per field — CME progress, compliance status, specialty — at any time.",
    },
    {
      path: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3",
      title: "One-click compliance reports",
      desc: "Download a PDF formatted for QCHP, SCFHS, or DHA submission. Attach directly to your renewal application.",
    },
  ];

  return (
    <section className="bg-[#f8fafc] border-y border-[#e2e8f0] px-6 py-14">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {signals.map(({ path, title, desc }, i) => (
          <FadeUp key={title} delay={i * 0.08}>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0f1f3d] mb-1">{title}</p>
                <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Platform</p>
          <h2 className="text-3xl sm:text-[2.6rem] font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
            Everything you need for renewal readiness
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-lg leading-relaxed">
            Purpose-built for GCC healthcare professionals who cannot afford to miss a renewal deadline.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc, badge }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="h-full">
                <motion.div
                  className="group h-full bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0] cursor-default"
                  whileHover={{
                    borderColor: "rgba(26,86,160,0.3)",
                    boxShadow: "0 8px 40px rgba(26,86,160,0.08), 0 0 0 1px rgba(26,86,160,0.12)",
                    backgroundColor: "#ffffff",
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a56a0] flex items-center justify-center"
                      whileHover={{ backgroundColor: "#1a56a0", color: "#ffffff", scale: 1.08 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
                        {icon}
                      </svg>
                    </motion.div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${BADGE_COLORS[badge]}`}>{badge}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3d] mb-2">{title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── AI Spotlight ──────────────────────────────────────────────────────────────
function AISpotlight() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const tick = () => { i++; setVisible(i); if (i < CHAT_MESSAGES.length) setTimeout(tick, 950); };
    setTimeout(tick, 400);
  }, [inView]);

  return (
    <section className="bg-[#060f20] px-6 py-24 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(26,86,160,0.18) 0%, transparent 55%)" }} aria-hidden="true" />
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
        <FadeUp>
          <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-4">AI Compliance Assistant</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5 leading-tight">
            Ask anything about your renewal — get a real answer.
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-6">
            Your compliance AI knows your activity history, your licensing authority&apos;s rules, and your remaining
            cycle time. Grounded answers, not generic advice.
          </p>
          <ul className="space-y-3 mb-6">
            {["Am I on track for my QCHP renewal?", "Which categories am I missing credits in?", "What activities count towards Cat 1 in SCFHS?"].map((q) => (
              <li key={q} className="flex items-start gap-3 text-white/55 text-sm">
                <span className="text-[#60a5fa] mt-0.5 flex-shrink-0">→</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <div className="inline-flex items-center gap-2 text-xs text-white/25 bg-white/4 border border-white/8 px-4 py-2 rounded-full">
            Available on Pro · Powered by Claude Haiku
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <motion.div
            ref={ref}
            className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 space-y-4 shadow-2xl shadow-black/40"
            whileHover={{ borderColor: "rgba(96,165,250,0.25)", boxShadow: "0 0 40px rgba(96,165,250,0.06), 0 25px 60px rgba(0,0,0,0.4)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-white/7">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ animation: "pulse 2s infinite" }} />
              <span className="text-xs text-white/35 font-medium">Compliance AI · Hayya Med Pro</span>
            </div>
            {CHAT_MESSAGES.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={visible > i ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1a56a0] text-white"
                    : "bg-white/7 text-white/75 border border-white/7"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {visible < CHAT_MESSAGES.length && (
              <div className="flex justify-start">
                <div className="bg-white/7 border border-white/7 rounded-xl px-4 py-3 flex items-center gap-1.5">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 bg-white/35 rounded-full" style={{ animation: `bounce 1s ease-in-out ${d}ms infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", title: "Create your account", desc: "Sign up free in under 2 minutes. No credit card required. Your data stays yours." },
    { n: "02", title: "Configure your wallet", desc: "Select profession, licensing authority, and renewal cycle. Your CME wallet configures automatically." },
    { n: "03", title: "Log activities & stay compliant", desc: "Add CME activities as you complete them. Track caps, gaps, and your renewal timeline in real time." },
  ];

  return (
    <section className="px-6 py-24 bg-[#f8fafc] border-y border-[#e2e8f0]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Setup</p>
          <h2 className="text-3xl sm:text-[2.6rem] font-bold text-[#0f1f3d] tracking-tight mb-4">Up and running in minutes</h2>
          <p className="text-[#64748b] text-lg">No complex setup. No IT department required.</p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          <div className="hidden sm:block absolute top-7 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent" aria-hidden="true" />
          {steps.map(({ n, title, desc }, i) => (
            <FadeUp key={n} delay={i * 0.1} className="text-center relative">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-[#1a56a0] text-white text-lg font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-900/20 relative z-10"
                whileHover={{ scale: 1.08, boxShadow: "0 12px 30px rgba(26,86,160,0.35)" }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              >
                {n}
              </motion.div>
              <h3 className="text-base font-semibold text-[#0f1f3d] mb-2">{title}</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Countries ─────────────────────────────────────────────────────────────────
function Countries() {
  return (
    <section id="countries" className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Coverage</p>
          <h2 className="text-3xl sm:text-[2.6rem] font-bold text-[#0f1f3d] tracking-tight mb-4">GCC-wide compliance rules, built in</h2>
          <p className="text-[#64748b] max-w-xl mx-auto text-lg leading-relaxed">
            Each authority has its own cycle, credit requirements, and category caps. We track every one.
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COUNTRIES.map(({ name, body, cycle, flag, href }, i) => (
            <motion.div
              key={name + body}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard>
                <motion.div
                  className={`bg-white rounded-xl border border-[#e2e8f0] p-5 ${href ? "cursor-pointer" : "cursor-default"}`}
                  whileHover={{ borderColor: "rgba(26,86,160,0.35)", boxShadow: "0 6px 24px rgba(26,86,160,0.07)" }}
                  transition={{ duration: 0.2 }}
                >
                  {href ? (
                    <Link href={href} className="block">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" aria-hidden="true">{flag}</span>
                          <p className="text-sm font-semibold text-[#0f1f3d]">{name}</p>
                        </div>
                        <span className="text-xs font-bold text-[#1a56a0] bg-[#e8f0fe] px-2.5 py-1 rounded-full">{body}</span>
                      </div>
                      <p className="text-xs text-[#64748b] mb-2">{cycle}</p>
                      <p className="text-[11px] font-semibold text-[#1a56a0]">See full requirements →</p>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" aria-hidden="true">{flag}</span>
                          <p className="text-sm font-semibold text-[#0f1f3d]">{name}</p>
                        </div>
                        <span className="text-xs font-bold text-[#1a56a0] bg-[#e8f0fe] px-2.5 py-1 rounded-full">{body}</span>
                      </div>
                      <p className="text-xs text-[#64748b]">{cycle}</p>
                    </>
                  )}
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
          <FadeUp delay={0.42}>
            <div className="bg-[#f8fafc] rounded-xl border border-dashed border-[#e2e8f0] p-5">
              <p className="text-sm font-semibold text-[#94a3b8] mb-1">More countries</p>
              <p className="text-xs text-[#94a3b8]">UK · India · Australia · EU — coming soon</p>
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.5} className="text-center mt-8">
          <Link href="/countries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56a0] hover:text-[#154890] transition-colors">
            Compare all GCC CME requirements →
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Professions ───────────────────────────────────────────────────────────────
const PROFESSIONS = [
  { icon: "🩺", title: "Physicians", sub: "60/yr SCFHS · 80/2yr QCHP · 40/2yr DHA", href: "/physician-cme" },
  { icon: "👩‍⚕️", title: "Nurses",      sub: "30/yr SCFHS · 80/2yr QCHP · 20/yr Kuwait", href: "/nurse-cpd" },
  { icon: "💊", title: "Pharmacists", sub: "60/yr SCFHS · 80/2yr QCHP · 40/2yr DHA", href: "/pharmacist-cme" },
  { icon: "🦷", title: "Dentists",    sub: "60/yr SCFHS · 80/2yr QCHP · 40/2yr DHA", href: "/dentist-cme" },
  { icon: "🦿", title: "Allied Health", sub: "30/yr SCFHS · 80/2yr QCHP · 20/yr Kuwait", href: "/allied-health-cpd" },
];

function Professions() {
  return (
    <section className="px-6 py-16 bg-[#f8fafc] border-t border-[#e2e8f0]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-10">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Every Profession</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1f3d] tracking-tight mb-3">
            CME requirements by profession
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-base">
            Physician, nurse, pharmacist, dentist, or allied health — requirements vary by profession and country. See your specific guide.
          </p>
        </FadeUp>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROFESSIONS.map(({ icon, title, sub, href }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={href}
                className="block bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all group text-center"
              >
                <span className="text-2xl block mb-2">{icon}</span>
                <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors mb-1">{title}</p>
                <p className="text-[11px] text-[#94a3b8] leading-relaxed">{sub}</p>
                <p className="text-[11px] font-semibold text-[#1a56a0] mt-2 group-hover:underline">View requirements →</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Specialties ───────────────────────────────────────────────────────────────
const SPECIALTIES = [
  { icon: "❤️",  title: "Cardiology",        sub: "ACLS mandatory · ACC/ESC recognised · SCFHS/QCHP/DHA",    href: "/cardiology-cme" },
  { icon: "🩺",  title: "Internal Medicine",  sub: "SBIM recognised · SCFHS 60/yr · subspecialty CME counts",  href: "/internal-medicine-cme" },
  { icon: "🚑",  title: "Emergency Med",      sub: "ACLS + ATLS mandatory · simulation counts",                href: "/emergency-medicine-cme" },
  { icon: "🔪",  title: "Surgery",            sub: "ATLS counts · laparoscopic workshops · ACS recognised",    href: "/surgery-cme" },
  { icon: "👶",  title: "Pediatrics",         sub: "PALS + NRP mandatory · SPA/AAP recognised",               href: "/pediatrics-cme" },
  { icon: "🩻",  title: "Radiology",          sub: "Radiation safety mandatory · RSNA/ACR/ECR recognised",    href: "/radiology-cme" },
  { icon: "🧠",  title: "Psychiatry",         sub: "Ethics CPD mandatory · SMHA recognised",                  href: "/psychiatry-cme" },
  { icon: "🤱",  title: "OB / Gynecology",    sub: "ALSO + NRP mandatory · ACOG/FIGO recognised",             href: "/obstetrics-gynecology-cme" },
  { icon: "💉",  title: "Anesthesia",         sub: "ACLS mandatory · PBLD + simulation recognised",           href: "/anesthesia-cme" },
  { icon: "🦴",  title: "Orthopedics",        sub: "ATLS counts · surgical skills · SICOT/AAOS",              href: "/orthopedics-cme" },
  { icon: "🏡",  title: "Family Medicine",    sub: "Broadest CME scope · WONCA/RCGP · all categories count",  href: "/family-medicine-cme" },
  { icon: "🩺",  title: "Dermatology",        sub: "Laser + dermoscopy count · SDS/AAD/EADV recognised",       href: "/dermatology-cme" },
  { icon: "🧠",  title: "Neurology",          sub: "EEG/EMG + stroke simulation · SNS/AAN/EAN recognised",     href: "/neurology-cme" },
  { icon: "🫁",  title: "Nephrology",         sub: "Dialysis + renal biopsy count · SSNT/ERA-EDTA/ISN",        href: "/nephrology-cme" },
  { icon: "👁",  title: "Ophthalmology",      sub: "Phaco wet lab + LASIK count · SOS/AAO/ICO recognised",     href: "/ophthalmology-cme" },
];

function Specialties() {
  return (
    <section className="px-6 py-16 bg-white border-t border-[#e2e8f0]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-10">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Every Specialty</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1f3d] tracking-tight mb-3">
            CME requirements by specialty
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-base">
            Specialty-specific CME rules, mandatory activity types, and recognised accreditors — for every GCC authority.
          </p>
        </FadeUp>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SPECIALTIES.map(({ icon, title, sub, href }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={href}
                className="block bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all group text-center"
              >
                <span className="text-2xl block mb-2">{icon}</span>
                <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors mb-1">{title}</p>
                <p className="text-[11px] text-[#94a3b8] leading-relaxed">{sub}</p>
                <p className="text-[11px] font-semibold text-[#1a56a0] mt-2 group-hover:underline">View requirements →</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Employer section ──────────────────────────────────────────────────────────
function EmployerSection() {
  const capabilities = [
    "Real-time staff compliance overview",
    "Assign CME tasks with credit targets",
    "Send compliance reminders to individuals",
    "Export team compliance report as PDF",
    "Professionals control their own privacy settings",
  ];

  const staffRows = [
    { name: "Dr. Sarah Al-Mansoori", role: "Cardiologist", pct: 82, status: "on_track" },
    { name: "Dr. Ahmed Khalid", role: "Emergency Med.", pct: 45, status: "at_risk" },
    { name: "Nurse Fatima Hassan", role: "ICU Nursing", pct: 100, status: "compliant" },
    { name: "Dr. Omar Saleh", role: "Pediatrics", pct: 20, status: "non_compliant" },
  ];

  const statusStyle: Record<string, { bar: string; badge: string; label: string }> = {
    compliant:     { bar: "bg-[#16a34a]", badge: "bg-[#dcfce7] text-[#16a34a]", label: "Compliant" },
    on_track:      { bar: "bg-[#1a56a0]", badge: "bg-[#e8f0fe] text-[#1a56a0]", label: "On Track" },
    at_risk:       { bar: "bg-[#d97706]", badge: "bg-[#fff7ed] text-[#d97706]", label: "At Risk" },
    non_compliant: { bar: "bg-[#dc2626]", badge: "bg-[#fef2f2] text-[#dc2626]", label: "Non-Compliant" },
  };

  return (
    <section className="bg-[#f0f6ff] border-y border-[#d0e4fa] px-6 py-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <FadeUp>
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-4">For Employers</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight">
            Compliance visibility for the whole team — without the spreadsheets.
          </h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-7">
            Hospitals, clinics, and health networks get a live view of staff renewal status
            — with each professional keeping full control of their own data.
          </p>
          <ul className="space-y-3 mb-8">
            {capabilities.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-[#374151]">
                <span className="w-5 h-5 rounded-full bg-[#1a56a0] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                {c}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link href="/employers" className="inline-block bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/20">
                See employer features →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link href="/pricing#employer" className="inline-block border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                View employer pricing →
              </Link>
            </motion.div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <motion.div
            className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg shadow-blue-900/8 overflow-hidden"
            whileHover={{ boxShadow: "0 20px 60px rgba(26,86,160,0.12)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <p className="text-sm font-semibold text-[#0f1f3d]">Staff Compliance Overview</p>
              <span className="text-xs text-[#94a3b8]">Hamad General Hospital</span>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {staffRows.map(({ name, role, pct, status }, i) => {
                const s = statusStyle[status];
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="px-5 py-3.5 flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-xs font-bold text-[#1a56a0] flex-shrink-0">
                      {name.split(" ")[1]?.[0] ?? name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0f1f3d] truncate">{name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#f1f5f9] rounded-full h-1.5 hidden sm:block">
                        <div className={`h-1.5 rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Free", price: "$0", period: "Forever free", highlight: false,
      features: ["CME wallet & tracking", "Compliance dashboard", "Analytics & charts", "Employer linking", "License wallet"],
      cta: "Get started free", href: "/register",
    },
    {
      name: "Pro", price: "$6", period: "/month · $61.20/year", highlight: true,
      features: ["Everything in Free", "PDF compliance reports", "AI compliance chat", "License expiry alerts", "Priority support"],
      cta: "Get Pro", href: "/pricing",
    },
    {
      name: "Employer", price: "From $50", period: "/month", highlight: false,
      features: ["Everything in Pro (per staff)", "Staff compliance dashboard", "Task assignment & reminders", "Bulk PDF export", "Up to 200 staff"],
      cta: "View employer plans", href: "/pricing",
    },
  ];

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-16">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-[2.6rem] font-bold text-[#0f1f3d] tracking-tight mb-4">Start free. Upgrade when you need more.</h2>
          <p className="text-[#64748b] text-lg">CME tracking is free forever. Upgrade for PDF reports, AI chat, and employer features.</p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map(({ name, price, period, highlight, features, cta, href }, i) => (
            <FadeUp key={name} delay={i * 0.08}>
              <motion.div
                className={`h-full rounded-2xl p-7 flex flex-col border ${
                  highlight ? "bg-[#1a56a0] border-[#1a56a0] shadow-xl shadow-blue-900/20" : "bg-white border-[#e2e8f0]"
                }`}
                whileHover={!highlight ? { boxShadow: "0 8px 40px rgba(26,86,160,0.08)", borderColor: "rgba(26,86,160,0.3)" } : {}}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5">
                  {highlight && <span className="text-[10px] font-bold tracking-widest text-[#60a5fa] uppercase bg-white/10 px-2.5 py-1 rounded-full mb-3 inline-block">Most Popular</span>}
                  <p className={`text-sm font-medium mb-1 ${highlight ? "text-white/65" : "text-[#64748b]"}`}>{name}</p>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className={`text-3xl font-bold ${highlight ? "text-white" : "text-[#0f1f3d]"}`}>{price}</span>
                    <span className={`text-sm ${highlight ? "text-white/45" : "text-[#94a3b8]"}`}>{period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${highlight ? "text-white/80" : "text-[#374151]"}`}>
                      <span className={highlight ? "text-[#86efac]" : "text-[#16a34a]"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={href}
                    className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                      highlight
                        ? "bg-white text-[#1a56a0] hover:bg-blue-50"
                        : "border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {cta}
                  </Link>
                </motion.div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Is Hayya Med Pro free to use?",
    a: "Yes. The Free plan is free forever — it includes CME activity tracking, a compliance dashboard, and analytics. The Pro plan ($6/month, or $61.20/year — 15% off) unlocks PDF compliance reports, AI-powered gap analysis, unlimited activity entries, and license expiry alerts.",
  },
  {
    q: "Is there a free trial for the Pro plan?",
    a: "Yes — every new account automatically receives a 14-day Pro trial. No credit card required. You can explore every Pro feature before you pay anything.",
  },
  {
    q: "Is this platform recognised by QCHP, SCFHS, or DHA?",
    a: "Hayya Med Pro is a compliance tracking tool, not a licensing authority. Your official record lives with QCHP, SCFHS, DHA, or your local authority. Our PDF reports are formatted to match what these authorities require, making submission faster — but you must always verify final requirements directly with your authority.",
  },
  {
    q: "Which countries and licensing authorities are supported?",
    a: "Qatar (QCHP), Saudi Arabia (SCFHS), UAE Dubai (DHA), UAE Abu Dhabi (DOH), Kuwait (MOH), Bahrain (NHRA), and Oman (OMSB). Additional countries are added regularly.",
  },
  {
    q: "Can my employer or hospital see my CME records?",
    a: "Only if you explicitly approve the connection. Your profile is private by default. Privacy settings give you full control over what information — if any — is visible to your employer.",
  },
  {
    q: "What if I practise in multiple countries?",
    a: "The Pro plan supports multiple country wallets. Track your QCHP and SCFHS compliance requirements simultaneously from a single dashboard.",
  },
  {
    q: "Is my healthcare data stored securely in the GCC?",
    a: "Yes. All data is hosted on GCP infrastructure in Doha, Qatar, encrypted at rest and in transit, and processed under Qatar's Personal Data Protection Law (PDPL). Your data never leaves the GCC region.",
  },
  {
    q: "How does the AI compliance assistant work?",
    a: "The AI compliance assistant (Pro feature) answers questions about your country's CME requirements, identifies gaps in your compliance profile, and suggests activities to close those gaps. It is powered by Claude AI integrated with Hayya Med Pro's compliance rule database — and always recommends verifying final requirements with your licensing authority.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#f8fafc] px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <FadeUp className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-[#1a56a0] bg-[#eff6ff] border border-[#bfdbfe] px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">
            Everything you need to know
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            Questions from healthcare professionals across the GCC — answered.
          </p>
        </FadeUp>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FadeUp key={item.q} delay={Math.min(i * 0.05, 0.3)}>
              <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#f8fafc] transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-semibold text-[#111] text-sm leading-snug">{item.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-[#64748b]"
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-[#374151] leading-relaxed border-t border-[#f1f5f9]">
                        <p className="pt-4">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.35} className="mt-10 text-center">
          <p className="text-sm text-[#64748b]">
            Still have questions?{" "}
            <a href="/contact" className="text-[#1a56a0] font-medium hover:underline">
              Contact our team →
            </a>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative bg-[#0a1628] px-6 py-28 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "40px 40px" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(26,86,160,0.2) 0%, transparent 60%)" }} aria-hidden="true" />
      <FadeUp className="relative z-10 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-5"
        >
          Get started today
        </motion.p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
          Don&apos;t let your license lapse.
        </h2>
        <p className="text-white/45 text-lg mb-10 leading-relaxed">
          Join healthcare professionals across Qatar and the GCC who track their CME compliance with Hayya Med Pro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <MagneticButton
            href="/register"
            className="bg-white text-[#1a56a0] px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-2xl shadow-black/35 cursor-pointer inline-block"
          >
            Create your free account
          </MagneticButton>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link href="/pricing" className="text-white/55 text-sm hover:text-white/80 transition-colors">
              See all plans →
            </Link>
          </motion.div>
        </div>
        <p className="text-white/22 text-xs mt-5">No credit card · Free forever · Cancel anytime</p>
      </FadeUp>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  {
    heading: "Platform",
    links: [
      { label: "Features", href: "/#features" },
      { label: "For Employers", href: "/employers" },
      { label: "For Training Providers", href: "/for-providers" },
      { label: "For Universities", href: "/for-universities" },
      { label: "Compliance Software", href: "/healthcare-compliance-software" },
      { label: "CME Report PDF", href: "/cme-compliance-report" },
      { label: "Pricing", href: "/pricing" },
      { label: "CME Tracker", href: "/cme-tracker" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Help & FAQ", href: "/help" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "CME by Country",
    links: [
      { label: "QCHP — Qatar", href: "/qchp" },
      { label: "SCFHS — Saudi Arabia", href: "/scfhs" },
      { label: "DHA — Dubai", href: "/dha" },
      { label: "DOH — Abu Dhabi", href: "/doh" },
      { label: "MOH — Kuwait", href: "/moh-kuwait" },
      { label: "NHRA — Bahrain", href: "/nhra" },
      { label: "OMSB — Oman", href: "/omsb" },
      { label: "Compare all countries", href: "/countries" },
      { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
      { label: "GCC renewal guide", href: "/gcc-medical-license-renewal" },
    ],
  },
  {
    heading: "CME by Profession",
    links: [
      { label: "Physicians", href: "/physician-cme" },
      { label: "Nurses", href: "/nurse-cpd" },
      { label: "Pharmacists", href: "/pharmacist-cme" },
      { label: "Dentists", href: "/dentist-cme" },
      { label: "Allied Health", href: "/allied-health-cpd" },
      { label: "CME vs CPD explained", href: "/cme-vs-cpd" },
    ],
  },
  {
    heading: "CME by Specialty",
    links: [
      { label: "Cardiology", href: "/cardiology-cme" },
      { label: "Internal Medicine", href: "/internal-medicine-cme" },
      { label: "Emergency Medicine", href: "/emergency-medicine-cme" },
      { label: "Surgery", href: "/surgery-cme" },
      { label: "Pediatrics", href: "/pediatrics-cme" },
      { label: "Radiology", href: "/radiology-cme" },
      { label: "Psychiatry", href: "/psychiatry-cme" },
      { label: "OB / Gynecology", href: "/obstetrics-gynecology-cme" },
      { label: "Anesthesia", href: "/anesthesia-cme" },
      { label: "Orthopedics", href: "/orthopedics-cme" },
      { label: "Family Medicine", href: "/family-medicine-cme" },
      { label: "Dermatology", href: "/dermatology-cme" },
      { label: "Neurology", href: "/neurology-cme" },
      { label: "Nephrology", href: "/nephrology-cme" },
      { label: "Ophthalmology", href: "/ophthalmology-cme" },
    ],
  },
  {
    heading: "Renewal Guides",
    links: [
      { label: "QCHP renewal — Qatar", href: "/qchp-renewal" },
      { label: "SCFHS renewal — Saudi Arabia", href: "/scfhs-renewal" },
      { label: "DHA renewal — Dubai", href: "/dha-renewal" },
      { label: "DOH renewal — Abu Dhabi", href: "/doh-renewal" },
      { label: "All GCC renewals", href: "/gcc-medical-license-renewal" },
    ],
  },
  {
    heading: "International",
    links: [
      { label: "Global CME requirements", href: "/global-cme-requirements" },
      { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
      { label: "UK — GMC CPD", href: "/gmc-cpd" },
      { label: "Australia — AHPRA CPD", href: "/ahpra-cpd" },
      { label: "India — NMC CME", href: "/nmc-india-cme" },
      { label: "Egypt — EMS CME", href: "/egypt-cme" },
      { label: "Jordan — JMC CME", href: "/jordan-cme" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Data Processing Agreement", href: "/legal/dpa" },
      { label: "Sign in", href: "/login" },
      { label: "Register free", href: "/register" },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-[#f8fafc] border-t border-[#e2e8f0] px-6 pt-12 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Brand + columns grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center" aria-hidden="true">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed max-w-[180px]">
              CME tracking and licensing compliance for GCC healthcare professionals.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-[#94a3b8] hover:text-[#1a56a0] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e2e8f0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#94a3b8]">© {new Date().getFullYear()} Hayya Med. All rights reserved.</p>
          <p className="text-xs text-[#94a3b8] text-center max-w-xl">
            Supports CME/CPD tracking. Does not issue licenses. Verify requirements with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Global CSS keyframes (injected once) ─────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes floatCard { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-10px) } }
  @keyframes gradientShift { 0% { opacity: 0.6 } 100% { opacity: 1 } }
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition-duration: 0.01ms !important; }
  }
`;

// ── Main export ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  // Lenis smooth scroll initialization
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      let rafId: number;
      function raf(time: number) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);
      cleanup = () => { cancelAnimationFrame(rafId); lenis.destroy(); };
    });

    return () => { cleanup?.(); };
  }, []);

  return (
    <>
      {/* Keyframe injector — renders once, no layout shift */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      <MotionConfig reducedMotion="user">
        {/* Skip link */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-[#1a56a0] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg">
          Skip to main content
        </a>

        <div className="min-h-screen bg-white">
          <Nav />
          <main id="main-content">
            <Hero />
            <TrustBar />
            <Stats />
            <WhyItMatters />
            <Features />
            <HowItWorks />
            <AISpotlight />
            <Countries />
            <Professions />
            <Specialties />
            <EmployerSection />
            <Pricing />
            <FAQ />
            <FinalCTA />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </>
  );
}
