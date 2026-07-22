import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Asset } from '../../../shared/types';
import { AssetModal } from '../components/AssetModal';
import { Plus, Edit2, Trash2, Search, SlidersHorizontal, Settings2, HelpCircle } from 'lucide-react';
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
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="section-title text-base font-semibold">Asset Inventory</div>
          <div className="section-sub text-xs text-[var(--text-mute)]">Review and manage 147 assets across plant zones</div>
        </div>

        <button
          onClick={() => {
            setEditingAsset(null);
            setIsModalOpen(true);
          }}
          className="px-3 py-1.5 bg-[var(--primary)] text-[var(--bg)] font-medium rounded-lg text-xs flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={14} /> Register Asset
        </button>
      </div>

      {/* Filter / Search Panel (Stripe / Linear-style border layout) */}
      <div className="flex flex-wrap gap-3 items-center justify-between p-3 border border-[var(--border)] bg-[var(--surface)] rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--text-mute)]" />
          <input
            type="text"
            placeholder="Search by ID, name, or model..."
            className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--text)] placeholder-[var(--text-mute)] focus:outline-none focus:border-[var(--blue)] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-[var(--text-mute)]" />
            <span className="text-[11px] text-[var(--text-dim)] font-medium">Filters:</span>
          </div>

          <select
            className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-dim)] focus:outline-none focus:border-[var(--blue)]"
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
            className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-dim)] focus:outline-none focus:border-[var(--blue)]"
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

      {/* Modern Data Table */}
      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-xl overflow-hidden shadow-sm">
        <div className="table-wrap">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Location</th>
                <th>Health index</th>
                <th>Sensors</th>
                <th>Status</th>
                <th>Maintenance window</th>
                <th>AI Actions</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-[var(--text-mute)]">
                    Loading asset inventory nodes...
                  </td>
                </tr>
              ) : displayAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-[var(--text-mute)]">
                    No active assets match criteria.
                  </td>
                </tr>
              ) : (
                displayAssets.map((a) => {
                  const healthColor = a.health > 70 ? 'var(--green)' : a.health > 45 ? 'var(--orange)' : 'var(--red)';
                  const pillClass = a.status === 'healthy' ? 'pill-green' : a.status === 'warning' ? 'pill-orange' : 'pill-red';

                  return (
                    <tr key={a.id} className="asset-row hover:bg-[var(--surface-secondary)] transition-all">
                      <td className="font-semibold text-[var(--text)]">
                        <div>{a.id}</div>
                        <div className="text-[10.5px] text-[var(--text-mute)] font-normal">{a.name}</div>
                      </td>
                      <td className="text-[var(--text-dim)] font-medium">{a.zone}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="healthbar bg-[var(--surface-secondary)]">
                            <span className="healthbar-fill" style={{ width: `${a.health}%`, background: healthColor }}></span>
                          </span>
                          <span className="text-xs font-mono text-[var(--text)]">{a.health}%</span>
                        </div>
                      </td>
                      <td className="text-xs text-[var(--text-dim)] font-mono">
                        <div>{a.temperature}°C</div>
                        <div className="text-[10px] text-[var(--text-mute)]">{a.vibration} mm/s</div>
                      </td>
                      <td>
                        <span className={`pill ${pillClass}`}>{a.status}</span>
                      </td>
                      <td className="text-[var(--text-dim)]">{a.nextMaintenance}</td>
                      <td className="text-[var(--text-dim)] text-xs max-w-xs truncate">{a.recommendation}</td>
                      <td className="text-right">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAsset(a);
                              setIsModalOpen(true);
                            }}
                            className="p-1 rounded hover:bg-[var(--surface-secondary)] text-[var(--text-dim)] hover:text-[var(--text)]"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAsset(a.id, e)}
                            className="p-1 rounded hover:bg-red-500/10 text-[var(--text-dim)] hover:text-[var(--red)]"
                          >
                            <Trash2 size={13} />
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
