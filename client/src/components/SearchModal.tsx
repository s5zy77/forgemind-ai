import React, { useState, useEffect } from 'react';
import { Search, X, Hexagon, AlertTriangle, FileText } from 'lucide-react';
import api from '../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset?: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectAsset }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ assets: any[]; incidents: any[]; manuals: any[] }>({
    assets: [],
    incidents: [],
    manuals: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ assets: [], incidents: [], manuals: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0d1622] border border-white/10 shadow-2xl">
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <Search size={18} className="mr-3 text-slate-400" />
          <input
            type="text"
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
            placeholder="Global Search assets, manuals, incidents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {loading && <div className="text-center text-xs text-slate-400 py-6">Searching platform intelligence...</div>}

          {!loading && !results.assets.length && !results.incidents.length && !results.manuals.length && query && (
            <div className="text-center text-xs text-slate-500 py-6">No matching records found for "{query}"</div>
          )}

          {results.assets.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Assets</div>
              {results.assets.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    if (onSelectAsset) onSelectAsset(a.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Hexagon size={14} className="text-blue-400" />
                    <span className="font-semibold text-white">{a.id}</span>
                    <span className="text-slate-400">{a.name}</span>
                  </div>
                  <span className="text-slate-500">{a.zone}</span>
                </div>
              ))}
            </div>
          )}

          {results.incidents.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Incidents</div>
              {results.incidents.map((inc) => (
                <div key={inc.id} className="p-2.5 rounded-lg hover:bg-white/5 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} className="text-red-400" />
                    <span className="font-semibold text-white">{inc.title}</span>
                    <span className="text-red-400 text-[10px] uppercase font-bold">{inc.severity}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{inc.description}</div>
                </div>
              ))}
            </div>
          )}

          {results.manuals.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Manuals & SOPs</div>
              {results.manuals.map((m) => (
                <div key={m.id} className="p-2.5 rounded-lg hover:bg-white/5 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className="text-cyan-400" />
                    <span className="font-semibold text-white">{m.title}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] line-clamp-1">{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
