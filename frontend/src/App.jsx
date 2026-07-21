import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIDiagnostics from './pages/AIDiagnostics';
import SoilHealth from './pages/SoilHealth';
import PredictionHistory from './pages/PredictionHistory';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './components/Sidebar';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin protection wrapper
const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Auth handler
  const handleAuth = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-diagnostics" element={<AIDiagnostics />} />
          <Route path="history" element={<PredictionHistory />} />
          <Route path="soil-health" element={<SoilHealth />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin-dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          {/* Add more routes here matching sidebar */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
