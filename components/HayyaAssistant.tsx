"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

type Message = { role: "user" | "assistant"; content: string };
type Mode = "chat" | "voice";

const HIDDEN_PATHS = [
  "/dashboard", "/admin", "/employer", "/provider",
  "/government", "/university", "/onboarding", "/login",
  "/register", "/forgot-password", "/reset-password",
  "/verify-email", "/mfa",
];

const SUGGESTED = [
  "How many CME credits do I need in Qatar?",
  "What is the difference between CME and CPD?",
  "How does the AI certificate reader work?",
  "What does the Pro plan include?",
];

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function HayyaAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [transcript, setTranscript] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if voice is supported
  useEffect(() => {
    setVoiceSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []);

  // Hide on dashboard/auth/admin paths
  const hidden = HIDDEN_PATHS.some((p) => pathname?.startsWith(p));
  if (hidden) return null;

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, transcript]);

  // Focus input on open
  useEffect(() => {
    if (open && mode === "chat") {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, mode]);

  const speak = useCallback((text: string) => {
    if (!speakEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05;
    utt.pitch = 1;
    utt.lang = "en-US";
    // Prefer a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Samantha") || v.name.includes("Google") || v.lang === "en-US"
    );
    if (preferred) utt.voice = preferred;
    window.speechSynthesis.speak(utt);
  }, [speakEnabled]);

  const send = useCallback(async (text: string, isVoice = false) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTranscript("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/hayya-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6),
          voice: isVoice,
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? "I'm sorry, I couldn't process that request.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (isVoice || (mode === "voice" && speakEnabled)) speak(reply);
      if (!open) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, mode, open, speak, speakEnabled]);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setRecording(true);

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      if (final) {
        setRecording(false);
        send(final, true);
      }
    };

    recognition.onerror = () => {
      setRecording(false);
      setTranscript("");
    };

    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [send]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (recording) stopRecording();
    else startRecording();
  }, [recording, startRecording, stopRecording]);

  const handleOpen = () => {
    setOpen(true);
    setHasUnread(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 text-white pl-3 pr-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #1a56a0, #06b6d4)",
          boxShadow: "0 8px 32px rgba(26,86,160,0.45)",
        }}
        aria-label="Open Hayya Assistant"
      >
        <span className="relative flex items-center justify-center w-7 h-7 bg-white/20 rounded-full">
          <span className="text-sm font-black">H</span>
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#16a34a] rounded-full border-2 border-white" />
          )}
        </span>
        <span className="text-sm font-bold tracking-tight">
          {open ? "Close" : "Hayya Assistant"}
        </span>
        {!open && (
          <span className="flex gap-0.5 items-end h-3.5">
            {[3, 5, 4, 6, 3].map((h, i) => (
              <span
                key={i}
                className="w-0.5 bg-white/60 rounded-full animate-pulse"
                style={{ height: `${h * 2}px`, animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-[200] flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: "360px",
            maxWidth: "calc(100vw - 24px)",
            height: "520px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(26,86,160,0.15)",
            background: "#fff",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1a56a0, #0e7490)" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">Hayya Assistant</p>
              <p className="text-[10px] text-white/70 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full inline-block" />
                AI · Always available
              </p>
            </div>
            <div className="flex items-center gap-1">
              {/* Mode toggle */}
              {voiceSupported && (
                <div className="flex bg-white/10 rounded-lg p-0.5 gap-0.5 mr-1">
                  <button
                    onClick={() => setMode("chat")}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      mode === "chat" ? "bg-white text-[#1a56a0]" : "text-white/80"
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setMode("voice")}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      mode === "voice" ? "bg-white text-[#1a56a0]" : "text-white/80"
                    }`}
                  >
                    Voice
                  </button>
                </div>
              )}
              {/* Speaker toggle */}
              <button
                onClick={() => {
                  setSpeakEnabled((v) => {
                    if (v) window.speechSynthesis?.cancel();
                    return !v;
                  });
                }}
                className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={speakEnabled ? "Mute voice" : "Enable voice"}
              >
                {speakEnabled ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                )}
              </button>
              {messages.length > 0 && (
                <button
                  onClick={() => { setMessages([]); window.speechSynthesis?.cancel(); }}
                  className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-[9px] font-semibold"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Voice mode UI */}
          {mode === "voice" ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-[#f8fafc] px-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-[#374151] mb-1">Voice Mode</p>
                <p className="text-xs text-[#64748b]">
                  {recording ? "Listening… speak now" : "Tap the mic to ask a question"}
                </p>
              </div>

              {/* Mic button */}
              <button
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                  recording
                    ? "bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.2),0_0_0_16px_rgba(239,68,68,0.1)] scale-110"
                    : "bg-[#1a56a0] hover:bg-[#1547a0] shadow-lg hover:shadow-xl hover:scale-105"
                }`}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>

              {/* Transcript */}
              {(transcript || loading) && (
                <div className="w-full bg-white rounded-xl border border-[#e2e8f0] px-4 py-3 text-sm text-[#374151] text-center min-h-[56px] flex items-center justify-center">
                  {loading ? (
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  ) : (
                    <span className="italic text-[#64748b]">&ldquo;{transcript}&rdquo;</span>
                  )}
                </div>
              )}

              {/* Last AI response in voice mode */}
              {messages.length > 0 && !loading && (
                <div className="w-full bg-white rounded-xl border border-[#e2e8f0] px-4 py-3 text-xs text-[#374151] max-h-[100px] overflow-y-auto">
                  <span className="text-[10px] font-semibold text-[#1a56a0] block mb-1">Hayya Assistant:</span>
                  {messages[messages.length - 1].role === "assistant"
                    ? messages[messages.length - 1].content
                    : messages.length >= 2
                    ? messages[messages.length - 2].content
                    : ""}
                </div>
              )}

              <button
                onClick={() => setMode("chat")}
                className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors"
              >
                Switch to text chat →
              </button>
            </div>
          ) : (
            /* Chat mode */
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#f8fafc]">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-white font-black text-[10px]"
                        style={{ background: "linear-gradient(135deg,#1a56a0,#06b6d4)" }}>H</div>
                      <div className="bg-white border border-[#e2e8f0] rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-[#374151] max-w-[85%]">
                        Hi! I&apos;m Hayya Assistant 👋 I can help with CME/CPD requirements, platform features, or getting started. What would you like to know?
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {SUGGESTED.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="text-left text-xs px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:border-[#1a56a0] hover:text-[#1a56a0] text-[#374151] transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-white font-black text-[10px]"
                        style={{ background: "linear-gradient(135deg,#1a56a0,#06b6d4)" }}>H</div>
                    )}
                    <div className={`max-w-[82%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "bg-white text-[#374151] border border-[#e2e8f0] rounded-tl-sm"
                    }`}
                      style={msg.role === "user" ? { background: "linear-gradient(135deg,#1a56a0,#0e7490)" } : {}}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "assistant" && speakEnabled && (
                      <button
                        onClick={() => speak(msg.content)}
                        className="self-end mb-0.5 text-[#94a3b8] hover:text-[#1a56a0] transition-colors flex-shrink-0"
                        title="Play response"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-white font-black text-[10px]"
                      style={{ background: "linear-gradient(135deg,#1a56a0,#06b6d4)" }}>H</div>
                    <div className="bg-white border border-[#e2e8f0] rounded-xl rounded-tl-sm px-3 py-2.5">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-[#e2e8f0] bg-white flex-shrink-0">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
                    placeholder="Ask about CME, CPD, or the platform…"
                    maxLength={500}
                    disabled={loading}
                    className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#374151] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none disabled:opacity-50"
                  />
                  {/* Voice input button */}
                  {voiceSupported && (
                    <button
                      onClick={toggleRecording}
                      disabled={loading}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                        recording
                          ? "bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"
                          : "border border-[#e2e8f0] text-[#94a3b8] hover:border-[#1a56a0] hover:text-[#1a56a0]"
                      }`}
                      title={recording ? "Stop recording" : "Voice input"}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => send(input)}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors flex-shrink-0 disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg,#1a56a0,#06b6d4)" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
                <p className="text-[9px] text-[#94a3b8] mt-1.5 text-center">
                  AI assistant · Always verify with your licensing authority
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
