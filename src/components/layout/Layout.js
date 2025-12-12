import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

function Layout({ title = 'Dashboard' }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <TopBar title={title} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
