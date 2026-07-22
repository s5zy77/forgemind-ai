import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  onOpenSearch: () => void;
  onAskBrain: () => void;
  plantStatus?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSearch, onAskBrain, plantStatus = 'Plant Nominal · 3 alerts active' }) => {
  const [time, setTime] = useState<string>('--:--:--');
  const { user } = useAuth();

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString());
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="tb-left">
        <div className="search-box" onClick={onOpenSearch}>
          <Search size={15} />
          <span>Search assets, docs, incidents…</span>
          <kbd>⌘K</kbd>
        </div>
        <div className="plant-status">
          <span className="dot"></span> {plantStatus}
        </div>
      </div>

      <div className="tb-right">
        <div className="clock">{time}</div>
        <button className="ai-btn" onClick={onAskBrain}>
          <Sparkles size={15} /> Ask the Brain
        </button>
        <div className="icon-btn">
          <Bell size={16} />
          <span className="badge-dot"></span>
        </div>
        <div className="icon-btn">
          <Moon size={16} />
        </div>
        <div className="avatar">{user?.avatar || 'RK'}</div>
      </div>
    </header>
  );
};
