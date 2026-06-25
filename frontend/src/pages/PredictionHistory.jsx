import React, { useEffect, useState } from 'react';
import { getPredictionHistory } from '../services/api';

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getPredictionHistory();
        if (response.success) {
          setHistory(response.data);
        } else {
          setError('Failed to fetch history');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading history...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div className="diagnostics-page">
      <div className="banner">
        <h2>Prediction History</h2>
        <p>Review your previous plant disease AI scans</p>
      </div>

      <div className="history-container" style={{ padding: '0 2rem' }}>
        {history.length === 0 ? (
          <p>No previous predictions found.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item._id} className="history-card">
                <div className="history-details">
                  <h4>{item.disease}</h4>
                  <p><strong>File:</strong> {item.filename}</p>
                  <p><strong>Confidence:</strong> {(item.confidence * 100).toFixed(2)}%</p>
                  <p><strong>Inference Time:</strong> {item.inference_time_ms} ms</p>
                  <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="confidence-indicator">
                  <div className="confidence-bar" style={{ width: '100px', height: '8px', backgroundColor: '#EBF4EE', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${item.confidence * 100}%`, height: '100%', backgroundColor: '#356C51' }}
                    ></div>
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
