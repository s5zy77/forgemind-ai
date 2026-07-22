import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, SlidersHorizontal, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface TopbarProps {
  onOpenSearch: () => void;
  onAskBrain: () => void;
  plantStatus?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSearch, onAskBrain, plantStatus = 'Plant Nominal' }) => {
  const [time, setTime] = useState<string>('--:--:--');
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString());
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar select-none border-b border-[var(--border)] bg-[var(--surface)] px-6">
      {/* Left Area: Breadcrumbs & Plant Status */}
      <div className="tb-left">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] font-medium">
          <span>ForgeMind</span>
          <span className="text-[var(--text-mute)]">/</span>
          <span className="text-[var(--text)] font-semibold">Operations Console</span>
        </div>
        <div className="plant-status flex items-center gap-1.5 px-2 py-0.5 border border-[var(--border)] bg-[var(--surface-secondary)] rounded-full text-[10px]">
          <span className="dot"></span>
          <span>{plantStatus}</span>
        </div>
      </div>

      {/* Right Area: Actions, Search, Theme, Profile */}
      <div className="tb-right flex items-center gap-3">
        <div className="clock text-xs font-mono text-[var(--text-mute)]">{time}</div>

        {/* Minimal Search Button */}
        <div
          onClick={onOpenSearch}
          className="search-box flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] bg-[var(--surface-secondary)] rounded-lg text-xs text-[var(--text-dim)] cursor-pointer hover:border-[var(--border-strong)] transition-all min-w-[200px]"
        >
          <Search size={14} className="text-[var(--text-mute)]" />
          <span className="flex-1 text-left text-[var(--text-mute)]">Search platform...</span>
          <kbd className="text-[9px] bg-[var(--surface)] border border-[var(--border)] px-1 py-0.5 rounded text-[var(--text-mute)]">
            ⌘K
          </kbd>
        </div>

        {/* Ask Brain Primary Trigger */}
        <button
          onClick={onAskBrain}
          className="px-3 py-1.5 bg-[var(--primary)] text-[var(--bg)] font-medium rounded-lg text-xs flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
        >
          <Sparkles size={13} />
          <span>Ask Brain</span>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="icon-btn w-8 h-8 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-dim)] transition-all"
          title="Toggle Color Theme"
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        {/* Notifications Button */}
        <div className="icon-btn w-8 h-8 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-dim)] transition-all cursor-pointer relative">
          <Bell size={14} />
          <span className="badge-dot"></span>
        </div>

        {/* User Badge */}
        <div className="avatar w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--bg)] font-bold text-xs flex items-center justify-center shadow-inner">
          {user?.avatar || 'RK'}
        </div>
      </div>
    </header>
  );
};
