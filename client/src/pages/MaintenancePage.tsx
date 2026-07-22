import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { RULPrediction } from '../../../shared/types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const MaintenancePage: React.FC = () => {
  const [predictions, setPredictions] = useState<RULPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRUL = async () => {
      try {
        const res = await api.get('/maintenance/rul');
        setPredictions(res.data);
      } catch (err) {
        console.error('Error fetching RUL predictions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRUL();
  }, []);

  const topCritical = predictions.filter((p) => p.remainingDays < 45).slice(0, 3);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `Wk ${i + 1}`),
    datasets: [
      {
        label: 'Chiller-C2',
        data: [10, 18, 25, 33, 42, 55, 63, 71, 80, 86, 91, 95],
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.03)',
        tension: 0.25,
        fill: true,
      },
      {
        label: 'Boiler-22',
        data: [8, 12, 17, 22, 29, 35, 44, 52, 60, 68, 75, 82],
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.03)',
        tension: 0.25,
        fill: true,
      },
      {
        label: 'Compressor-X4',
        data: [3, 4, 6, 7, 9, 11, 13, 16, 19, 22, 25, 29],
        borderColor: '#0891b2',
        backgroundColor: 'rgba(8, 145, 178, 0.02)',
        tension: 0.25,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#71717a', font: { size: 10, family: 'Inter' } } },
    },
    scales: {
      x: { ticks: { color: '#71717a', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.02)' } },
      y: {
        ticks: { color: '#71717a', font: { size: 10 } },
        grid: { color: 'rgba(0,0,0,0.03)' },
        title: { display: true, text: 'Probability (%)', color: '#71717a', font: { size: 10 } },
      },
    },
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div>
        <div className="section-title text-base font-semibold">Predictive Maintenance</div>
        <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Predictive decay remaining useful life (RUL) modeling</div>
      </div>

      {/* RUL Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-6 text-xs text-[var(--text-mute)]">Loading forecast metrics...</div>
        ) : (
          topCritical.map((r, i) => (
            <div key={i} className="card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-xl shadow-sm space-y-2">
              <div className="text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider">{r.assetId}</div>
              <div className="text-xl font-bold tracking-tight" style={{ color: r.riskColor }}>
                {r.remainingDays} days
              </div>
              <div className="text-[10.5px] text-[var(--text-dim)]">Remaining Useful Life (RUL)</div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-[10px] font-medium text-[var(--text-mute)]">
                <span>Failure Risk:</span>
                <span className="text-[var(--text)] font-semibold">{r.failureProbability}%</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RUL Line Chart */}
      <div className="card border border-[var(--border)] bg-[var(--surface)] p-5 rounded-xl shadow-sm">
        <div className="section-title text-sm font-semibold mb-4">Failure Probability Trend (90 days)</div>
        <div style={{ height: '280px', position: 'relative' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
