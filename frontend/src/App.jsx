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
import Sidebar from './components/Sidebar';

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
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-diagnostics" element={<AIDiagnostics />} />
          <Route path="history" element={<PredictionHistory />} />
          <Route path="soil-health" element={<SoilHealth />} />
          <Route path="settings" element={<Settings />} />
          {/* Add more routes here matching sidebar */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
