import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Asset } from '../../../shared/types';
import { AssetModal } from '../components/AssetModal';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const { liveAssets } = useSocket();

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (zoneFilter !== 'all') params.append('zone', zoneFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await api.get(`/assets?${params.toString()}`);
      setAssets(res.data);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, zoneFilter, statusFilter]);

  const handleSaveAsset = async (data: Partial<Asset>) => {
    try {
      if (editingAsset) {
        await api.patch(`/assets/${editingAsset.id}`, data);
      } else {
        await api.post('/assets', data);
      }
      fetchAssets();
    } catch (err) {
      console.error('Failed to save asset:', err);
    }
  };

  const handleDeleteAsset = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete asset ${id}?`)) {
      try {
        await api.delete(`/assets/${id}`);
        fetchAssets();
      } catch (err) {
        console.error('Failed to delete asset:', err);
      }
    }
  };

  // Merge live Socket.IO readings
  const displayAssets = assets.map((a) => {
    const live = liveAssets.find((l) => l.id === a.id);
    return live ? { ...a, temperature: live.temperature, vibration: live.vibration } : a;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="section-title">Asset Management</div>
          <div className="section-sub">{displayAssets.length} registered assets across plant zones</div>
        </div>

        <button
          onClick={() => {
            setEditingAsset(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus size={16} /> Register New Asset
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-[#111827] border border-white/10 p-4 rounded-xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets by ID, name, or type..."
            className="w-full bg-[#0d1622] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <select
            className="bg-[#0d1622] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
          >
            <option value="all">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
            <option value="Zone D">Zone D</option>
          </select>

          <select
            className="bg-[#0d1622] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="healthy">healthy</option>
            <option value="warning">warning</option>
            <option value="critical">critical</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Location</th>
                <th>Health Score</th>
                <th>Telemetry</th>
                <th>Status</th>
                <th>Next Maintenance</th>
                <th>AI Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-slate-400">
                    Loading asset fleet data...
                  </td>
                </tr>
              ) : displayAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-slate-400">
                    No assets matched current filter parameters.
                  </td>
                </tr>
              ) : (
                displayAssets.map((a) => {
                  const healthColor = a.health > 70 ? '#22c55e' : a.health > 45 ? '#f59e0b' : '#ef4444';
                  const pillClass = a.status === 'healthy' ? 'pill-green' : a.status === 'warning' ? 'pill-orange' : 'pill-red';

                  return (
                    <tr key={a.id} className="asset-row">
                      <td className="font-semibold text-white">
                        <div>{a.id}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{a.name}</div>
                      </td>
                      <td className="text-slate-400">{a.zone}</td>
                      <td>
                        <span className="healthbar">
                          <span className="healthbar-fill" style={{ width: `${a.health}%`, background: healthColor }}></span>
                        </span>
                        {a.health}%
                      </td>
                      <td className="text-xs text-slate-300">
                        <div>{a.temperature}°C</div>
                        <div className="text-[11px] text-slate-400">{a.vibration} mm/s</div>
                      </td>
                      <td>
                        <span className={`pill ${pillClass}`}>{a.status}</span>
                      </td>
                      <td className="text-slate-400">{a.nextMaintenance}</td>
                      <td className="text-slate-300 text-xs max-w-xs">{a.recommendation}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAsset(a);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAsset(a.id, e)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAsset}
        initialAsset={editingAsset}
      />
    </div>
  );
};
