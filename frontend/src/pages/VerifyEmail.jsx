import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useApi from '../utils/useApi';

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const callApi = useApi();

  const [formData, setFormData] = useState({
    email: '',
    verificationToken: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-populate email and token if passed from signup page
    if (location.state && location.state.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
    if (location.state && location.state.verificationToken) {
      setFormData(prev => ({ ...prev, verificationToken: location.state.verificationToken }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.verificationToken) {
      setError('Email and verification token are required.');
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await callApi('/verify-email', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Email verified successfully!');
        // Optionally, clear form data after successful verification
        setFormData({ email: '', verificationToken: '' });
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful verification
        }, 2000); // Redirect after 2 seconds
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map(err => err.msg).join(', '));
        } else {
          setError(data.message || 'An unexpected error occurred during email verification.');
        }
      }
    } catch (err) {
      console.error('Verify Email Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Verify Email</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="verificationToken">Verification Token:</label>
          <input
            type="text"
            id="verificationToken"
            name="verificationToken"
            value={formData.verificationToken}
            onChange={handleChange}
            placeholder="Enter the 6-digit token"
            required
            maxLength="6"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      <p>
        <Link to="/resend-verification-email">Resend Verification Email</Link>
      </p>
      
    </div>
  );
}

export default VerifyEmail;
