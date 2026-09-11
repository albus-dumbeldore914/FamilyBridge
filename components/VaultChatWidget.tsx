'use client';

/**
 * FAMILYBRIDGE "Ask the Family Vault" Conversational Assistant
 * Themed with PostPilot Editorial Chat Interface
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Shield,
  FileText,
  User,
  Bot,
} from 'lucide-react';
import { VaultDocument, UserRole, VaultMessage } from '@/lib/types';

interface VaultChatWidgetProps {
  documents: VaultDocument[];
  userRole: UserRole;
  isContinuityMode: boolean;
  memberId: string;
}

export const VaultChatWidget: React.FC<VaultChatWidgetProps> = ({
  documents,
  userRole,
  isContinuityMode,
  memberId,
}) => {
  const [messages, setMessages] = useState<VaultMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'gemini',
      text: `Hello! I am your **Family Vault Assistant**, powered by Gemini. I have verified access to your authorized family records.\n\nYou can ask me anything about policies, nominee details, property deeds, children's documents, or immediate next steps.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'What insurance policies do we have?',
        'Which insurance policy lists me as nominee?',
        'What should I take care of first?',
        'Where is the property deed located?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: VaultMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          userRole,
          memberId,
          isContinuityMode,
          customDocuments: documents,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        const botMsg: VaultMessage = {
          id: `bot_${Date.now()}`,
          sender: 'gemini',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citedDocumentIds: data.citedDocumentIds,
          suggestedPrompts: data.suggestedPrompts,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setIsLoading(false);
      const errorMsg: VaultMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'gemini',
        text: 'I apologize, but I encountered an error connecting to the vault service. Please try again or rephrase your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="bg-[#111113] border border-[#27272A] rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF4405]/10 border border-[#FF4405]/20 flex items-center justify-center text-[#FF4405] shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#FAFAFA]">Ask the Family Vault</h2>
              <span className="text-[10px] bg-[#FF4405]/15 text-[#FF4405] border border-[#FF4405]/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                Grounded Gemini RAG
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] font-normal">
              Zero hallucination • Answers strictly using authorized family records
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs text-[#71717A] font-mono">
            Scope: <strong className="text-[#FF4405] capitalize">{userRole}</strong>
          </span>
          {isContinuityMode && (
            <div className="text-[10px] text-[#FF4405] font-mono font-bold">Continuity Override Enabled</div>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0A0A0B]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const citedDocs = msg.citedDocumentIds
            ? documents.filter((d) => msg.citedDocumentIds?.includes(d.id))
            : [];

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-[#FF4405] text-white'
                    : 'bg-[#18181B] border border-[#27272A] text-[#FF4405]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2.5 shadow-sm ${
                  isUser
                    ? 'bg-[#FF4405] text-white rounded-tr-sm'
                    : 'bg-[#18181B] border border-[#27272A] text-[#D4D4D8] rounded-tl-sm font-normal'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                {/* Cited Source Documents Pill */}
                {citedDocs.length > 0 && (
                  <div className="pt-2 border-t border-[#27272A]">
                    <span className="text-[11px] text-[#71717A] font-mono block mb-1">
                      Verified Vault Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {citedDocs.map((doc) => (
                        <span
                          key={doc.id}
                          className="bg-[#111113] text-[#FAFAFA] border border-[#27272A] px-2.5 py-0.5 rounded-md text-[10px] flex items-center gap-1 font-mono font-medium"
                        >
                          <FileText className="w-3 h-3 text-[#FF4405]" />
                          {doc.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Prompts */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] text-[#71717A] block font-mono">
                      Suggested questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedPrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          className="bg-[#111113] hover:bg-[#27272A] hover:border-[#FF4405] text-[#D4D4D8] hover:text-[#FAFAFA] border border-[#27272A] px-3 py-1 rounded-lg text-[11px] transition font-normal text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[10px] text-right font-mono ${isUser ? 'text-white/75' : 'text-[#71717A]'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#18181B] border border-[#27272A] text-[#FF4405] flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-4 text-xs text-[#A1A1AA] flex items-center gap-2 shadow-sm font-normal">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4405] animate-ping" />
              <span>Gemini is analyzing authorized vault documents...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-[#27272A] bg-[#18181B]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about your family's ${documents.length} records...`}
            disabled={isLoading}
            className="flex-1 bg-[#111113] border border-[#27272A] rounded-xl px-4 py-3 text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FF4405] transition font-normal"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#FF4405] hover:bg-[#EA3800] disabled:opacity-40 text-white p-3 rounded-xl transition flex items-center justify-center shadow-lg shadow-[#FF4405]/20"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
