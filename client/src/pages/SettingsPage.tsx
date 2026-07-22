import React, { useState } from 'react';

export const SettingsPage: React.FC = () => {
  const [toggles, setToggles] = useState({
    theme: true,
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
            <div className="text-sm font-medium text-white">Dark Enterprise Theme</div>
            <div className="text-xs text-slate-500">Optimized for high-density plant operations</div>
          </div>
          <div
            className={`toggle ${toggles.theme ? 'on' : ''}`}
            onClick={() => toggleSetting('theme')}
          >
            <div className="toggle-knob"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-white">Real-Time Alert Push</div>
            <div className="text-xs text-slate-500">Push critical alerts to topbar badge</div>
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
            <div className="text-sm font-medium text-white">AI Auto-Diagnosis Engine</div>
            <div className="text-xs text-slate-500">Automatically summarize root causes for new trips</div>
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
            <div className="text-sm font-medium text-white">Voice Input & Speech Reasoning</div>
            <div className="text-xs text-slate-500">Enable voice queries in Operations Brain</div>
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
