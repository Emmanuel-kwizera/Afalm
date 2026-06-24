import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <div className="top-indicator">
          <div className="status-dot"></div>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
