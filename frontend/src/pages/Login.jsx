import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Microscope, History, ArrowRight } from 'lucide-react';
import { loginUser } from '../services/api';
import cornfieldHero from '../assets/cornfield_hero.png';
import afalmLogo from '../assets/Afalm_Logo.png';

export default function Login() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser(formData);
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">
        <img src={afalmLogo} alt="AFALM Logo" className="brand-logo" />
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Access your agricultural dashboard to manage your crop health, review diagnostics, and analyze your soil metrics.
        </p>
        
        <div className="features-grid">
          <div className="feature-badge">
            <Microscope size={18} color="#0B311E" />
            <span>AI Disease Detection</span>
          </div>
          <div className="feature-badge">
            <History size={18} color="#0B311E" />
            <span>Full Growth History</span>
          </div>
        </div>

        <img src={cornfieldHero} alt="Vibrant cornfield at sunrise" className="hero-image" />
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Login</h2>
          <p>Access your precise agricultural journey.</p>

          {error && <div className="error-msg">{error}</div>}

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
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  name="password"
                  className="form-control" 
                  placeholder="********" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <Link to="/reset-password" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '2rem' }}>
              {isLoading ? 'Logging In...' : 'Login'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-links">
            Don't have an account? <Link to="/register">Create one here</Link>
          </div>

          <div className="auth-footer">
            <a href="#" style={{color: 'inherit', textDecoration: 'none'}}>Terms of Service</a>
            <a href="#" style={{color: 'inherit', textDecoration: 'none'}}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
