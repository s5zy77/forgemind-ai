import React from 'react';
import { LayoutDashboard, Hexagon, Sparkles, Settings, AlertTriangle, BarChart3, Network, Boxes, FileText, ChevronLeft, ChevronRight, Wrench, Building2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activePage: string;
  onSelectPage: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage, collapsed, onToggleCollapse }) => {
  const { user } = useAuth();

  const groups = [
    {
      label: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'assets', label: 'Assets', icon: Hexagon },
        { id: 'brain', label: 'Operations Brain', icon: Sparkles },
        { id: 'twin', label: 'Digital Twin', icon: Boxes },
      ],
    },
    {
      label: 'Analytics & Maintenance',
      items: [
        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
        { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'graph', label: 'Knowledge Graph', icon: Network },
      ],
    },
    {
      label: 'Administration',
      items: [
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="sidebar select-none">
      {/* Workspace Switcher */}
      <div className="sb-header">
        <div className="sb-logo">FM</div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="logo-text truncate">ForgeMind AI</div>
            <div className="logo-sub truncate flex items-center gap-1">
              <Building2 size={10} /> Plant Zone A
            </div>
          </div>
        )}
      </div>

      {/* Navigation Grouped Items */}
      <div className="flex-1 space-y-4">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <div className="text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider px-3 mb-1">
                {group.label}
              </div>
            )}
            <nav className="nav-group">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <div
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectPage(item.id)}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="nav-icon">
                      <Icon size={16} />
                    </span>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="sb-footer space-y-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-2 py-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg">
            <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--bg)] font-bold text-[10px] flex items-center justify-center">
              {user.avatar || 'RK'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--text)] truncate">{user.name}</div>
              <div className="text-[9px] text-[var(--text-mute)] truncate">{user.role}</div>
            </div>
          </div>
        )}
        <div className="sb-collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          {!collapsed && <span className="nav-label">Collapse Menu</span>}
        </div>
      </div>
    </aside>
  );
};
