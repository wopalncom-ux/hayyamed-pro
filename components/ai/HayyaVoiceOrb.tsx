"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────────────
type OrbState = "idle" | "listening" | "thinking" | "speaking" | "error";

interface Message {
  role: "user" | "ai";
  text: string;
}

// ── Web Speech API types ──────────────────────────────────────────────────────
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}
declare const webkitSpeechRecognition: new () => SpeechRecognitionInstance;
declare const SpeechRecognition: new () => SpeechRecognitionInstance;

// ── ORB STATE COLORS ─────────────────────────────────────────────────────────
const ORB_STYLES: Record<OrbState, { bg: string; ring: string; glow: string }> = {
  idle:      { bg: "from-[#1a56a0] via-[#1e3a6e] to-[#0d1f4c]", ring: "rgba(26,86,160,0.35)", glow: "rgba(59,130,246,0.3)" },
  listening: { bg: "from-[#7c3aed] via-[#4f46e5] to-[#1a56a0]", ring: "rgba(124,58,237,0.5)", glow: "rgba(139,92,246,0.4)" },
  thinking:  { bg: "from-[#0369a1] via-[#1a56a0] to-[#1e40af]", ring: "rgba(3,105,161,0.45)", glow: "rgba(59,130,246,0.35)" },
  speaking:  { bg: "from-[#065f46] via-[#047857] to-[#0d9488]", ring: "rgba(5,150,105,0.45)", glow: "rgba(16,185,129,0.35)" },
  error:     { bg: "from-[#991b1b] via-[#dc2626] to-[#b91c1c]", ring: "rgba(220,38,38,0.4)", glow: "rgba(239,68,68,0.3)" },
};

const STATE_LABELS: Record<OrbState, string> = {
  idle:      "Tap to speak",
  listening: "Listening…",
  thinking:  "Thinking…",
  speaking:  "Speaking…",
  error:     "Try again",
};

