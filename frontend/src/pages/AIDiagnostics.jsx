import React, { useState, useRef } from 'react';
import { predictDisease, savePredictionToHistory } from '../services/api';

export default function AIDiagnostics() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setSelectedFiles(files);
      setResults([]);
      setError(null);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setResults([]);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsPredicting(true);
    setError(null);
    setResults([]);

    try {
      // Create Object URLs for previews
      const filePreviews = selectedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      const response = await predictDisease(selectedFiles);
      
      if (response.success) {
        // Map predictions back to the file previews
        const combinedResults = response.predictions.map((pred, idx) => ({
          ...pred,
          preview: filePreviews[idx].preview
        }));
        setResults(combinedResults);

        // Save each prediction to the Node backend history asynchronously
        combinedResults.forEach((res) => {
          savePredictionToHistory({
            filename: res.filename,
            disease: res.disease,
            confidence: res.confidence,
            inference_time_ms: res.inference_time_ms
          }).catch(e => console.error("Failed to save history:", e));
        });

      } else {
        setError('Prediction failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error or prediction service is offline.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="diagnostics-page">
      <div className="banner">
        <h2>AI Disease Diagnostics</h2>
        <p>Upload leaf images for real-time disease detection</p>
      </div>

      <div className="upload-container">
        <div 
          className={`upload-box ${isDragging ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: 'pointer', border: isDragging ? '2px dashed #356C51' : '2px dashed #D3E0D8' }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            multiple 
            hidden 
          />
          <div className="upload-circle"></div>
          <div className="upload-text">
            {selectedFiles.length > 0 
              ? `${selectedFiles.length} file(s) selected` 
              : 'Click to upload or drag and drop'}
          </div>
          <div className="upload-sub">Upload leaf images (PNG, JPG)</div>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={handlePredict}
          disabled={selectedFiles.length === 0 || isPredicting}
          style={{ width: '200px', margin: '0 auto', display: 'block' }}
        >
          {isPredicting ? 'Analyzing...' : 'Analyze Images'}
        </button>

        {error && <div className="error-msg" style={{ marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
      </div>

      {results.length > 0 && (
        <div className="results-container">
          <h3 style={{ margin: '2rem 0 1rem 0' }}>Prediction Results</h3>
          <div className="results-grid">
            {results.map((result, idx) => (
              <div key={idx} className="result-card">
                <img src={result.preview} alt="Leaf" className="result-img" />
                <div className="result-info">
                  <div className="result-disease" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {result.disease}
                  </div>
                  <div className="result-confidence" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Confidence: {(result.confidence * 100).toFixed(2)}%
                  </div>
                  <div className="confidence-bar" style={{ width: '100%', height: '8px', backgroundColor: '#EBF4EE', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${result.confidence * 100}%`, height: '100%', backgroundColor: '#356C51' }}
                    ></div>
                  </div>
                  <div className="result-time" style={{ fontSize: '0.8rem', color: '#A0B0A5' }}>
                    Inference: {result.inference_time_ms}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
