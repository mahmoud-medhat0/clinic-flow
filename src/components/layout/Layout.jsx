import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useTranslation } from '../../context/DirectionContext';

function Layout() {
  const location = useLocation();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get translated title based on current route
  const getTitleByRoute = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '') {
      return t('nav.dashboard');
    } else if (path.startsWith('/appointments')) {
      return t('nav.appointments');
    } else if (path.startsWith('/patients/') && path.length > 10) {
      return t('patientProfile.title');
    } else if (path.startsWith('/patients')) {
      return t('nav.patients');
    } else if (path.startsWith('/inventory')) {
      return t('nav.inventory');
    } else if (path.startsWith('/invoices')) {
      return t('nav.invoices');
    } else if (path.startsWith('/settings')) {
      return t('nav.settings');
    }
    
    return t('nav.dashboard');
  };

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <TopBar title={getTitleByRoute()} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