// ── Speech synthesis helper ───────────────────────────────────────────────────
function speak(text: string, onEnd: () => void): void {
  if (!("speechSynthesis" in window)) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 1.0;
  utter.pitch = 1.0;

  // Prefer a higher-quality voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ??
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utter.voice = preferred;

  utter.onend = onEnd;
  utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

// ── Animated rings (pulse on speaking/listening) ─────────────────────────────
function PulseRings({ state }: { state: OrbState }) {
  if (state !== "listening" && state !== "speaking") return null;
  return (
    <>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${ORB_STYLES[state].ring}` }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1 + i * 0.35, opacity: 0 }}
          transition={{
            duration: 1.8,
            delay: i * 0.35,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// ── Waveform bars (shown when speaking) ──────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const bars = [4, 7, 10, 7, 12, 8, 5, 9, 6, 11, 7, 4];
  return (
    <div className="flex items-center justify-center gap-0.5 h-5" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-white/80"
          animate={active ? { height: [h * 0.5, h, h * 0.3, h * 0.8, h * 0.4] } : { height: 3 }}
          transition={active ? { duration: 0.6, delay: i * 0.06, repeat: Infinity, ease: "easeInOut" } : {}}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────="true"──────────────────────────────────────
interface HayyaVoiceOrbProps {
  plan?: string;
}

export default function HayyaVoiceOrb({ plan }: HayyaVoiceOrbProps) {
  const [open, setOpen] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPro = plan === "pro" || plan === "employer" || plan === "master_admin" || plan === "super_admin";

  useEffect(() => {
    const hasSpeech = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    setSupported(hasSpeech);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!supported) return;
    const Rec = ("SpeechRecognition" in window ? SpeechRecognition : webkitSpeechRecognition);
    const rec = new Rec();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    recRef.current = rec;

    setOrbState("listening");
    setTranscript("");

    rec.onresult = (e) => {
      const result = e.results[e.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);
      if (result.isFinal) {
        rec.stop();
        sendMessage(text);
      }
    };

    rec.onerror = () => {
      setOrbState("error");
      setTimeout(() => setOrbState("idle"), 2000);
    };

    rec.onend = () => {
      if (orbState === "listening") setOrbState("idle");
    };

    rec.start();
  }, [supported, orbState]);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    setOrbState("idle");
    setTranscript("");
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) { setOrbState("idle"); return; }

    setTranscript("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setOrbState("thinking");

    try {
      const res = await fetch("/api/ai/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errMsg = data.error ?? "Something went wrong. Please try again.";
        setMessages((prev) => [...prev, { role: "ai", text: errMsg }]);
        setOrbState("error");
        speak(errMsg, () => setOrbState("idle"));
        return;
      }

      const data = await res.json();
      const reply = data.text ?? "I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setOrbState("speaking");
      speak(reply, () => setOrbState("idle"));
    } catch {
      const errMsg = "Connection error. Please check your connection and try again.";
      setMessages((prev) => [...prev, { role: "ai", text: errMsg }]);
      setOrbState("error");
      setTimeout(() => setOrbState("idle"), 2000);
    }
  }, []);

  const handleOrbClick = useCallback(() => {
    if (orbState === "listening") { stopListening(); return; }
    if (orbState === "speaking") { window.speechSynthesis?.cancel(); setOrbState("idle"); return; }
    if (orbState === "thinking") return;
    if (!isPro) {
      window.location.href = "/pricing?source=voice_assistant";
      return;
    }
    startListening();
  }, [orbState, isPro, startListening, stopListening]);

  const styles = ORB_STYLES[orbState];

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.92 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-80 bg-[#0a1628] rounded-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden"
              style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1a56a0] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">H</span>
                  </div>
                  <span className="text-sm font-semibold text-white">Hayya AI</span>
                  <span className="text-[10px] text-white/25 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full">Voice</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setOpen(false); window.speechSynthesis?.cancel(); recRef.current?.stop(); }}
                  aria-label="Close voice assistant"
                  className="text-white/40 hover:text-white/70 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Message history */}
              <div
                ref={scrollRef}
                className="px-4 py-3 space-y-2.5 max-h-56 overflow-y-auto"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
              >
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-xs text-white/30 leading-relaxed">
                      {isPro
                        ? "Tap the orb below and ask anything about your CME compliance."
                        : "Voice assistant requires a Pro plan."}
                    </p>
                    {!isPro && (
                      <a
                        href="/pricing?source=voice_assistant"
                        className="inline-block mt-2 text-xs font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors"
                      >
                        Upgrade to Pro →
                      </a>
                    )}
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#1a56a0] text-white"
                          : "bg-white/7 text-white/75 border border-white/6"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {transcript && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-xl px-3 py-2 text-xs bg-[#1a56a0]/50 text-white/60 border border-[#1a56a0]/30 italic">
                      {transcript}
                    </div>
                  </div>
                )}
              </div>

              {/* Orb + state */}
              <div className="px-4 pb-4 pt-2 flex flex-col items-center gap-2 border-t border-white/6">
                {/* Main orb */}
                <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
                  <PulseRings state={orbState} />
                  <motion.button
                    type="button"
                    onClick={handleOrbClick}
                    aria-label={STATE_LABELS[orbState]}
                    disabled={orbState === "thinking"}
                    className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${styles.bg} flex items-center justify-center cursor-pointer disabled:cursor-wait`}
                    style={{ boxShadow: `0 0 30px ${styles.glow}, 0 0 60px ${styles.glow}` }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {orbState === "listening" && (
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                      </svg>
                    )}
                    {orbState === "thinking" && (
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((d) => (
                          <motion.div
                            key={d}
                            className="w-1.5 h-1.5 rounded-full bg-white/70"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.7, delay: d, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    )}
                    {orbState === "speaking" && (
                      <Waveform active={true} />
                    )}
                    {orbState === "idle" && (
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                      </svg>
                    )}
                    {orbState === "error" && (
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                    )}
                  </motion.button>
                </div>

                <p className="text-[11px] text-white/35 font-medium">{STATE_LABELS[orbState]}</p>

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setMessages([]); window.speechSynthesis?.cancel(); setOrbState("idle"); }}
                    className="text-[10px] text-white/20 hover:text-white/40 transition-colors"
                  >
                    Clear conversation
                  </button>
                )}

                {!supported && (
                  <p className="text-[10px] text-[#d97706] text-center">
                    Voice not supported in this browser. Try Chrome or Edge.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger orb button */}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close Hayya AI voice assistant" : "Open Hayya AI voice assistant"}
          className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${ORB_STYLES[open ? "idle" : "idle"].bg} flex items-center justify-center shadow-2xl`}
          style={{
            boxShadow: open
              ? `0 0 0 2px rgba(255,255,255,0.15), 0 0 40px ${ORB_STYLES.idle.glow}`
              : `0 4px 20px rgba(0,0,0,0.4), 0 0 30px ${ORB_STYLES.idle.glow}`,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {/* Subtle animated ring when closed */}
          {!open && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: "1.5px solid rgba(96,165,250,0.4)" }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          )}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="mic"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
