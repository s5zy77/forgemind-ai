import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Asset } from '../../../shared/types';
import { useSocket } from '../context/SocketContext';

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

  // Overlay Socket.IO live updates if present
  const displayAssets = assets.map((a) => {
    const live = liveAssets.find((l) => l.id === a.id);
    return live ? { ...a, temperature: live.temperature, vibration: live.vibration } : a;
  });

  const mapPositions = [
    { top: 20, left: 30 },
    { top: 120, left: 150 },
    { top: 40, left: 320 },
    { top: 180, left: 430 },
    { top: 70, left: 560 },
    { top: 200, left: 60 },
    { top: 230, left: 700 },
    { top: 30, left: 680 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="hero">
        <div className="hero-eyebrow">Unified Asset & Operations Brain</div>
        <h1>Industrial Knowledge Intelligence Platform</h1>
        <p>
          An AI-powered decision intelligence system that unifies industrial knowledge, understands asset relationships,
          predicts operational risks, and assists engineers with explainable recommendations.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => onNavigate('brain')}>
            ✦ Ask Operations Brain
          </button>
          <button className="btn-secondary" onClick={() => onNavigate('assets')}>
            View all assets
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-4">
        {metrics.map((k, i) => (
          <div key={i} className="card">
            <div className="kpi-icon" style={{ background: `${k.color}22`, color: k.color }}>
              {k.icon}
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className={`kpi-delta ${k.up ? 'up' : 'down'}`}>
              {k.up ? '▲' : '▼'} {k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Factory Map & Alert Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="section-title">Live operations map</div>
          <div className="section-sub">Click any machine for full asset intelligence.</div>
          <div className="map-wrap">
            {displayAssets.map((a, i) => {
              const pos = mapPositions[i % mapPositions.length];
              return (
                <div
                  key={a.id}
                  className={`asset-node ${a.status}`}
                  style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
                  onClick={() => onNavigate('assets')}
                  title={`${a.id} — Temp: ${a.temperature}°C, Vib: ${a.vibration} mm/s`}
                >
                  <div>{a.id.split('-')[0]}</div>
                  <div style={{ opacity: 0.7 }}>{a.id.split('-')[1]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Smart alert center</div>
          <div className="section-sub">Real-time, AI-prioritized</div>
          <div className="flex flex-col gap-3">
            {alerts.map((a, i) => {
              const pillClass = a.sev === 'critical' ? 'pill-red' : a.sev === 'warning' ? 'pill-orange' : 'pill-green';
              return (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`pill ${pillClass}`}>{a.sev}</span>
                    <span className="text-[10.5px] text-slate-500">{a.time}</span>
                  </div>
                  <div className="text-xs text-slate-200">{a.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
