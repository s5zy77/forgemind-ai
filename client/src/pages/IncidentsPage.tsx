import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Incident } from '../../../shared/types';
import { Plus, AlertTriangle, CheckCircle, FileText, X } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssetId, setNewAssetId] = useState('Boiler-22');
  const [newSeverity, setNewSeverity] = useState('medium');
  const [newDescription, setNewDescription] = useState('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (severityFilter !== 'all') params.append('severity', severityFilter);

      const res = await api.get(`/incidents?${params.toString()}`);
      setIncidents(res.data);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [severityFilter]);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/incidents', {
        title: newTitle,
        assetId: newAssetId,
        severity: newSeverity,
        description: newDescription,
      });
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      fetchIncidents();
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#22d3ee';
      default: return '#a855f7';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="section-title">Incident Timeline</div>
          <div className="section-sub">Chronological view with AI-generated summaries and root cause analysis</div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Log New Incident
        </button>
      </div>

      {/* Filter */}
      <div className="flex justify-end gap-3">
        <select
          className="bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Timeline Card */}
      <div className="card space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading incident history logs...</div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No incidents recorded for this filter.</div>
        ) : (
          incidents.map((e) => {
            const color = getSeverityColor(e.severity);
            return (
              <div key={e.id} className="flex gap-4 p-4 border-b border-white/10 last:border-0">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-white">{e.title}</span>
                    <span className="text-xs text-slate-500">{e.date}</span>
                  </div>
                  <div className="text-xs font-semibold" style={{ color }}>
                    {e.severity.toUpperCase()} · {e.type}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">{e.description}</div>
                  {e.rootCause && (
                    <div className="mt-2 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-red-300">
                      <b>AI Root Cause:</b> {e.rootCause}
                    </div>
                  )}
                  {e.resolution && (
                    <div className="mt-1 text-xs bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg text-blue-300">
                      <b>Resolution:</b> {e.resolution}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Logging Incident */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d1622] border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-heading">Log Operational Incident</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pump-101 Thermal Overheating Trip"
                  className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Asset ID</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    value={newAssetId}
                    onChange={(e) => setNewAssetId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Severity</label>
                  <select
                    className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe failure circumstances..."
                  className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 border border-white/10 rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:opacity-90"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
