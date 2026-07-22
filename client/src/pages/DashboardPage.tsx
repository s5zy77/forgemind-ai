import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Asset } from '../../../shared/types';
import { useSocket } from '../context/SocketContext';
import { ArrowUpRight, ArrowDownRight, Compass, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const { liveAssets } = useSocket();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setMetrics(res.data.metrics);
        setAlerts(res.data.alerts);
        setAssets(res.data.assets);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      }
    };
    fetchDashboard();
  }, []);

  // Sync WebSocket telemetry updates
  const displayAssets = assets.map((a) => {
    const live = liveAssets.find((l) => l.id === a.id);
    return live ? { ...a, temperature: live.temperature, vibration: live.vibration } : a;
  });

  const mapPositions = [
    { top: 25, left: 35 },
    { top: 125, left: 165 },
    { top: 45, left: 345 },
    { top: 195, left: 455 },
    { top: 75, left: 585 },
    { top: 215, left: 75 },
    { top: 245, left: 725 },
    { top: 35, left: 705 },
  ];

  return (
    <div className="space-y-6">
      {/* Vercel-style clean Hero Card */}
      <div className="hero border border-[var(--border)] bg-[var(--surface)] p-6 rounded-xl relative overflow-hidden shadow-sm">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="hero-eyebrow flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[var(--blue)] uppercase">
            <Sparkles size={12} /> Industrial Knowledge intelligence
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
            ForgeMind operations Hub
          </h1>
          <p className="text-xs text-[var(--text-dim)] leading-relaxed">
            Operations intelligence mapping plant assets, relational graph nodes, equipment manuals, and telemetry alerts 
            into explainable insights and predictive failure metrics.
          </p>
          <div className="hero-actions flex gap-2 pt-2">
            <button 
              className="btn-primary px-3 py-1.5 text-xs bg-[var(--primary)] text-[var(--bg)] font-medium rounded-lg"
              onClick={() => onNavigate('brain')}
            >
              ✦ Query Operations Brain
            </button>
            <button 
              className="btn-secondary px-3 py-1.5 text-xs border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-medium rounded-lg hover:bg-[var(--surface-secondary)]"
              onClick={() => onNavigate('assets')}
            >
              View Asset Fleet
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 4 Metrics Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((k, i) => (
          <div key={i} className="card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-xl shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-mute)] font-medium uppercase tracking-wider">{k.label}</span>
              <span className="text-xs text-[var(--text-dim)]">{k.icon}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-[var(--text)]">
              {k.value}
            </div>
            <div className={`text-[10px] font-semibold flex items-center gap-0.5 ${k.up ? 'text-emerald-500' : 'text-red-500'}`}>
              {k.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              <span>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Map */}
        <div className="card lg:col-span-2 border border-[var(--border)] bg-[var(--surface)] p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-title text-sm font-semibold">Asset Layout Grid</div>
              <div className="section-sub text-[11px] text-[var(--text-mute)]">Fleet sensor mapping & alert states</div>
            </div>
            <Compass size={16} className="text-[var(--text-mute)]" />
          </div>

          <div className="map-wrap border border-[var(--border)] bg-[var(--surface-secondary)] rounded-xl relative overflow-hidden h-[300px]">
            {displayAssets.map((a, i) => {
              const pos = mapPositions[i % mapPositions.length];
              const statusColor = a.status === 'healthy' ? 'border-emerald-500 text-emerald-500' : a.status === 'warning' ? 'border-amber-500 text-amber-500' : 'border-red-500 text-red-500';
              return (
                <div
                  key={a.id}
                  className={`absolute w-14 h-14 rounded-lg bg-[var(--surface)] border flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105 ${statusColor}`}
                  style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
                  onClick={() => onNavigate('assets')}
                  title={`${a.id} — Temp: ${a.temperature}°C, Vib: ${a.vibration} mm/s`}
                >
                  <span className="font-bold text-[9px]">{a.id.split('-')[0]}</span>
                  <span className="text-[8px] opacity-75 font-mono">{a.id.split('-')[1]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts List */}
        <div className="card border border-[var(--border)] bg-[var(--surface)] p-5 rounded-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-title text-sm font-semibold">Priority Alerts</div>
              <div className="section-sub text-[11px] text-[var(--text-mute)]">Real-time plant trip feeds</div>
            </div>
            <ShieldAlert size={16} className="text-[var(--text-mute)]" />
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
            {alerts.slice(0, 4).map((a, i) => {
              const badgeClass = a.sev === 'critical' ? 'pill-red' : a.sev === 'warning' ? 'pill-orange' : 'pill-green';
              return (
                <div key={i} className="p-3 border border-[var(--border)] bg-[var(--surface-secondary)] rounded-lg space-y-1.5 transition-all hover:border-[var(--border-strong)]">
                  <div className="flex justify-between items-center">
                    <span className={`pill ${badgeClass} text-[9px]`}>{a.sev}</span>
                    <span className="text-[9.5px] text-[var(--text-mute)] font-mono">{a.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-[var(--text)] line-clamp-1">{a.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
