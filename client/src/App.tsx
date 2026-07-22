import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { SearchModal } from './components/SearchModal';
import { DashboardPage } from './pages/DashboardPage';
import { AssetsPage } from './pages/AssetsPage';
import { BrainPage } from './pages/BrainPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={(p) => setActivePage(p)} />;
      case 'assets':
        return <AssetsPage />;
      case 'brain':
        return <BrainPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'graph':
        return <KnowledgeGraphPage />;
      case 'twin':
        return <DigitalTwinPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={(p) => setActivePage(p)} />;
    }
  };

  return (
    <div className={`app-container ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar
        activePage={activePage}
        onSelectPage={(p) => setActivePage(p)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className="main flex flex-col min-w-0">
        <Topbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onAskBrain={() => setActivePage('brain')}
        />

        <main className="content">{renderPage()}</main>
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => setActivePage('brain')} title="Ask Operations Brain">
        <Sparkles size={22} />
      </button>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAsset={() => setActivePage('assets')}
      />
    </div>
  );
};
