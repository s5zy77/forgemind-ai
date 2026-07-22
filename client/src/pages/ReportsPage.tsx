import React from 'react';
import { Download, FileSpreadsheet, FileText, AlertOctagon, BarChart2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const handleDownload = (type: string, format: 'csv' | 'pdf') => {
    const url = `/api/reports/download?type=${type}&format=${format}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ForgeMind_${type}_Report.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportCards = [
    { type: 'maintenance', title: 'Maintenance Records', icon: FileSpreadsheet, sub: 'Outage & servicing logs' },
    { type: 'incidents', title: 'Incident Analytics', icon: AlertOctagon, sub: 'Outage triggers & severity levels' },
    { type: 'assets', title: 'Asset Fleet Status', icon: FileText, sub: 'Full inventory asset metrics' },
    { type: 'executive', title: 'Executive Summary', icon: BarChart2, sub: 'AI summary & RUL analysis' },
  ];

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div>
        <div className="section-title text-base font-semibold">Report Generator</div>
        <div className="section-sub text-xs text-[var(--text-mute)] font-medium">Export and download real-time generated reports in PDF and CSV format</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.type} className="card border border-[var(--border)] bg-[var(--surface)] p-5 rounded-xl shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--blue)] flex items-center justify-center">
                <Icon size={18} />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-xs text-[var(--text)]">{r.title}</div>
                <div className="text-[10.5px] text-[var(--text-mute)] leading-normal line-clamp-2">{r.sub}</div>
              </div>

              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => handleDownload(r.type, 'csv')}
                  className="flex-1 py-1.5 text-[11px] font-medium text-[var(--text-dim)] bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-secondary)] transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Download size={11} /> CSV
                </button>
                <button
                  onClick={() => handleDownload(r.type, 'pdf')}
                  className="flex-1 py-1.5 text-[11px] font-medium text-[var(--bg)] bg-[var(--primary)] rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Download size={11} /> PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
