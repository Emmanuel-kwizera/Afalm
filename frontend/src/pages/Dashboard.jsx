import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="page-content">Loading dashboard...</div>;
  }

  return (
    <div className="diagnostics-page">
      {/* Top Banner */}
      <div className="banner">
        <h2>Welcome to AFALM Dashboard</h2>
        <p>Overview of your farm's recent AI diagnostics and soil health analyses</p>
      </div>

      {/* System Monitoring */}
      <div className="section-header">
        <h3>Farm Analytics</h3>
      </div>
      <div className="monitoring-grid">
        <div className="monitor-card">
          <div className="monitor-label">TOTAL DISEASE SCANS</div>
          <div className="monitor-val text-green">{stats?.totalDisease || 0}</div>
        </div>
        <div className="monitor-card">
          <div className="monitor-label">TOTAL SOIL ANALYSES</div>
          <div className="monitor-val">{stats?.totalSoil || 0}</div>
        </div>
        <div className="monitor-card">
          <div className="monitor-label">ML MODEL STATUS</div>
          <div className="monitor-val text-green">Online</div>
          <div className="monitor-sub">99.9% Uptime</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="diagnostics-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Recent Disease Predictions */}
        <div className="prediction-col">
          <div className="section-header space-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Recent Disease Predictions</h3>
            <Link to="/history" className="details-link" style={{ textDecoration: 'none', color: 'var(--text-green)', fontWeight: 'bold' }}>VIEW MORE</Link>
          </div>
          
          <div className="history-list" style={{ marginTop: '1rem' }}>
            {(!stats?.recentDisease || stats.recentDisease.length === 0) ? (
              <p>No recent disease predictions found.</p>
            ) : (
              stats.recentDisease.map(item => (
                <div key={item._id} className="history-card" style={{ marginBottom: '1rem', padding: '1rem', display: 'flex', gap: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt="Scanned leaf" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#EBF4EE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#356C51' }}>
                      No Image
                    </div>
                  )}
                  <div className="history-details" style={{ flex: '1' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.disease}</h4>
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', color: '#666' }}>Confidence: {(item.confidence * 100).toFixed(2)}%</p>
                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#999' }}>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Soil Analyses */}
        <div className="nutrients-col">
          <div className="section-header space-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Recent Soil Analyses</h3>
            <Link to="/soil-health" className="details-link" style={{ textDecoration: 'none', color: 'var(--text-green)', fontWeight: 'bold' }}>VIEW MORE</Link>
          </div>

          <div className="history-list" style={{ marginTop: '1rem' }}>
            {(!stats?.recentSoil || stats.recentSoil.length === 0) ? (
              <p>No recent soil analyses found.</p>
            ) : (
              stats.recentSoil.map(item => (
                <div key={item._id} className="history-card" style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <div className="history-details">
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Crop: <span className="text-green">{item.crop_recommendation}</span></h4>
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', color: '#666' }}>Risk: {item.soil_risk}</p>
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', color: '#666' }}>Type: {item.soil_type} for {item.crop_type}</p>
                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#999' }}>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
