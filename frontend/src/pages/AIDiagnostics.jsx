import React, { useState } from 'react';

// Reusable SVG Gauge Component
const NutrientGauge = ({ label, value, unit, total, color, status, statusColor }) => {
  const percentage = (value / total) * 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="gauge-container">
      <div className="gauge-label">{label}</div>
      <div className="gauge-svg-wrapper">
        <svg width="140" height="140" viewBox="0 0 120 120">
          <circle 
            cx="60" cy="60" r={radius} 
            fill="none" stroke="#F0F4F2" strokeWidth="12" 
          />
          <circle 
            cx="60" cy="60" r={radius} 
            fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="gauge-center-text">
          <span className="gauge-value">{value}</span>
          <span className="gauge-unit">{unit}</span>
        </div>
      </div>
      <div className="gauge-status-container">
        <div className="gauge-status-label">Optimal Range</div>
        <div className="gauge-status-value" style={{ color: statusColor }}>{status}</div>
      </div>
    </div>
  );
};

export default function AIDiagnostics() {
  const [activeTab, setActiveTab] = useState('Prediction');

  return (
    <div className="diagnostics-page">
      {/* Top Banner */}
      <div className="banner">
        <h2>Plant Disease Detection System</h2>
        <p>AI-Powered Crop Disease Identification | MLOps Pipeline</p>
      </div>

      {/* Internal Tabs */}
      <div className="internal-tabs">
        <button 
          className={`int-tab ${activeTab === 'Prediction' ? 'active' : ''}`}
          onClick={() => setActiveTab('Prediction')}
        >
          Prediction
        </button>
        <button 
          className={`int-tab ${activeTab === 'Retraining' ? 'active' : ''}`}
          onClick={() => setActiveTab('Retraining')}
        >
          Retraining
        </button>
        <button 
          className={`int-tab ${activeTab === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('Dashboard')}
        >
          Dashboard
        </button>
      </div>

      {/* System Monitoring */}
      <div className="section-header">
        <h3>System Monitoring</h3>
      </div>
      <div className="monitoring-grid">
        <div className="monitor-card">
          <div className="monitor-label">ML MODEL UPTIME</div>
          <div className="monitor-val text-green">99.9%</div>
          <div className="monitor-sub">Operational</div>
        </div>
        <div className="monitor-card">
          <div className="monitor-label">TOTAL SCANS TODAY</div>
          <div className="monitor-val">142</div>
        </div>
        <div className="monitor-card">
          <div className="monitor-label">AI CONFIDENCE AVG</div>
          <div className="monitor-val text-green">94.5%</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="diagnostics-grid">
        {/* Left Column: Disease Prediction */}
        <div className="prediction-col">
          <div className="section-header">
            <h3>Disease Prediction</h3>
          </div>
          
          <div className="upload-box">
            <div className="upload-circle"></div>
            <div className="upload-text">Click to upload or drag and drop</div>
            <div className="upload-sub">Upload leaf images (PNG, JPG)</div>
          </div>
          
          <button className="btn-analyze" disabled>Analyze Images</button>
        </div>

        {/* Right Column: Soil Nutrients */}
        <div className="nutrients-col">
          <div className="section-header space-between">
            <h3>Soil Nutrients</h3>
            <span className="details-link">DETAILS</span>
          </div>

          <div className="nutrient-cards">
            <div className="nutrient-card">
              <NutrientGauge 
                label="NITROGEN (N)"
                value={60}
                unit="ppm"
                total={100}
                color="#1E4631"
                status="BALANCED"
                statusColor="#1E4631"
              />
            </div>
            
            <div className="nutrient-card">
              <NutrientGauge 
                label="PHOSPHORUS (P)"
                value={12}
                unit="ppm"
                total={100}
                color="#F2C94C"
                status="MONITOR"
                statusColor="#F2C94C"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
