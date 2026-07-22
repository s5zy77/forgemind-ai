import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Asset } from '../../../shared/types';
import { useSocket } from '../context/SocketContext';
import { Activity, Thermometer, Radio, X, AlertTriangle, MonitorPlay } from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Asset | null>(null);
  const { liveAssets } = useSocket();

  useEffect(() => {
    const fetchTwinData = async () => {
      try {
        const res = await api.get('/assets');
        setAssets(res.data);
      } catch (err) {
        console.error('Error fetching twin data:', err);
      }
    };
    fetchTwinData();
  }, []);

  // Merge Socket.IO real-time telemetry stream into asset positions
  const displayMachines = assets.map((m) => {
    const live = liveAssets.find((l) => l.id === m.id);
    return live
      ? {
          ...m,
          temperature: live.temperature,
          vibration: live.vibration,
        }
      : m;
  });

  const colorMap: Record<string, string> = {
    healthy: 'var(--green)',
    warning: 'var(--orange)',
    critical: 'var(--red)',
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex justify-between items-center">
        <div>
          <div className="section-title text-base font-semibold">Digital Twin</div>
          <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Virtual plant telemetry models mapped over operational grids</div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <Radio size={12} className="animate-pulse" /> Live Telemetry Broadcast
        </div>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface)] p-5 rounded-xl shadow-sm">
        <div className="twin-floor border border-[var(--border)] bg-[var(--surface-secondary)] rounded-xl relative overflow-hidden h-[380px]">
          {displayMachines.map((m) => {
            const color = colorMap[m.status] || 'var(--blue)';
            const isCritical = m.status === 'critical' || m.temperature > 100 || m.vibration > 4.0;

            return (
              <div
                key={m.id}
                className="twin-machine absolute rounded-lg bg-[var(--surface)] border flex flex-col items-center justify-center p-2 cursor-pointer shadow-sm hover:scale-105 transition-all"
                style={{
                  left: `${m.gridX}px`,
                  top: `${m.gridY}px`,
                  width: `${m.gridW}px`,
                  height: `${m.gridH}px`,
                  borderColor: color,
                  color: color,
                }}
                onClick={() => setSelectedMachine(m)}
                title={`${m.id} — Temp: ${m.temperature}°C, Vib: ${m.vibration} mm/s`}
              >
                <div className="text-center relative">
                  {isCritical && (
                    <AlertTriangle size={11} className="absolute -top-3 -right-3 text-[var(--red)] animate-bounce" />
                  )}
                  <div className="font-bold text-[10px] text-[var(--text)]">{m.id}</div>
                  <div className="text-[9px] text-[var(--text-mute)] font-normal mt-0.5 font-mono">
                    {m.temperature}°C · {m.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Machine Diagnostic Overlay Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-1.5">
                <MonitorPlay size={14} className="text-[var(--blue)]" /> Diagnostic Console — {selectedMachine.id}
              </h3>
              <button onClick={() => setSelectedMachine(null)} className="p-1 text-[var(--text-mute)] hover:bg-[var(--surface-secondary)] rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-mute)] uppercase font-semibold">
                  <Thermometer size={12} className="text-orange-500" /> Temperature
                </div>
                <div className="text-lg font-bold text-[var(--text)] font-mono">{selectedMachine.temperature}°C</div>
              </div>

              <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-mute)] uppercase font-semibold">
                  <Activity size={12} className="text-cyan-500" /> Vibration
                </div>
                <div className="text-lg font-bold text-[var(--text)] font-mono">{selectedMachine.vibration} mm/s</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-[var(--text-mute)] uppercase">Maintenance Instruction</div>
              <div className="text-xs text-[var(--text-dim)] p-3 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl leading-relaxed">
                {selectedMachine.recommendation}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => setSelectedMachine(null)}
                className="px-4 py-1.5 text-xs font-semibold text-[var(--bg)] bg-[var(--primary)] rounded-lg shadow-sm hover:opacity-90 transition-all"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
