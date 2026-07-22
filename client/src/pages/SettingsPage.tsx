import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

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
    <div className="space-y-6">
      <div>
        <div className="section-title">Settings</div>
        <div className="section-sub">Platform & operational preferences</div>
      </div>

      <div className="card max-w-lg space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-[var(--text)]">Dark Enterprise Theme</div>
            <div className="text-xs text-[var(--text-mute)]">Optimized for high-density plant operations</div>
          </div>
          <div
            className={`toggle ${theme === 'dark' ? 'on' : ''}`}
            onClick={toggleTheme}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-[var(--text)]">Real-Time Alert Push</div>
            <div className="text-xs text-[var(--text-mute)]">Push critical alerts to topbar badge</div>
          </div>
          <div
            className={`toggle ${toggles.alertPush ? 'on' : ''}`}
            onClick={() => toggleSetting('alertPush')}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-[var(--text)]">AI Auto-Diagnosis Engine</div>
            <div className="text-xs text-[var(--text-mute)]">Automatically summarize root causes for new trips</div>
          </div>
          <div
            className={`toggle ${toggles.autoDiagnosis ? 'on' : ''}`}
            onClick={() => toggleSetting('autoDiagnosis')}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-[var(--text)]">Voice Input & Speech Reasoning</div>
            <div className="text-xs text-[var(--text-mute)]">Enable voice queries in Operations Brain</div>
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
