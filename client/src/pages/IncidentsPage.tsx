import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Incident } from '../../../shared/types';
import { Plus, AlertOctagon, CheckCircle2, ChevronRight, X, AlertTriangle, ShieldCheck } from 'lucide-react';

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

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical': return 'pill-red';
      case 'high': return 'pill-orange';
      case 'medium': return 'pill-blue';
      default: return 'pill-green';
    }
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <div className="section-title text-base font-semibold">Incident Management</div>
          <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Log and track industrial system failures, trips, and diagnostics</div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-[var(--primary)] text-[var(--bg)] font-medium rounded-lg text-xs flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={14} /> Log Incident
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-end">
        <select
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-dim)] focus:outline-none focus:border-[var(--blue)]"
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

      {/* Incidents timeline feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-[var(--text-mute)]">Loading incident feed...</div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-12 text-xs text-[var(--text-mute)] border border-[var(--border)] rounded-xl bg-[var(--surface)]">
            No incidents recorded for this severity.
          </div>
        ) : (
          incidents.map((e) => {
            const badgeClass = getSeverityBadge(e.severity);
            const isResolved = e.status === 'resolved';

            return (
              <div key={e.id} className="border border-[var(--border)] bg-[var(--surface)] p-4 rounded-xl shadow-sm hover:border-[var(--border-strong)] transition-all space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-[var(--text)]">{e.title}</span>
                      <span className={`pill ${badgeClass} text-[9.5px]`}>{e.severity}</span>
                      {isResolved ? (
                        <span className="flex items-center gap-0.5 text-[9.5px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">
                          <ShieldCheck size={10} /> Resolved
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[9.5px] px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                          <AlertOctagon size={10} /> Active
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--text-mute)] font-mono">
                      Asset ID: {e.assetId || 'N/A'} · Logged {e.date}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-dim)] leading-relaxed">
                  {e.description}
                </div>

                {(e.rootCause || e.resolution) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
                    {e.rootCause && (
                      <div className="p-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-dim)]">
                        <div className="font-semibold text-[10px] text-[var(--text-mute)] uppercase tracking-wider mb-0.5">AI Root Cause Summary</div>
                        {e.rootCause}
                      </div>
                    )}
                    {e.resolution && (
                      <div className="p-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-dim)]">
                        <div className="font-semibold text-[10px] text-[var(--text-mute)] uppercase tracking-wider mb-0.5">Technician Action Taken</div>
                        {e.resolution}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Log Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text)] font-heading">Log System Incident</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-[var(--text-mute)] hover:bg-[var(--surface-secondary)]">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boiler-22 safety bypass check valve fail"
                  className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] placeholder-[var(--text-mute)] focus:outline-none focus:border-[var(--blue)] transition-all"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider mb-1">Asset ID</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--blue)] transition-all"
                    value={newAssetId}
                    onChange={(e) => setNewAssetId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider mb-1">Severity</label>
                  <select
                    className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-dim)] focus:outline-none focus:border-[var(--blue)]"
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
                <label className="block text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider mb-1">Telemetry Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe failure variables..."
                  className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text)] placeholder-[var(--text-mute)] focus:outline-none focus:border-[var(--blue)] transition-all"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-[var(--text-dim)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-[var(--bg)] bg-[var(--primary)] font-semibold rounded-lg hover:opacity-90 shadow-sm transition-all"
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
