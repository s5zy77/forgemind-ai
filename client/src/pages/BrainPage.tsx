import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Paperclip, Sparkles, CheckCircle2, FileText, Bot, User } from 'lucide-react';
import api from '../services/api';
import { AIChatMessage } from '../../../shared/types';

export const BrainPage: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-1',
      role: 'ai',
      text: `Hi, I'm the <b>Operations Brain</b>. Ask me about any asset, failure pattern, or maintenance plan — I'll reason across sensor data, manuals, and operational history.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Why is Pump-101 vibrating?',
    'Predict next maintenance — Boiler-22',
    'Show all critical assets',
    'Compare Compressor-X4 and X5',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || loading) return;

    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await api.post('/ai/query', { query });
      
      const fullText = res.data.text;
      const responseId = `ai-${Date.now()}`;

      const initAiMsg: AIChatMessage = {
        id: responseId,
        role: 'ai',
        text: '',
        sources: res.data.sources,
        confidence: res.data.confidence,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, initAiMsg]);
      setLoading(false);

      const words = fullText.split(' ');
      let currentText = '';
      let index = 0;

      const timer = setInterval(() => {
        if (index < words.length) {
          currentText += (index === 0 ? '' : ' ') + words[index];
          setMessages((prev) =>
            prev.map((m) => (m.id === responseId ? { ...m, text: currentText } : m))
          );
          index++;
        } else {
          clearInterval(timer);
        }
      }, 25);
    } catch (err) {
      console.error('Failed to query AI:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'ai',
          text: 'Unable to connect to Operations Brain reasoning service. Please check network connection.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col max-w-4xl mx-auto select-none">
      <div>
        <div className="section-title text-base font-semibold">Operations Brain</div>
        <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Natural-language reasoning grounded by telemetry & documentation manuals</div>
      </div>

      {/* Main Chat Area */}
      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-xl flex flex-col h-[520px] shadow-sm relative overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((m) => {
            const isAi = m.role === 'ai';
            return (
              <div key={m.id} className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
                {/* Avatar Indicator */}
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${isAi ? 'bg-[var(--surface-secondary)] border-[var(--border)] text-[var(--blue)]' : 'bg-[var(--primary)] border-[var(--primary)] text-[var(--bg)]'}`}>
                  {isAi ? <Bot size={14} /> : <User size={14} />}
                </div>

                <div className={`space-y-1.5 max-w-[75%] ${isAi ? '' : 'items-end'}`}>
                  <div 
                    className={`p-3 rounded-xl text-xs leading-relaxed ${isAi ? 'bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text)]' : 'bg-[var(--primary)] text-[var(--bg)] font-medium'}`}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />

                  {isAi && (m.sources || m.confidence) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.sources?.map((s, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-[9.5px] px-2 py-0.5 border border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] rounded">
                          <FileText size={10} /> {s}
                        </span>
                      ))}
                      {m.confidence && (
                        <span className="flex items-center gap-1 text-[9.5px] px-2 py-0.5 border border-[var(--blue)] bg-[var(--surface)] text-[var(--blue)] font-semibold rounded">
                          <CheckCircle2 size={10} /> Confidence: {m.confidence}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--blue)] flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-mute)] flex items-center gap-2">
                <Sparkles size={13} className="animate-spin text-[var(--blue)]" />
                <span>Searching manuals & telemetry streams...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Area: Suggested Prompts & Input */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-secondary)] space-y-3">
          {/* Prompts suggestions row */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[10.5px] text-[var(--text-dim)] font-medium hover:bg-[var(--surface-secondary)] hover:text-[var(--text)] transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Form input bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask operations agent about failure status, boiler threshold limits, compressor air logs..."
              className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text)] placeholder-[var(--text-mute)] focus:outline-none focus:border-[var(--blue)] transition-all shadow-inner"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              className="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--bg)] flex items-center justify-center hover:opacity-90 transition-all shadow"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
