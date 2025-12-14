import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useTranslation } from '../../context/DirectionContext';

function Layout() {
  const location = useLocation();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on window resize (when going to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <TopBar 
        title={getTitleByRoute()} 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

