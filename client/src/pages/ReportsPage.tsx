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
    { type: 'maintenance', title: 'Maintenance Report', icon: FileSpreadsheet, sub: 'Last 30 days servicing logs' },
    { type: 'incidents', title: 'Incident Report', icon: AlertOctagon, sub: 'Severity & root cause logs' },
    { type: 'assets', title: 'Asset Fleet Report', icon: FileText, sub: '147 assets & health scores' },
    { type: 'executive', title: 'Executive Summary', icon: BarChart2, sub: 'AI generated operational overview' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="section-title">Report Generator</div>
        <div className="section-sub">AI-generated, exportable PDF and CSV plant reports</div>
      </div>

      <div className="grid grid-4">
        {reportCards.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.type} className="card flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Icon size={24} />
              </div>
              <div className="font-semibold text-sm text-white font-heading">{r.title}</div>
              <div className="text-xs text-slate-500">{r.sub}</div>

              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => handleDownload(r.type, 'csv')}
                  className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 flex items-center justify-center gap-1"
                >
                  <Download size={12} /> CSV
                </button>
                <button
                  onClick={() => handleDownload(r.type, 'pdf')}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 flex items-center justify-center gap-1 shadow-md"
                >
                  <Download size={12} /> PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
