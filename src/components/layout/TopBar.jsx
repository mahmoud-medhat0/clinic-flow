import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ChevronDown, Globe, X, Check, Clock, Sun, Moon } from 'lucide-react';
import { useDirection, useTranslation } from '../../context/DirectionContext';
import { useAuth } from '../../context/AuthContext';

// Sample notifications data with time values
const notificationsData = [
  { id: 1, type: 'appointment', titleKey: 'notifications.newAppointment', message: 'Sarah Johnson booked for 10:00 AM', timeValue: 5, timeUnit: 'minutes', read: false },
  { id: 2, type: 'reminder', titleKey: 'notifications.upcomingAppointment', message: 'Ahmed Hassan in 30 minutes', timeValue: 15, timeUnit: 'minutes', read: false },
  { id: 3, type: 'system', titleKey: 'notifications.systemUpdate', message: 'New features available', timeValue: 1, timeUnit: 'hours', read: true },
  { id: 4, type: 'appointment', titleKey: 'notifications.appointmentCanceled', message: 'John Smith canceled 2:00 PM slot', timeValue: 2, timeUnit: 'hours', read: true },
  { id: 5, type: 'reminder', titleKey: 'notifications.weeklyReport', message: 'Your weekly summary is ready', timeValue: 1, timeUnit: 'days', read: true },
];

function TopBar({ title }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  
  const topBarRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const { language, changeLanguage, languageConfig, theme, toggleTheme, isDark } = useDirection();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topBarRef.current && !topBarRef.current.contains(event.target)) {
        setShowUserMenu(false);
        setShowNotifications(false);
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut to focus search (Ctrl+M or / key)
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+M - keyCode 77 is M
      if (event.ctrlKey && event.keyCode === 77) {
        event.preventDefault();
        event.stopPropagation();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
        return false;
      }
      
      // Don't trigger / if typing in an input or textarea
      const target = event.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      // / key (only when not in input)
      if (event.key === '/' && !isInput) {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    // Use capture phase to intercept before browser handles it
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Format time ago with translations
  const formatTimeAgo = (value, unit) => {
    if (unit === 'minutes') {
      if (value === 1) return t('time.minuteAgo');
      return t('time.minutesAgo').replace('{{count}}', value);
    } else if (unit === 'hours') {
      if (value === 1) return t('time.hourAgo');
      return t('time.hoursAgo').replace('{{count}}', value);
    } else if (unit === 'days') {
      if (value === 1) return t('time.dayAgo');
      return t('time.daysAgo').replace('{{count}}', value);
    } else if (unit === 'weeks') {
      if (value === 1) return t('time.weekAgo');
      return t('time.weeksAgo').replace('{{count}}', value);
    }
    return t('time.justNow');
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar" ref={topBarRef}>
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="topbar-center">
        <div className="search-container" onClick={() => searchInputRef.current?.focus()}>
          <Search size={18} className="search-icon" />
          <input 
            ref={searchInputRef}
            type="text" 
            className="search-input" 
            placeholder={t('topbar.searchPlaceholder')}
          />
          <span className="search-shortcut">/</span>
        </div>
      </div>
      
      <div className="topbar-right">
        {/* Notifications */}
        <div className="dropdown-wrapper">
          <button 
            className="topbar-btn notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowLanguageMenu(false);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} strokeWidth={1.5} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>{t('topbar.notifications')}</h3>
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={markAllAsRead}>
                    <Check size={14} />
                    {t('topbar.markAllRead')}
                  </button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="notifications-empty">
                    <Bell size={32} />
                    <p>{t('topbar.noNotifications')}</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-content">
                        <span className="notification-title">{t(notification.titleKey)}</span>
                        <span className="notification-message">{notification.message}</span>
                        <span className="notification-time">
                          <Clock size={12} />
                          {formatTimeAgo(notification.timeValue, notification.timeUnit)}
                        </span>
                      </div>
                      <button 
                        className="notification-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="notifications-footer">
                <a href="#all-notifications">{t('topbar.viewAllNotifications')}</a>
              </div>
            </div>
          )}
        </div>
        {/* Theme Toggle */}
        <button 
          className="topbar-btn theme-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </button>

        {/* Language Switcher */}
        <div className="dropdown-wrapper">
          <button 
            className="topbar-btn language-btn"
            onClick={() => {
              setShowLanguageMenu(!showLanguageMenu);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            title={t('topbar.selectLanguage')}
          >
            <Globe size={20} strokeWidth={1.5} />
          </button>

          {showLanguageMenu && (
            <div className="language-dropdown">
              <div className="language-header">
                <h3>{t('topbar.selectLanguage')}</h3>
              </div>
              <div className="language-list">
                {Object.entries(languageConfig).map(([code, config]) => (
                  <button
                    key={code}
                    className={`language-item ${language === code ? 'active' : ''}`}
                    onClick={() => {
                      changeLanguage(code);
                      setShowLanguageMenu(false);
                    }}
                  >
                    <span className="language-flag">{config.flag}</span>
                    <span className="language-name">{config.name}</span>
                    {language === code && <Check size={16} className="language-check" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* User Menu */}
        <div className="user-menu">
          <button 
            className="user-menu-trigger"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowLanguageMenu(false);
            }}
          >
            <div className="user-avatar">
              <User size={20} strokeWidth={1.5} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Dr. Ahmed'}</span>
              <span className="user-role">{t('auth.admin')}</span>
            </div>
            <ChevronDown size={16} className={`user-chevron ${showUserMenu ? 'open' : ''}`} />
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <a href="#profile" className="dropdown-item">{t('auth.profile')}</a>
              <a href="/settings" className="dropdown-item">{t('nav.settings')}</a>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item text-error">{t('auth.logout')}</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
