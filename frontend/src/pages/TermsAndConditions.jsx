import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import afalmLogo from '../assets/Afalm_Logo.png';

export default function TermsAndConditions() {
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
          <FileText size={48} color="#0B311E" style={{ marginBottom: '1rem' }} />
          <h1 style={{ color: '#0B311E', fontSize: '2rem', marginBottom: '0.5rem' }}>Terms and Conditions</h1>
          <p style={{ color: '#666' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div style={{ color: '#333', lineHeight: '1.6' }}>
          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>1. Introduction</h2>
          <p>Welcome to the AFALM platform. By accessing or using our services, you agree to be bound by these Terms and Conditions.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>2. Nature of Guidance</h2>
          <p>Because of this, AfAlm was designed to attach a confidence score to every alert, and farmers were told clearly, from the start, that the system gives supplementary guidance, not a replacement for their own judgement.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>3. User Responsibilities</h2>
          <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>4. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Your continued use of the platform constitutes your acceptance of the updated terms.</p>
        </div>
      </div>
    </div>
  );
}
