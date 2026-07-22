import React, { useEffect, useState } from 'react';
import { Users, Microscope, Sprout, TrendingUp, ShieldAlert, Cpu, Network } from 'lucide-react';
import { getAdminStats } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError('Failed to fetch admin stats');
        }
      } catch (err) {
        if (err.message?.includes('403')) {
          setError('Access Denied: You must be an administrator to view this page.');
        } else {
          setError('Failed to connect to admin services.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page" style={{ padding: '2rem' }}>
        <div className="banner">
          <h2>Admin Dashboard</h2>
          <p>Loading system statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page" style={{ padding: '2rem' }}>
        <div className="banner" style={{ backgroundColor: '#fff', borderLeft: '4px solid #e74c3c' }}>
          <h2 style={{ color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={24} />
            Restricted Access
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="banner">
        <h2>System Administration</h2>
        <p>Global oversight of AFALM platform usage and metrics</p>
      </div>

      <div className="monitoring-grid">
        <div className="monitor-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="monitor-icon"><Users size={32} color="#356C51" /></div>
          <div>
            <div className="monitor-label">REGISTERED USERS</div>
            <div className="monitor-val text-green">{stats.totals.users}</div>
          </div>
        </div>

        <div className="monitor-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="monitor-icon"><Microscope size={32} color="#356C51" /></div>
          <div>
            <div className="monitor-label">TOTAL DISEASE SCANS</div>
            <div className="monitor-val text-green">{stats.totals.diseaseScans}</div>
          </div>
        </div>

        <div className="monitor-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="monitor-icon"><Sprout size={32} color="#356C51" /></div>
          <div>
            <div className="monitor-label">TOTAL SOIL ANALYSES</div>
            <div className="monitor-val text-green">{stats.totals.soilScans}</div>
          </div>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: '2rem' }}>
        <h3>Farmers by Registered Crop</h3>
      </div>
      <div className="monitoring-grid" style={{ marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {(!stats.farmersPerCrop || stats.farmersPerCrop.length === 0) ? (
          <p>No crop data available.</p>
        ) : (
          stats.farmersPerCrop.map(cropStat => (
            <div key={cropStat._id} className="monitor-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div className="monitor-icon" style={{ backgroundColor: '#EBF4EE', padding: '0.8rem', borderRadius: '12px' }}>
                <Sprout size={24} color="#356C51" />
              </div>
              <div>
                <div className="monitor-label" style={{ marginBottom: '0.2rem' }}>{cropStat._id.toUpperCase()}</div>
                <div className="monitor-val text-green" style={{ fontSize: '1.5rem' }}>{cropStat.count} {cropStat.count === 1 ? 'Farmer' : 'Farmers'}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="diagnostics-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="prediction-col">
          <div className="section-header space-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Recent Users Joined</h3>
          </div>
          <div className="history-list" style={{ marginTop: '1rem' }}>
            {(!stats.recentUsers || stats.recentUsers.length === 0) ? (
              <p>No recent users found.</p>
            ) : (
              stats.recentUsers.map(user => (
                <div key={user._id} className="history-card" style={{ marginBottom: '1rem', padding: '1rem', display: 'flex', gap: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EBF4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#356C51', fontWeight: 'bold' }}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="history-details" style={{ flex: '1' }}>
                    <h4 style={{ margin: '0 0 0.2rem 0' }}>{user.fullName}</h4>
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', color: '#666' }}>{user.email}</p>
                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#999' }}>Role: {user.role?.toUpperCase() || 'UNKNOWN'}</p>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="nutrients-col">
          <div className="section-header space-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Platform Activity (Recent Scans)</h3>
          </div>
          <div className="history-list" style={{ marginTop: '1rem' }}>
            {(!stats.recentDiseaseScans || stats.recentDiseaseScans.length === 0) ? (
              <p>No recent scans found.</p>
            ) : (
              stats.recentDiseaseScans.map(item => (
                <div key={item._id} className="history-card" style={{ marginBottom: '1rem', padding: '1rem', display: 'flex', gap: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', alignItems: 'center' }}>
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt="Scanned leaf" 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#EBF4EE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#356C51' }}>
                      <Microscope size={20} />
                    </div>
                  )}
                  <div className="history-details" style={{ flex: '1' }}>
                    <h4 style={{ margin: '0 0 0.2rem 0' }}>{item.disease}</h4>
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', color: '#666' }}>By: {item.user?.fullName || 'Unknown'}</p>
                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#999' }}>Confidence: {(item.confidence * 100).toFixed(2)}%</p>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={24} color="#356C51" />
          Sensor Design & Architecture
        </h3>
      </div>
      <div className="monitoring-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="monitor-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Network size={20} color="#356C51" />
            Sensor Node Offline Buffer
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
            Architecture detailing the offline buffering and syncing mechanism of AFALM sensor nodes.
          </p>
          <div style={{ marginTop: 'auto', backgroundColor: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
            <img 
              src="/assets/afalm_sensor_node_offline_buffer_architecture.png" 
              alt="Sensor Node Offline Buffer Architecture" 
              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
              onClick={() => window.open('/assets/afalm_sensor_node_offline_buffer_architecture.png', '_blank')}
            />
          </div>
        </div>

        <div className="monitor-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Network size={20} color="#356C51" />
            Dual-Mode Upload Logic
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
            Flowchart of the dual-mode data upload logic handling both online and offline states.
          </p>
          <div style={{ marginTop: 'auto', backgroundColor: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
            <img 
              src="/assets/afalm_dual_mode_upload_logic.png" 
              alt="Dual-Mode Upload Logic Flowchart" 
              style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
              onClick={() => window.open('/assets/afalm_dual_mode_upload_logic.png', '_blank')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
