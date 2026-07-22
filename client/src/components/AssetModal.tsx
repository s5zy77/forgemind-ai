import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Asset } from '../../../shared/types';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Partial<Asset>) => void;
  initialAsset?: Asset | null;
}

export const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, onSave, initialAsset }) => {
  const [formData, setFormData] = useState<Partial<Asset>>({
    id: '',
    name: '',
    zone: 'Zone A',
    type: 'Equipment',
    health: 85,
    riskScore: 15,
    temperature: 60,
    vibration: 1.5,
    status: 'healthy',
    nextMaintenance: 'Aug 20',
    recommendation: 'Monitor operating metrics',
    description: '',
  });

  useEffect(() => {
    if (initialAsset) {
      setFormData(initialAsset);
    } else {
      setFormData({
        id: `Asset-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        zone: 'Zone A',
        type: 'Centrifugal Pump',
        health: 90,
        riskScore: 10,
        temperature: 55,
        vibration: 1.2,
        status: 'healthy',
        nextMaintenance: 'Sep 15',
        recommendation: 'Nominal operational status',
        description: '',
      });
    }
  }, [initialAsset, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-[#0d1622] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white font-heading">
            {initialAsset ? `Edit Asset: ${initialAsset.id}` : 'Register New Industrial Asset'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Asset ID</label>
              <input
                type="text"
                required
                disabled={!!initialAsset}
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Name</label>
              <input
                type="text"
                required
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Zone</label>
              <select
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                value={formData.zone || 'Zone A'}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              >
                <option value="Zone A">Zone A</option>
                <option value="Zone B">Zone B</option>
                <option value="Zone C">Zone C</option>
                <option value="Zone D">Zone D</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                value={formData.status || 'healthy'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="healthy">healthy</option>
                <option value="warning">warning</option>
                <option value="critical">critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Health Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                value={formData.health ?? 90}
                onChange={(e) => setFormData({ ...formData, health: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Temperature (°C)</label>
              <input
                type="number"
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                value={formData.temperature ?? 60}
                onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Vibration (mm/s)</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                value={formData.vibration ?? 1.5}
                onChange={(e) => setFormData({ ...formData, vibration: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">AI Recommendation</label>
            <input
              type="text"
              className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              value={formData.recommendation || ''}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 rounded-lg border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:opacity-90"
            >
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
