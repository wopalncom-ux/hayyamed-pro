"use client";

import { useState, useRef, useEffect } from "react";
import { track } from "@/lib/analytics";

type Message = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "How many CME credits do I still need?",
  "Am I on track for my renewal deadline?",
  "Which category am I missing the most credits in?",
];

export default function AiChat({ isPro, hasWallet }: { isPro: boolean; hasWallet: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg, { role: "assistant" as const, content: "" }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    track("ai_chat_message_sent");

    try {
      const res = await fetch("/api/ai/compliance-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: full },
        ]);
      }
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] flex flex-col h-[520px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#e2e8f0]">
        <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a56a0] text-sm font-bold">✦</div>
        <div>
          <p className="text-sm font-semibold text-[#111]">CME Advisor</p>
          <p className="text-xs text-[#64748b]">Answers based on your actual compliance data</p>
        </div>
        {isPro && (
          <span className="ml-auto text-[10px] font-semibold text-[#1a56a0] bg-[#e8f0fe] px-2 py-0.5 rounded-full">
            Claude Haiku
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && isPro && (
          <div className="space-y-3">
            <p className="text-xs text-[#94a3b8] text-center mb-4">
              {hasWallet ? "Ask anything about your CME compliance status." : "Set up your CME wallet first to unlock personalized answers."}
            </p>
            {STARTER_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="w-full text-left text-sm text-[#374151] bg-[#f8fafc] hover:bg-[#f0f4f8] border border-[#e2e8f0] rounded-lg px-4 py-3 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-[#1a56a0] text-white rounded-br-sm"
                  : "bg-[#f8fafc] text-[#111] border border-[#e2e8f0] rounded-bl-sm"
              }`}
            >
              {m.content || (streaming && i === messages.length - 1 ? (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {isPro && (
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="px-4 py-3 border-t border-[#e2e8f0] flex gap-2"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your CME compliance…"
            disabled={streaming}
            className="flex-1 text-sm px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="px-3 py-2 bg-[#1a56a0] text-white rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
          >
            {streaming ? "…" : "Send"}
          </button>
        </form>
      )}

      {/* Free-tier lock overlay */}
      {!isPro && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center text-[#1a56a0] text-xl">✦</div>
          <div>
            <p className="font-semibold text-[#111] mb-1">AI Chat requires Pro</p>
            <p className="text-sm text-[#64748b]">Ask your personal CME advisor anything — compliance status, gap analysis, renewal timeline.</p>
          </div>
          <a href="/pricing?source=ai_chat" className="bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors">
            Upgrade to Pro — $6/month
          </a>
          <p className="text-xs text-[#94a3b8]">or $61.20/year (save 15%) · Cancel anytime</p>
        </div>
      )}
    </div>
  );
}
