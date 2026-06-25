import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIDiagnostics from './pages/AIDiagnostics';
import SoilHealth from './pages/SoilHealth';
import PredictionHistory from './pages/PredictionHistory';

function App() {
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
          {/* Add more routes here matching sidebar */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
