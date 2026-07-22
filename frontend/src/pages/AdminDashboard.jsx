import React, { useEffect, useState } from 'react';
import { Users, Microscope, Sprout, TrendingUp, ShieldAlert, Cpu, Network, Activity, Play, Square } from 'lucide-react';
import { getAdminStats, predictSoilMetrics } from '../services/api';

const SensorSimulator = () => {
  const [sensors, setSensors] = useState({
    1: { running: false, lastData: null, result: null },
    2: { running: false, lastData: null, result: null }
  });

  const toggleSensor = (id) => {
    setSensors(prev => ({
      ...prev,
      [id]: { ...prev[id], running: !prev[id].running }
    }));
  };

  useEffect(() => {
    const intervals = {};

    [1, 2].forEach(id => {
      if (sensors[id].running) {
        const triggerSim = async () => {
          const payload = {
            nitrogen: Math.floor(Math.random() * 150),
            phosphorous: Math.floor(Math.random() * 80),
            potassium: Math.floor(Math.random() * 200),
            temperature: (20 + Math.random() * 15).toFixed(1),
            humidity: (40 + Math.random() * 40).toFixed(1),
            moisture: (30 + Math.random() * 50).toFixed(1),
            ph: (5.5 + Math.random() * 3).toFixed(1),
            rainfall: Math.floor(Math.random() * 200),
            soil_type: ['Black', 'Clayey', 'Loamy', 'Red', 'Sandy'][Math.floor(Math.random() * 5)],
            crop_type: ['Wheat', 'Maize', 'Rice', 'Cotton', 'Sugarcane'][Math.floor(Math.random() * 5)]
          };

          setSensors(prev => ({
            ...prev,
            [id]: { ...prev[id], lastData: payload }
          }));

          try {
            const res = await predictSoilMetrics(payload);
            if (res.success) {
              setSensors(prev => ({
                ...prev,
                [id]: { ...prev[id], result: res.data }
              }));
            }
          } catch (e) {
            console.error('Simulation error:', e);
          }
        };

        triggerSim(); // initial call
        intervals[id] = setInterval(triggerSim, 5000); // then every 5s
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [sensors[1].running, sensors[2].running]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={24} color="#356C51" />
          Live Sensor Simulation
        </h3>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Simulating live data feeds from remote soil sensors directly to the prediction ML model. 
          Data generated here is <b>not saved</b> to the database.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[1, 2].map(id => (
          <div key={id} className="monitor-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: sensors[id].running ? '4px solid #356C51' : '4px solid #ccc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Sensor Node {id}</h4>
              <button 
                onClick={() => toggleSensor(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', border: 'none',
                  backgroundColor: sensors[id].running ? '#fee2e2' : '#dcfce7',
                  color: sensors[id].running ? '#dc2626' : '#166534',
                  fontWeight: 'bold'
                }}
              >
                {sensors[id].running ? <><Square size={16} /> Stop</> : <><Play size={16} /> Start</>}
              </button>
            </div>

            {sensors[id].lastData ? (
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#666' }}>Latest Payload:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontFamily: 'monospace' }}>
                  <div>N: {sensors[id].lastData.nitrogen}</div>
                  <div>P: {sensors[id].lastData.phosphorous}</div>
                  <div>K: {sensors[id].lastData.potassium}</div>
                  <div>pH: {sensors[id].lastData.ph}</div>
                  <div>Temp: {sensors[id].lastData.temperature}°C</div>
                  <div>Moist: {sensors[id].lastData.moisture}%</div>
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
                Waiting for sensor data...
              </div>
            )}

            {sensors[id].result && (
              <div style={{ backgroundColor: '#EBF4EE', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#356C51' }}>AI Prediction:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span>Crop Rec:</span> <strong>{sensors[id].result.crop_recommendation}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span>Soil Risk:</span> <strong style={{ color: sensors[id].result.soil_risk === 'High Risk' ? '#dc2626' : 'inherit' }}>{sensors[id].result.soil_risk}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Salinity:</span> <strong>{sensors[id].result.salinity_stress}</strong>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
      <div className="banner" style={{ marginBottom: '1.5rem' }}>
        <h2>System Administration</h2>
        <p>Global oversight of AFALM platform usage and metrics</p>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('overview')} 
          style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'overview' ? '3px solid #356C51' : 'none', color: activeTab === 'overview' ? '#356C51' : '#666', fontWeight: activeTab === 'overview' ? 'bold' : 'normal' }}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('simulator')} 
          style={{ background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'simulator' ? '3px solid #356C51' : 'none', color: activeTab === 'simulator' ? '#356C51' : '#666', fontWeight: activeTab === 'simulator' ? 'bold' : 'normal' }}
        >
          Sensor Simulator
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
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
        </>
      )}

      {activeTab === 'simulator' && (
        <SensorSimulator />
      )}
    </div>
  );
}
