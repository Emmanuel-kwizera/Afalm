import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, History, ArrowRight } from 'lucide-react';
import { resetPassword } from '../services/api';
import cornfieldHero from '../assets/cornfield_bg.png';
import afalmLogo from '../assets/Afalm_Logo.png';

export default function ResetPassword() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/ai-diagnostics');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await resetPassword(formData);
      if (response.success) {
        setMessage('Password reset successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">
        <img src={afalmLogo} alt="AFALM Logo" className="brand-logo" />
        <h1 className="auth-title">Secure Your Account</h1>
        <p className="auth-subtitle">
          Regain access to your professional agricultural dashboard and continue your precise diagnostic journey.
        </p>

        <div className="features-grid">
          <div className="feature-badge">
            <ShieldCheck size={18} color="#0B311E" />
            <span>Secure Recovery</span>
          </div>
          <div className="feature-badge">
            <History size={18} color="#0B311E" />
            <span>Retain Your Data</span>
          </div>
        </div>

        <img src={cornfieldHero} alt="Vibrant cornfield at sunrise" className="hero-image" />
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Reset Password</h2>
          <p>Enter your email and a new secure password.</p>

          {error && <div className="error-msg">{error}</div>}
          {message && <div className="error-msg" style={{ backgroundColor: '#EBF4EE', color: '#0B311E' }}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="email@farm-example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  placeholder="********"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '2rem' }}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-links">
            Remembered your password? <Link to="/login">Back to Login</Link>
          </div>

          <div className="auth-footer">
            <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
