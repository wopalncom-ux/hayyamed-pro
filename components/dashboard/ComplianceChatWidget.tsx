"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Am I on track for renewal?",
  "Which category needs more credits?",
  "Can I do more online courses?",
  "How many credits do I still need?",
];

export default function ComplianceChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your CME compliance advisor. Ask me anything about your credits, categories, or renewal timeline.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...updatedMessages, assistantMsg]);

    try {
      const res = await fetch("/api/ai/compliance-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: text },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Network error — please try again." },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#1a56a0] text-white text-sm font-medium px-4 py-3 rounded-full shadow-lg hover:bg-[#1547a0] transition-all"
        >
          <span className="text-base">✦</span>
          Ask compliance AI
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[360px] bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] flex flex-col"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] bg-[#1a56a0] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="text-white text-base">✦</span>
              <span className="text-white text-sm font-semibold">CME Compliance Advisor</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] text-sm rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#1a56a0] text-white rounded-br-sm"
                      : "bg-[#f1f5f9] text-[#111] rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                    <span className="inline-block w-1.5 h-3.5 bg-[#64748b] rounded-sm ml-1 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (show only when just the welcome message is there) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs text-[#1a56a0] border border-[#1a56a0]/30 rounded-full px-3 py-1 hover:bg-[#1a56a0]/5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#e2e8f0] flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about your compliance…"
              disabled={streaming}
              className="flex-1 text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || streaming}
              className="bg-[#1a56a0] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-40 transition-colors"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
