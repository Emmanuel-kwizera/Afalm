import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import afalmLogo from '../assets/Afalm_Logo.png';

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to="/register" style={{ display: 'flex', alignItems: 'center', color: '#0B311E', textDecoration: 'none', fontWeight: '500' }}>
            <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
          </Link>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img src={afalmLogo} alt="AFALM Logo" style={{ height: '40px' }} />
          </div>
          <div style={{ width: '70px' }}></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} color="#0B311E" style={{ marginBottom: '1rem' }} />
          <h1 style={{ color: '#0B311E', fontSize: '2rem', marginBottom: '0.5rem' }}>Privacy Policy</h1>
          <p style={{ color: '#666' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div style={{ color: '#333', lineHeight: '1.6' }}>
          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>1. Information We Collect</h2>
          <p>When you use the AFALM platform, we collect the following types of information to provide our services:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, and phone number provided during registration.</li>
            <li><strong>Agricultural Data:</strong> Primary crop types, soil metrics (N, P, K, pH, moisture, temperature), and leaf imagery uploaded for diagnostics.</li>
            <li><strong>Usage Data:</strong> Diagnostic history and interaction metrics within the dashboard.</li>
          </ul>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>2. How We Use Your Data</h2>
          <p>Your data is used strictly for the following purposes:</p>
          <ul>
            <li>Providing real-time AI disease diagnostics and soil health recommendations.</li>
            <li>Maintaining a secure historical log of your farm's health for your personal review.</li>
            <li>Improving our machine learning models (uploaded leaf imagery may be anonymized and used to retrain and improve our diagnostic accuracy).</li>
          </ul>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>3. Data Security and Storage</h2>
          <p>We implement industry-standard security measures to protect your data. All user credentials and passwords are encrypted. Your agricultural data is stored securely in our MongoDB databases and cloud storage solutions.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>4. Data Sharing</h2>
          <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners for agricultural research purposes.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>5. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.</p>
        </div>
      </div>
    </div>
  );
}
