import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';

export default function Settings() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    mainCrop: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.data) {
          setFormData({
            fullName: response.data.fullName || '',
            phoneNumber: response.data.phoneNumber || '',
            email: response.data.email || '',
            mainCrop: response.data.mainCrop || '',
            role: response.data.role || ''
          });
        }
      } catch (err) {
        setError('Failed to fetch user profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        mainCrop: formData.mainCrop
      };
      
      const response = await updateUserProfile(payload);
      if (response.success) {
        setMessage('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="page-content">Loading profile...</div>;
  }

  return (
    <div className="page-content">
      <div className="banner">
        <h2>Account Settings</h2>
        <p>Manage your personal information and preferences</p>
      </div>

      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Profile Information</h3>
        
        {message && <div className="success-msg" style={{ marginBottom: '1rem', color: 'green', backgroundColor: '#e8f5e9', padding: '1rem', borderRadius: '8px' }}>{message}</div>}
        {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              className="form-control" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              value={formData.email} 
              disabled 
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              title="Email cannot be changed"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber" 
              className="form-control" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Main Crop Focus</label>
            <input 
              type="text" 
              name="mainCrop" 
              className="form-control" 
              value={formData.mainCrop} 
              onChange={handleChange} 
              placeholder="e.g. Maize, Coffee, Tea"
            />
          </div>

          <div className="form-group">
            <label>Account Role</label>
            <input 
              type="text" 
              name="role" 
              className="form-control" 
              value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} 
              disabled 
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSaving} style={{ marginTop: '1rem' }}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
