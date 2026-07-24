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
          <h1 style={{ color: '#0B311E', fontSize: '2rem', marginBottom: '0.5rem' }}>Terms of Service</h1>
          <p style={{ color: '#666' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div style={{ color: '#333', lineHeight: '1.6' }}>
          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>1. Acceptance of Terms</h2>
          <p>By accessing, registering for, or using the AFALM platform ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>2. Nature of AI Guidance & Disclaimer</h2>
          <p>AFALM provides advanced AI-driven crop disease diagnostics and soil health predictions. <strong>These insights serve as powerful supplementary tools designed to enhance your agricultural decision-making alongside your standard farming maintenance and practices.</strong> Every diagnostic alert includes a confidence score, which serves as a highly calibrated measure of the model's certainty regarding the identified condition. While our AI models are trained on extensive datasets to deliver robust and reliable insights, agricultural environments remain naturally complex, and you assume responsibility for any final farming decisions executed based on the Service.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>3. User Accounts and Security</h2>
          <p>To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are solely responsible for safeguarding your password and for all activities that occur under your account.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>4. Acceptable Use</h2>
          <p>You agree not to misuse the Service. This includes, but is not limited to: uploading malicious software, attempting to breach the system's security, reverse-engineering the AI models, or using the platform for illegal activities.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>5. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, AFALM and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of crops, yield reduction, loss of profits, or data loss, resulting from your use of or inability to use the Service.</p>

          <h2 style={{ color: '#0B311E', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>6. Modifications to the Service</h2>
          <p>We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We may also revise these Terms from time to time; your continued use of the platform constitutes acceptance of those changes.</p>
        </div>
      </div>
    </div>
  );
}
