import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Sprout, Microscope, History, ArrowRight } from 'lucide-react';
import { registerUser } from '../services/api';
import cornfieldHero from '../assets/cornfield_hero.png';
import afalmLogo from '../assets/Afalm_Logo.png';

export default function Register() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/ai-diagnostics');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    mainCrop: ''
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
      const response = await registerUser(formData);
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/ai-diagnostics');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">
        <img src={afalmLogo} alt="AFALM Logo" className="brand-logo" />
        <h1 className="auth-title">Empowering the Earth's Stewards</h1>
        <p className="auth-subtitle">
          Join a network of professional agricultural operators. Use AI-driven diagnostics to protect your yield and track crop health history with precision.
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
          <h2>Create Account</h2>
          <p>Start your precise agricultural journey today.</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="fullName"
                  className="form-control" 
                  placeholder="Enter your full name" 
                  value={formData.fullName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

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
              <label>Phone Number</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input 
                  type="tel" 
                  name="phoneNumber"
                  className="form-control" 
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phoneNumber}
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
            </div>

            <div className="form-select-wrapper">
              <label style={{display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem'}}>Primary Crop</label>
              <div className="input-wrapper">
                <Sprout size={18} className="input-icon" />
                <select name="mainCrop" value={formData.mainCrop} onChange={handleChange} style={{paddingLeft: '2.8rem'}} required>
                  <option value="" disabled>Select your primary crop</option>
                  <option value="Corn">Corn</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Soybeans">Soybeans</option>
                  <option value="Rice">Rice</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <p className="crop-hint">
                Personalize your experience. Selecting your crop helps our AI provide more accurate disease predictions and saves your diagnostic history.
              </p>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-links">
            Already have an account? <Link to="/login">Login here</Link>
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
