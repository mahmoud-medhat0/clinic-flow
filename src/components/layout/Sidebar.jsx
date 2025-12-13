import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Package
} from 'lucide-react';
import { useTranslation } from '../../context/DirectionContext';

function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
    { path: '/appointments', icon: Calendar, labelKey: 'nav.appointments' },
    { path: '/patients', icon: Users, labelKey: 'nav.patients' },
    { path: '/inventory', icon: Package, labelKey: 'nav.inventory' },
    { path: '/invoices', icon: FileText, labelKey: 'nav.invoices' },
    { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#2A7CFF"/>
              <path d="M16 8v16M8 16h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          {!isCollapsed && (
            <div className="logo-text">
              <span className="logo-brand">a2zenon</span>
              <span className="logo-product">ClinicFlow</span>
            </div>
          )}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? t('nav.expand') : t('nav.collapse')}
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!isCollapsed && <span className="nav-section-title">{t('nav.menu')}</span>}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? t(item.labelKey) : ''}
              >
                <Icon size={20} strokeWidth={1.5} />
                {!isCollapsed && <span className="nav-item-label">{t(item.labelKey)}</span>}
                {isActive && !isCollapsed && <ChevronRight size={16} className="nav-item-arrow" />}
              </NavLink>
            );
          })}
        </div>
      </nav>
      
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="version-info">
            <span>Version 1.0.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
