import React, { useState } from 'react';
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

  const suggestedPrompts = [
    'Why is Pump-101 vibrating?',
    'Predict next maintenance — Boiler-22',
    'Show all critical assets',
    'Compare Compressor-X4 and X5',
  ];

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
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: res.data.text,
        sources: res.data.sources,
        confidence: res.data.confidence,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="section-title">Operations Brain</div>
        <div className="section-sub">Natural-language reasoning across assets, documents, and operational history.</div>
      </div>

      <div className="chat-shell">
        {/* Chat History Sidebar */}
        <div className="card chat-history hidden md:block">
          <div className="text-[11.5px] text-slate-400 uppercase tracking-wider mb-3 font-semibold">Recent Sessions</div>
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
        <div className="card chat-main flex flex-col h-full">
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.role}`}>
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
            <button className="mini-icon-btn" title="Voice Input">
              <Mic size={16} />
            </button>
            <button className="mini-icon-btn" title="Attach Document / Manual">
              <Paperclip size={16} />
            </button>
            <input
              className="chat-input"
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
