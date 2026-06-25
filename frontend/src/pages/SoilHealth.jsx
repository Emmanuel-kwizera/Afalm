import React, { useState, useEffect } from 'react';
import { predictSoilMetrics, saveSoilPredictionToHistory, getSoilPredictionHistory } from '../services/api';

export default function SoilHealth() {
  const [formData, setFormData] = useState({
    nitrogen: '', phosphorous: '', potassium: '', temperature: '',
    humidity: '', moisture: '', ph: '', rainfall: '',
    soil_type: 'Loamy', crop_type: 'Wheat'
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await getSoilPredictionHistory();
      if (res.success) setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch soil history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    const payload = {
      nitrogen: parseFloat(formData.nitrogen),
      phosphorous: parseFloat(formData.phosphorous),
      potassium: parseFloat(formData.potassium),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      moisture: parseFloat(formData.moisture),
      ph: parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall),
      soil_type: formData.soil_type,
      crop_type: formData.crop_type
    };

    try {
      const response = await predictSoilMetrics(payload);
      if (response.success) {
        setResults(response.data);
        // Save to Node backend history
        await saveSoilPredictionToHistory({
          ...payload,
          ...response.data
        });
        // Refresh history
        fetchHistory();
      } else {
        setError(response.detail || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please make sure backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page-content">
      <div className="banner">
        <h2>Soil Nutrient & Crop Prediction</h2>
        <p>Analyze your soil metrics for personalized farming recommendations</p>
      </div>

      <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <form id="soil-form" className="soil-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} onSubmit={handleAnalyze}>
          <div className="form-group">
            <label>Nitrogen (N)</label>
            <input type="number" name="nitrogen" required step="0.1" placeholder="e.g. 90" className="form-control" value={formData.nitrogen} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phosphorous (P)</label>
            <input type="number" name="phosphorous" required step="0.1" placeholder="e.g. 42" className="form-control" value={formData.phosphorous} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Potassium (K)</label>
            <input type="number" name="potassium" required step="0.1" placeholder="e.g. 43" className="form-control" value={formData.potassium} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Temperature (°C)</label>
            <input type="number" name="temperature" required step="0.1" placeholder="e.g. 20.8" className="form-control" value={formData.temperature} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Humidity (%)</label>
            <input type="number" name="humidity" required step="0.1" placeholder="e.g. 82" className="form-control" value={formData.humidity} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Moisture</label>
            <input type="number" name="moisture" required step="0.1" placeholder="e.g. 50" className="form-control" value={formData.moisture} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>pH Level</label>
            <input type="number" name="ph" required step="0.1" placeholder="e.g. 6.5" className="form-control" value={formData.ph} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Rainfall (mm)</label>
            <input type="number" name="rainfall" required step="0.1" placeholder="e.g. 202.9" className="form-control" value={formData.rainfall} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Soil Type</label>
            <div className="form-select-wrapper" style={{ padding: '0', margin: '0' }}>
              <select name="soil_type" required value={formData.soil_type} onChange={handleChange} style={{ padding: '0.8rem', width: '100%', border: '1px solid var(--input-border)', borderRadius: '8px', backgroundColor: 'var(--input-bg)' }}>
                <option value="Black">Black</option>
                <option value="Clayey">Clayey</option>
                <option value="Loamy">Loamy</option>
                <option value="Red">Red</option>
                <option value="Sandy">Sandy</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Crop Type</label>
            <div className="form-select-wrapper" style={{ padding: '0', margin: '0' }}>
              <select name="crop_type" required value={formData.crop_type} onChange={handleChange} style={{ padding: '0.8rem', width: '100%', border: '1px solid var(--input-border)', borderRadius: '8px', backgroundColor: 'var(--input-bg)' }}>
                <option value="Barley">Barley</option>
                <option value="Cotton">Cotton</option>
                <option value="Ground Nuts">Ground Nuts</option>
                <option value="Maize">Maize</option>
                <option value="Millets">Millets</option>
                <option value="Oil seeds">Oil seeds</option>
                <option value="Paddy">Paddy</option>
                <option value="Pulses">Pulses</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Tobacco">Tobacco</option>
                <option value="Wheat">Wheat</option>
              </select>
            </div>
          </div>
        </form>
        
        <button type="submit" form="soil-form" className="btn-primary" style={{ marginTop: '2rem' }} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Soil'}
        </button>
        {error && <div className="error-msg" style={{ marginTop: '1rem' }}>{error}</div>}
      </div>

      {results && (
        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Analysis Results</h3>
          <div className="monitoring-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="monitor-card">
              <div className="monitor-label">Crop Recommendation</div>
              <div className="monitor-val text-green" style={{ fontSize: '1.5rem' }}>{results.crop_recommendation || '--'}</div>
            </div>
            <div className="monitor-card">
              <div className="monitor-label">Soil Health Risk</div>
              <div className="monitor-val" style={{ fontSize: '1.5rem', color: results.soil_risk === 'High Risk' ? '#F26C4F' : 'inherit' }}>{results.soil_risk || '--'}</div>
            </div>
            <div className="monitor-card">
              <div className="monitor-label">Fertilizer Prescription</div>
              <div className="monitor-val text-green" style={{ fontSize: '1.5rem' }}>{results.fertilizer_prescription || '--'}</div>
            </div>
            <div className="monitor-card">
              <div className="monitor-label">Target N-P-K</div>
              <div className="monitor-val" style={{ fontSize: '1.5rem' }}>
                {results.target_n ? `${results.target_n}:${results.target_p}:${results.target_k}` : '--'}
              </div>
            </div>
            <div className="monitor-card">
              <div className="monitor-label">Salinity Stress</div>
              <div className="monitor-val" style={{ fontSize: '1.5rem' }}>{results.salinity_stress || '--'}</div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Previous Soil Analyses</h3>
        {isLoadingHistory ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No previous soil analyses found.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item._id} className="history-card">
                <div className="history-details" style={{ flex: '1' }}>
                  <h4>Recommended Crop: <span className="text-green">{item.crop_recommendation}</span></h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <p><strong>Inputs:</strong></p>
                      <p>Crop: {item.crop_type} | Soil: {item.soil_type}</p>
                      <p>N: {item.nitrogen} | P: {item.phosphorous} | K: {item.potassium}</p>
                      <p>Temp: {item.temperature}°C | Hum: {item.humidity}% | Moist: {item.moisture}</p>
                      <p>pH: {item.ph} | Rain: {item.rainfall}mm</p>
                    </div>
                    <div>
                      <p><strong>Analysis:</strong></p>
                      <p>Risk: {item.soil_risk}</p>
                      <p>Fertilizer: {item.fertilizer_prescription}</p>
                      <p>Target NPK: {item.target_n}:{item.target_p}:{item.target_k}</p>
                      <p>Salinity: {item.salinity_stress}</p>
                    </div>
                    <div>
                      <p><strong>Date:</strong></p>
                      <p>{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
