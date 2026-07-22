import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const commonGrid = { color: 'rgba(113, 113, 122, 0.08)' };
  const commonTicks = { color: '#71717a', font: { size: 10, family: 'Inter' } };

  const downtimeData = {
    labels: analytics?.downtimeByCause?.labels || ['Mechanical', 'Electrical', 'Sensor fault', 'Human error', 'Scheduled'],
    datasets: [
      {
        label: 'Hours',
        data: analytics?.downtimeByCause?.data || [42, 28, 15, 9, 22],
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#22d3ee'],
      },
    ],
  };

  const utilData = {
    labels: analytics?.assetUtilization?.labels || ['In use', 'Idle', 'Maintenance', 'Offline'],
    datasets: [
      {
        data: analytics?.assetUtilization?.data || [68, 18, 9, 5],
        backgroundColor: ['#3b82f6', '#22d3ee', '#f59e0b', '#ef4444'],
      },
    ],
  };

  const costData = {
    labels: analytics?.costTrend?.labels || ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Cost ($k)',
        data: analytics?.costTrend?.data || [38, 42, 35, 48, 44, 51],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168,85,247,0.03)',
        fill: true,
        tension: 0.25,
      },
    ],
  };

  const riskData = {
    labels: analytics?.riskRadar?.labels || ['Mechanical', 'Thermal', 'Electrical', 'Vibration', 'Corrosion', 'Age'],
    datasets: [
      {
        label: 'Fleet risk',
        data: analytics?.riskRadar?.data || [62, 45, 38, 55, 30, 48],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.08)',
      },
    ],
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div>
        <div className="section-title text-base font-semibold">Operational Analytics</div>
        <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Fleet downtime vectors, utilization performance, and operational cost metrics</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-xl shadow-sm">
          <div className="section-title text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)] mb-2">Downtime by cause (hrs / month)</div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Bar
              data={downtimeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { ticks: commonTicks, grid: commonGrid }, y: { ticks: commonTicks, grid: commonGrid } },
              }}
            />
          </div>
        </div>

        <div className="card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-xl shadow-sm">
          <div className="section-title text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)] mb-2">Asset utilization</div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut
              data={utilData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#71717a', font: { size: 10, family: 'Inter' } } } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-xl shadow-sm">
          <div className="section-title text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)] mb-2">Maintenance cost trend ($k)</div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Line
              data={costData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { ticks: commonTicks, grid: commonGrid }, y: { ticks: commonTicks, grid: commonGrid } },
              }}
            />
          </div>
        </div>

        <div className="card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-xl shadow-sm">
          <div className="section-title text-xs font-semibold uppercase tracking-wider text-[var(--text-mute)] mb-2">Fleet Risk Distribution Radar</div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Radar
              data={riskData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  r: {
                    angleLines: { color: 'rgba(113, 113, 122, 0.08)' },
                    grid: { color: 'rgba(113, 113, 122, 0.08)' },
                    pointLabels: { color: '#71717a', font: { size: 9, family: 'Inter' } },
                    ticks: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
