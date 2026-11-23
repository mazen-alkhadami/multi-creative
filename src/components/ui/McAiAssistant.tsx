"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, Send, Sparkles, ArrowUpRight, Bot } from "lucide-react";
import { useLanguage } from "@/hooks";
import { AiAssistantService } from "@/services/aiAssistantService";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "assistant" | "user";
  text: string;
  actionUrl?: string;
  actionLabel?: string;
}

let messageSeq = 0;
function createMessageId(prefix: string) {
  messageSeq += 1;
  return `${prefix}-${messageSeq}`;
}

export function McAiAssistant() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "assistant",
      text:
        lang === "ar"
          ? "مرحباً بك في MULTI CREATIVES. أنا المساعد الإرشادي (نموذج محلي موجه). أعتمد على قاعدة المعرفة الخاصة بـ MULTI CREATIVES لمساعدتك في التعرف على الخدمات السبع وطريقة طلب خدمة."
          : "Welcome to MULTI CREATIVES. I am the local guided assistant prototype. I operate on our local knowledge base to help you explore our seven services and how to request a service.",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const quickPrompts = [
    {
      label: lang === "ar" ? "ما هي الخدمات السبع المتاحة؟" : "What are your 7 services?",
      prompt: lang === "ar" ? "ما هي الخدمات السبع المتاحة في MULTI CREATIVES؟" : "What are the seven services available at MULTI CREATIVES?",
    },
    {
      label: lang === "ar" ? "كيف أطلب خدمة؟" : "How do I request a service?",
      prompt: lang === "ar" ? "كيف يمكنني تقديم طلب خدمة إلى MULTI CREATIVES؟" : "How do I request a service with MULTI CREATIVES?",
    },
    {
      label: lang === "ar" ? "سرعة التحميل والتوافق" : "Speed & Compatibility",
      prompt: lang === "ar" ? "ما هي معاييركم في سرعة المواقع والتوافق مع الجوال؟" : "What are your standards for web speed and mobile compatibility?",
    },
  ];

  const handleSend = useCallback(async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: createMessageId("user"),
      sender: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setTyping(true);

    try {
      const response = await AiAssistantService.sendMessage(text.trim(), lang);
      const assistantMsg: ChatMessage = {
        id: createMessageId("assistant"),
        sender: "assistant",
        text: response.reply,
        actionUrl: response.actionUrl,
        actionLabel: response.actionLabel,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallback = AiAssistantService.getLocalKnowledgeReply(text.trim(), lang);
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId("assistant"),
          sender: "assistant",
          text: fallback.reply,
          actionUrl: fallback.actionUrl,
          actionLabel: fallback.actionLabel,
        },
      ]);
    } finally {
      setTyping(false);
    }
  }, [input, lang]);

  return (
    <>
      {/* Floating Trigger Button (Positioned above Floating WhatsApp Button) */}
      <div className="fixed bottom-24 end-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[var(--bg-surface-elevated)] border border-[#C6A66B]/40 hover:border-[#C6A66B] text-[var(--text-primary)] shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 font-bold text-xs"
            aria-label={lang === "ar" ? "فتح المساعد الإرشادي MC" : "Open MC Assistant"}
          >
            <Bot className="w-4 h-4 text-[#C6A66B]" />
            <span className="hidden sm:inline font-semibold tracking-wide text-[var(--accent-gold)]">
              {lang === "ar" ? "مساعد MC" : "MC Assistant"}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#C6A66B] animate-pulse" />
          </button>
        )}
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-4 end-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] h-[580px] rounded-2xl border border-[#C6A66B]/30 bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-xl"
          )}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1C1C1C] to-[#111111] text-white border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#C6A66B]/20 text-[#C6A66B]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                  <span>{lang === "ar" ? "المساعد الإرشادي" : "MC Guided Assistant"}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C6A66B]/20 text-[#C6A66B]">
                    Prototype
                  </span>
                </h3>
                <span className="text-[10px] text-stone-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {lang === "ar" ? "يعمل بقاعدة المعرفة المحلية" : "Local Knowledge Base"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.sender === "user" ? "ms-auto items-end" : "me-auto items-start"
                )}
              >
                <div
                  className={cn(
                    "p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line",
                    msg.sender === "user"
                      ? "bg-[#C6A66B] text-black font-medium rounded-ee-none"
                      : "bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-es-none"
                  )}
                >
                  {msg.text}
                </div>

                {msg.actionUrl && (
                  <div className="mt-2">
                    <Link
                      href={msg.actionUrl}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[#C6A66B]/40 text-xs font-semibold text-[#C6A66B] hover:bg-[#C6A66B] hover:text-black transition-all"
                    >
                      <span>{msg.actionLabel}</span>
                      <ArrowUpRight className={cn("w-3 h-3", lang === "ar" && "rotate-[-90deg]")} />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="me-auto p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A66B] animate-spin" />
                <span>{lang === "ar" ? "جاري صياغة الرد المعماري..." : "Analyzing inquiry..."}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="p-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(qp.prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/50 hover:text-[#C6A66B] text-[var(--text-secondary)] transition-colors"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "ar" ? "اسأل عن التخصصات، السرعة، أو المشاريع..." : "Inquire about services, speed, or scope..."}
              className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#C6A66B] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-[#C6A66B] hover:bg-[#D8BC84] text-black transition-colors disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
