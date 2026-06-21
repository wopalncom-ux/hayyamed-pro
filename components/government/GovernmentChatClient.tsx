"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What is our current compliance rate?",
  "Which professions have the lowest compliance?",
  "How many professionals have licenses expiring soon?",
  "What are the biggest risks to our renewal cycle?",
  "Who should I prioritize for outreach this month?",
  "Summarise the state of our workforce compliance.",
];

function MarkdownText({ text }: { text: string }) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^• (.+)$/gm, "<li>$1</li>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul class=\"list-disc pl-4 space-y-0.5\">$1</ul>")
    .replace(/\n\n/g, "</p><p class=\"mt-2\">")
    .replace(/\n/g, "<br/>");
  return <p dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />;
}

export default function GovernmentChatClient({ organizationId }: { organizationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/government-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          message: trimmed,
          history: messages.slice(-8),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
        <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#111]">AI Compliance Assistant</span>
            <span className="text-[10px] bg-[#e8f0fe] text-[#1a56a0] px-1.5 py-0.5 rounded font-medium">Claude Sonnet</span>
          </div>
          <p className="text-xs text-[#64748b]">Ask anything about your workforce compliance data</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="ml-auto text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full gap-6 pb-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#e8f0fe] flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[#374151]">Ask about your workforce data</p>
              <p className="text-xs text-[#64748b] mt-1">All answers are based on your live compliance data</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left text-xs px-3 py-2.5 rounded-lg border border-[#e2e8f0] hover:border-[#1a56a0] hover:bg-[#f0f4ff] text-[#374151] hover:text-[#1a56a0] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-[#1a56a0] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#1a56a0] text-white rounded-tr-sm"
                  : "bg-[#f8fafc] text-[#374151] border border-[#e2e8f0] rounded-tl-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <MarkdownText text={msg.content} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-[#1a56a0] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
              </svg>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your workforce compliance data… (Enter to send)"
            rows={2}
            maxLength={2000}
            disabled={loading}
            className="flex-1 text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none resize-none bg-white disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 bg-[#1a56a0] hover:bg-[#1547a0] disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-[#94a3b8] mt-2">
          Answers are based on live data from your authority registry. All queries are logged for audit compliance.
        </p>
      </div>
    </div>
  );
}
