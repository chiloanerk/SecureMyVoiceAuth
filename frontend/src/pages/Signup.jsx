import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../utils/useApi'; // Use the new useApi hook
import { useAuth } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const callApi = useApi(); // Initialize the API hook

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    // Basic email format validation
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
      const response = await callApi('/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and session ID
        login(data.accessToken, data.refreshToken, data.sessionId); // Assuming login handles refresh and session
        setMessage(data.message || 'Signup successful! Please verify your email.');
        // Optionally, navigate to a verification page or show a success message
        navigate('/verify-email', { state: { email: formData.email, verificationToken: data.verificationToken } });
      } else {
        // Handle API validation errors or other server errors
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map(err => err.msg).join(', '));
        } else {
          setError(data.message || 'An unexpected error occurred during signup.');
        }
      }
    } catch (err) {
      console.error('Signup Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Sign Up</h1>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password (min 8 characters)"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      
    </div>
  );
}

export default Signup;