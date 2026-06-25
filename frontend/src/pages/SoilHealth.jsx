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

      <div className="light-soil-card">
        <form id="soil-form" onSubmit={handleAnalyze}>
          <div className="light-form-grid">
            
            {/* Row 1 */}
            <div className="light-form-group">
              <label className="light-label">Nitrogen (N)</label>
              <div className="light-input-group">
                <input type="range" name="nitrogen" className="light-slider" min="0" max="200" step="0.1" value={formData.nitrogen || 0} onChange={handleChange} />
                <input type="number" name="nitrogen" className="light-number-input" required placeholder="0" value={formData.nitrogen} onChange={handleChange} />
              </div>
            </div>
            <div className="light-form-group">
              <label className="light-label">Phosphorous (P)</label>
              <div className="light-input-group">
                <input type="range" name="phosphorous" className="light-slider" min="0" max="100" step="0.1" value={formData.phosphorous || 0} onChange={handleChange} />
                <input type="number" name="phosphorous" className="light-number-input" required placeholder="0" value={formData.phosphorous} onChange={handleChange} />
              </div>
            </div>
            <div className="light-form-group">
              <label className="light-label">Potassium (K)</label>
              <div className="light-input-group">
                <input type="range" name="potassium" className="light-slider" min="0" max="300" step="0.1" value={formData.potassium || 0} onChange={handleChange} />
                <input type="number" name="potassium" className="light-number-input" required placeholder="0" value={formData.potassium} onChange={handleChange} />
              </div>
            </div>
            <div className="light-form-group">
              <label className="light-label">Temperature (°C)</label>
              <div className="light-input-group">
                <input type="range" name="temperature" className="light-slider" min="-10" max="50" step="0.1" value={formData.temperature || 0} onChange={handleChange} />
                <input type="number" name="temperature" className="light-number-input" required placeholder="0.0" value={formData.temperature} onChange={handleChange} />
              </div>
            </div>

            {/* Row 2 */}
            <div className="light-form-group">
              <label className="light-label">Humidity (%)</label>
              <div className="light-input-group">
                <input type="range" name="humidity" className="light-slider" min="0" max="100" step="0.1" value={formData.humidity || 0} onChange={handleChange} />
                <input type="number" name="humidity" className="light-number-input" required placeholder="0" value={formData.humidity} onChange={handleChange} />
              </div>
            </div>
            <div className="light-form-group">
              <label className="light-label">Moisture</label>
              <div className="light-input-group">
                <input type="range" name="moisture" className="light-slider" min="0" max="100" step="0.1" value={formData.moisture || 0} onChange={handleChange} />
                <input type="number" name="moisture" className="light-number-input" required placeholder="0" value={formData.moisture} onChange={handleChange} />
              </div>
            </div>
            <div className="light-form-group">
              <label className="light-label">pH Level</label>
              <div className="light-input-group">
                <input type="range" name="ph" className="light-slider" min="0" max="14" step="0.1" value={formData.ph || 0} onChange={handleChange} />
                <input type="number" name="ph" className="light-number-input" required placeholder="0.0" value={formData.ph} onChange={handleChange} />
              </div>
            </div>
            <div className="light-form-group">
              <label className="light-label">Rainfall (mm)</label>
              <div className="light-input-group">
                <input type="range" name="rainfall" className="light-slider" min="0" max="500" step="0.1" value={formData.rainfall || 0} onChange={handleChange} />
                <input type="number" name="rainfall" className="light-number-input" required placeholder="0.0" value={formData.rainfall} onChange={handleChange} />
              </div>
            </div>

            {/* Row 3 */}
            <div className="light-form-group">
              <label className="light-label">Soil Type</label>
              <select name="soil_type" className="light-select" required value={formData.soil_type} onChange={handleChange}>
                <option value="Black">Black</option>
                <option value="Clayey">Clayey</option>
                <option value="Loamy">Loamy</option>
                <option value="Red">Red</option>
                <option value="Sandy">Sandy</option>
              </select>
            </div>
            <div className="light-form-group">
              <label className="light-label">Crop Type</label>
              <select name="crop_type" className="light-select" required value={formData.crop_type} onChange={handleChange}>
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
          
          <button type="submit" className="btn-green-full" disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Soil'}
          </button>
        </form>

        {error && <div className="error-msg" style={{ marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
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
