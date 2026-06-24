import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';
import AIDiagnostics from './pages/AIDiagnostics';
import SoilHealth from './pages/SoilHealth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/ai-diagnostics" replace />} />
          <Route path="dashboard" element={<Navigate to="/ai-diagnostics" replace />} />
          <Route path="ai-diagnostics" element={<AIDiagnostics />} />
          <Route path="soil-health" element={<SoilHealth />} />
          {/* Add more routes here matching sidebar */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
