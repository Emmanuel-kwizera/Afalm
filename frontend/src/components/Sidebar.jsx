import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import afalmLogo from '../assets/Afalm_Logo.png';

export default function Sidebar() {
  const navigate = useNavigate();
  
  // Try to get user from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { fullName: 'Main Field' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <img src={afalmLogo} alt="AFALM Logo" className="sidebar-brand-logo" />
      
      <div className="sidebar-profile">
        <div className="profile-img">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-name">{user.fullName}</div>
          <div className="profile-zone">Zone A-12</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Dashboard
        </NavLink>
        <NavLink to="/soil-health" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Soil Health
        </NavLink>
        <NavLink to="/ai-diagnostics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          AI Diagnostics
        </NavLink>
        <NavLink to="/history" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          History
        </NavLink>
        <NavLink to="/alerts" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Alerts
        </NavLink>
        <NavLink to="/field-map" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Field Map
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Settings
        </NavLink>
        {user.role === 'admin' && (
          <NavLink to="/admin-dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} style={{ marginTop: '1rem', borderTop: '1px solid #D3E0D8', paddingTop: '1rem' }}>
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-add-sensor">Add Sensor</button>
        <button className="nav-item">Support</button>
        <button className="nav-item" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
