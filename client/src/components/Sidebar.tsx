import React from 'react';
import { LayoutDashboard, Hexagon, Sparkles, Settings, AlertTriangle, BarChart3, Network, Boxes, FileText, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onSelectPage: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage, collapsed, onToggleCollapse }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Hexagon },
    { id: 'brain', label: 'Operations Brain', icon: Sparkles },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'twin', label: 'Digital Twin', icon: Boxes },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-header">
        <div className="sb-logo">FM</div>
        <div>
          <div className="logo-text">ForgeMind AI</div>
          <div className="logo-sub">Operations Brain</div>
        </div>
      </div>

      <nav className="nav-group">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectPage(item.id)}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              <span className="nav-label">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sb-footer">
        <div className="sb-collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          <span className="nav-label">{collapsed ? 'Expand' : 'Collapse'}</span>
        </div>
      </div>
    </aside>
  );
};
