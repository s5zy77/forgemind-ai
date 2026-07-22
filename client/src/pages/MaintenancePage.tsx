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
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Boiler-22',
        data: [8, 12, 17, 22, 29, 35, 44, 52, 60, 68, 75, 82],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Compressor-X4',
        data: [3, 4, 6, 7, 9, 11, 13, 16, 19, 22, 25, 29],
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.06)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#8b96a8', font: { size: 11 } } },
    },
    scales: {
      x: { ticks: { color: '#5b6577' }, grid: { color: 'rgba(255, 255, 255, 0.04)' } },
      y: {
        ticks: { color: '#5b6577' },
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        title: { display: true, text: 'Failure probability %', color: '#8b96a8' },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="section-title">Predictive Maintenance</div>
        <div className="section-sub">Remaining useful life & failure forecasting engine</div>
      </div>

      {/* RUL Cards */}
      <div className="grid grid-3">
        {topCritical.map((r, i) => (
          <div key={i} className="card">
            <div className="text-xs text-slate-400">{r.assetId} — {r.assetName}</div>
            <div className="text-2xl font-bold mt-2" style={{ color: r.riskColor }}>
              {r.remainingDays} days
            </div>
            <div className="text-xs text-slate-500 mt-1">Estimated remaining useful life (RUL)</div>
            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/10">
              <span className="text-slate-400">Failure Probability:</span>
              <span className="font-semibold text-white">{r.failureProbability}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* RUL Line Chart */}
      <div className="card">
        <div className="section-title text-base">Failure probability trend — next 90 days</div>
        <div style={{ height: '300px', position: 'relative', marginTop: '14px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
