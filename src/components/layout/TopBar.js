import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import './TopBar.css';

function TopBar({ title }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="topbar-center">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search patients, appointments..."
          />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>
      
      <div className="topbar-right">
        <button className="topbar-btn notification-btn">
          <Bell size={20} strokeWidth={1.5} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-menu">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={20} strokeWidth={1.5} />
            </div>
            <div className="user-info">
              <span className="user-name">Dr. Ahmed</span>
              <span className="user-role">Admin</span>
            </div>
            <ChevronDown size={16} className={`user-chevron ${showUserMenu ? 'open' : ''}`} />
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <a href="#profile" className="dropdown-item">Profile</a>
              <a href="#settings" className="dropdown-item">Settings</a>
              <div className="dropdown-divider"></div>
              <a href="#logout" className="dropdown-item text-error">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
