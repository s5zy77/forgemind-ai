import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Paperclip, Sparkles, CheckCircle2, FileText } from 'lucide-react';
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
  const [panelWidth, setPanelWidth] = useState(260);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Why is Pump-101 vibrating?',
    'Predict next maintenance — Boiler-22',
    'Show all critical assets',
    'Compare Compressor-X4 and X5',
  ];

  // Auto-scroll chat container on new content
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

      // Initialize streaming block
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
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <div className="section-title">Operations Brain</div>
        <div className="section-sub">Natural-language reasoning across assets, documents, and operational history.</div>
      </div>

      <div 
        className="chat-shell flex-grow"
        style={{ gridTemplateColumns: `${panelWidth}px 1fr` }}
      >
        {/* Chat History Sidebar */}
        <div className="card chat-history hidden md:block select-none">
          <div className="text-[11.5px] text-[var(--text-mute)] uppercase tracking-wider mb-3 font-semibold">
            Recent Sessions
          </div>
          {suggestedPrompts.map((prompt, idx) => (
            <div
              key={idx}
              className={`chat-hist-item ${idx === 0 ? 'active' : ''}`}
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </div>
          ))}
        </div>

        {/* Main Chat Interface */}
        <div className="card chat-main flex flex-col h-full relative overflow-hidden bg-[var(--card)] border-[var(--border)]">
          <div className="chat-messages flex-grow overflow-y-auto space-y-4 pb-24 pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.role} animate-fadeIn`}>
                <div
                  className="msg-bubble"
                  dangerouslySetInnerHTML={{ __html: m.text }}
                />
                {(m.sources || m.confidence) && (
                  <div className="msg-meta">
                    {m.sources?.map((s, idx) => (
                      <span key={idx} className="chip flex items-center gap-1">
                        <FileText size={10} /> {s}
                      </span>
                    ))}
                    {m.confidence && (
                      <span className="chip confidence flex items-center gap-1">
                        <CheckCircle2 size={10} /> Confidence: {m.confidence}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="msg ai">
                <div className="msg-bubble text-slate-400 text-xs flex items-center gap-2">
                  <Sparkles size={14} className="animate-spin text-cyan-400" />
                  Synthesizing multi-modal telemetry and equipment manuals...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="prompt-row mt-3">
            {suggestedPrompts.map((p, idx) => (
              <div key={idx} className="suggested" onClick={() => handleSend(p)}>
                {p}
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="chat-input-row">
            <button className="mini-icon-btn text-[var(--text-mute)] hover:text-white" title="Voice Input">
              <Mic size={16} />
            </button>
            <button className="mini-icon-btn text-[var(--text-mute)] hover:text-white" title="Attach Document / Manual">
              <Paperclip size={16} />
            </button>
            <input
              className="chat-input border-[var(--border)] bg-[var(--card2)] text-[var(--text)] placeholder-[var(--text-mute)]"
              placeholder="Ask about any asset, failure, or maintenance plan..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={() => handleSend()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
