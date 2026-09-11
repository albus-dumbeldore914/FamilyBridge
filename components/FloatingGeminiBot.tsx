"use client";

/**
 * FAMILYBRIDGE Omnipresent Floating Gemini Chatbot
 * Miro.com visual theme:
 * - Miro Deep Navy #050038
 * - Miro Electric Blue #4262FF
 * - Miro Accent Yellow #FFD02F
 */

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  FileText,
  Bot,
  User,
} from "lucide-react";
import { useFamilyStore } from "@/lib/storage";
import { VaultMessage } from "@/lib/types";

export const FloatingGeminiBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VaultMessage[]>([
    {
      id: "bot_init",
      sender: "gemini",
      text: "Hello! I am your **FamilyBridge Assistant**, powered by Gemini. Ask me anything about policies, nominee details, property deeds, or immediate next steps.",
      timestamp: "Just now",
      suggestedPrompts: [
        "What insurance policies do we have?",
        "Which insurance lists me as nominee?",
        "What should I take care of first?",
        "Where is the property deed?",
      ],
    },
  ]);

  const { documents, activeRole, activeMemberId, isContinuityMode } = useFamilyStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const toggleSpeechRecognition = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser. Please type your message.");
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: VaultMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          userRole: activeRole,
          memberId: activeMemberId,
          isContinuityMode,
          customDocuments: documents,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        const botMsg: VaultMessage = {
          id: `bot_${Date.now()}`,
          sender: "gemini",
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          citedDocumentIds: data.citedDocumentIds,
          suggestedPrompts: data.suggestedPrompts,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "gemini",
          text: "I could not connect to the Gemini service. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Window */}
      {isOpen ? (
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-[360px] sm:w-[420px] h-[560px] shadow-skiff-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#18181B] text-[#FAFAFA] p-4 flex items-center justify-between border-b border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#27272A] flex items-center justify-center text-[#FF4405] shadow-skiff">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-[#FAFAFA]">Ask FamilyBridge</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA] font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Gemini 2.5 • Zero-Knowledge RAG</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#71717A] hover:text-[#FAFAFA] rounded-lg hover:bg-[#27272A] transition"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0B] bg-skiff-grid">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              const citedDocs = msg.citedDocumentIds
                ? documents.filter((d) => msg.citedDocumentIds?.includes(d.id))
                : [];

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-skiff ${
                      isUser
                        ? "bg-[#FF4405] text-white"
                        : "bg-[#18181B] border border-[#27272A] text-[#FF4405]"
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-xs space-y-2 shadow-skiff ${
                      isUser
                        ? "bg-[#18181B] border border-[#3F3F46] text-[#FAFAFA]"
                        : "bg-[#111113] border border-[#27272A] text-[#FAFAFA]"
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                    {citedDocs.length > 0 && (
                      <div className="pt-1.5 border-t border-[#27272A]">
                        <span className="text-[10px] text-[#71717A] font-mono uppercase block mb-1">
                          Source Document:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {citedDocs.map((doc) => (
                            <span
                              key={doc.id}
                              className="bg-[#18181B] text-[#FF4405] border border-[#FF4405]/30 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono font-medium"
                            >
                              <FileText className="w-3 h-3 text-[#FF4405]" />
                              {doc.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <span className="text-[10px] text-[#71717A] font-mono block">
                          Suggested questions:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {msg.suggestedPrompts.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => handleSend(prompt)}
                              className="bg-[#18181B] hover:bg-[#222226] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A] px-2.5 py-1 rounded-md text-[10px] transition text-left shadow-xs font-mono"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#18181B] border border-[#27272A] text-[#FF4405] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#111113] border border-[#27272A] rounded-xl p-3 text-xs text-[#A1A1AA] flex items-center gap-2 shadow-skiff font-mono">
                  <div className="w-2 h-2 rounded-full bg-[#FF4405] animate-ping" />
                  <span>Gemini is analyzing encrypted vault records...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-[#27272A] bg-[#111113] flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2.5 rounded-lg border transition ${
                isRecording
                  ? "bg-rose-950/40 border-rose-600 text-rose-500 animate-pulse"
                  : "bg-[#18181B] border-[#27272A] text-[#71717A] hover:text-[#FAFAFA]"
              }`}
              title={isRecording ? "Listening... click to stop" : "Voice dictation"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask anything about family documents..."
              disabled={isLoading}
              className="flex-1 bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FF4405] font-medium"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-[#FF4405] hover:bg-[#EA3800] disabled:opacity-40 text-white p-2.5 rounded-lg transition shadow-skiff"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Floating Trigger Button (Skiff Dark Obsidian + Ember) */
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#111113] hover:bg-[#18181B] text-[#FAFAFA] border border-[#27272A] hover:border-[#3F3F46] px-3.5 py-2.5 rounded-xl shadow-skiff-lg transition-all transform hover:-translate-y-0.5"
          aria-label="Open Ask FamilyBridge AI Chatbot"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-[#FF4405]" />
            <span className="w-2 h-2 rounded-full bg-[#10B981] absolute -top-1 -right-1 ring-2 ring-[#111113] animate-pulse" />
          </div>
          <span className="font-semibold text-xs tracking-tight hidden sm:inline text-[#FAFAFA]">
            Ask Vault AI
          </span>
          <span className="bg-[#FF4405]/10 text-[#FF4405] border border-[#FF4405]/30 text-[10px] font-mono px-1.5 py-0.5 rounded">
            Gemini
          </span>
        </button>
      )}
    </div>
  );
};