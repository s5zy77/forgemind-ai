import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Asset } from '../../../shared/types';
import { useSocket } from '../context/SocketContext';
import { Activity, Thermometer, Radio, X } from 'lucide-react';

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
    healthy: '#22c55e',
    warning: '#f59e0b',
    critical: '#ef4444',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="section-title">Digital Twin</div>
          <div className="section-sub">Live plant floor visualization — real-time WebSocket telemetry feed</div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <Radio size={14} className="animate-pulse" /> Socket.IO Broadcaster Active
        </div>
      </div>

      <div className="card">
        <div className="twin-floor">
          {displayMachines.map((m) => {
            const color = colorMap[m.status] || '#3b82f6';
            const isCritical = m.status === 'critical';

            return (
              <div
                key={m.id}
                className="twin-machine"
                style={{
                  left: `${m.gridX}px`,
                  top: `${m.gridY}px`,
                  width: `${m.gridW}px`,
                  height: `${m.gridH}px`,
                  background: `${color}18`,
                  borderColor: color,
                  color: color,
                  animation: isCritical ? 'critpulse 1.4s infinite' : 'none',
                }}
                onClick={() => setSelectedMachine(m)}
                title={`${m.id} — Temp: ${m.temperature}°C, Vib: ${m.vibration} mm/s`}
              >
                <div className="text-center">
                  <div className="font-bold text-xs">{m.id}</div>
                  <div className="text-[10px] opacity-90 font-normal">
                    {m.temperature}°C · {m.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Machine Intelligence Drawer / Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d1622] border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-heading">
                Digital Twin Telemetry — {selectedMachine.id}
              </h3>
              <button onClick={() => setSelectedMachine(null)} className="p-1 text-slate-400 hover:bg-white/10 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#111827] border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Thermometer size={14} className="text-orange-400" /> Temperature
                </div>
                <div className="text-xl font-bold text-white">{selectedMachine.temperature}°C</div>
              </div>

              <div className="p-3 bg-[#111827] border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Activity size={14} className="text-cyan-400" /> Vibration
                </div>
                <div className="text-xl font-bold text-white">{selectedMachine.vibration} mm/s</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">AI Recommendation</div>
              <div className="text-xs text-slate-200 p-3 bg-white/5 border border-white/10 rounded-xl">
                {selectedMachine.recommendation}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMachine(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
