import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="form-container">
      <h1>Welcome to SecureMyVoice</h1>
      <p>This is the home page. Use the navigation bar above to access different sections of the application.</p>

      <div className="public-links" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h2>Public Access Pages:</h2>
        <p>
          <Link to="/forgot-password">Forgot Password</Link>
        </p>
        <p>
          <Link to="/verify-email">Verify Email</Link>
        </p>
        <p>
          <Link to="/resend-verification-email">Resend Verification Email</Link>
        </p>
        <p>
          <Link to="/reset-password-with-token">Reset Password with Token</Link>
        </p>
      </div>
    </div>
  );
}

export default Home;