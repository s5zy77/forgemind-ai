import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings2, ShieldCheck, Cpu, MessageSquare } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [toggles, setToggles] = useState({
    alertPush: true,
    autoDiagnosis: true,
    voiceInput: false,
  });

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 select-none max-w-lg mx-auto">
      <div>
        <div className="section-title text-base font-semibold">Settings</div>
        <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Manage plant telemetry and AI reasoning preferences</div>
      </div>

      <div className="card border border-[var(--border)] bg-[var(--surface)] p-5 rounded-xl shadow-sm space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Settings2 size={16} className="text-[var(--text-mute)] mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[var(--text)]">Dark Enterprise Theme</div>
              <div className="text-[10.5px] text-[var(--text-mute)]">Optimized for high-density plant screens</div>
            </div>
          </div>
          <div
            className={`toggle ${theme === 'dark' ? 'on' : ''}`}
            onClick={toggleTheme}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <ShieldCheck size={16} className="text-[var(--text-mute)] mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[var(--text)]">Real-Time Alert Push</div>
              <div className="text-[10.5px] text-[var(--text-mute)]">Instantly push alert banners to topbar status</div>
            </div>
          </div>
          <div
            className={`toggle ${toggles.alertPush ? 'on' : ''}`}
            onClick={() => toggleSetting('alertPush')}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Cpu size={16} className="text-[var(--text-mute)] mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[var(--text)]">AI Auto-Diagnosis Engine</div>
              <div className="text-[10.5px] text-[var(--text-mute)]">Trigger automated root cause summaries for new trips</div>
            </div>
          </div>
          <div
            className={`toggle ${toggles.autoDiagnosis ? 'on' : ''}`}
            onClick={() => toggleSetting('autoDiagnosis')}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <MessageSquare size={16} className="text-[var(--text-mute)] mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[var(--text)]">Voice Reasoning Input</div>
              <div className="text-[10.5px] text-[var(--text-mute)]">Enable voice query prompts in Operations Brain</div>
            </div>
          </div>
          <div
            className={`toggle ${toggles.voiceInput ? 'on' : ''}`}
            onClick={() => toggleSetting('voiceInput')}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
