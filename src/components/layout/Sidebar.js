import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/appointments', icon: Calendar, label: 'Appointments' },
  { path: '/patients', icon: Users, label: 'Patients' },
  { path: '/invoices', icon: FileText, label: 'Invoices' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#2A7CFF"/>
              <path d="M16 8v16M8 16h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-brand">a2zenon</span>
            <span className="logo-product">ClinicFlow</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Menu</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="nav-item-label">{item.label}</span>
                {isActive && <ChevronRight size={16} className="nav-item-arrow" />}
              </NavLink>
            );
          })}
        </div>
      </nav>
      
      <div className="sidebar-footer">
        <div className="version-info">
          <span>Version 1.0.0</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
