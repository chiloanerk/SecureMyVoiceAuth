import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../utils/useApi';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const callApi = useApi();

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
      const response = await callApi('/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.accessToken, data.refreshToken, data.sessionId);
        setMessage(data.message || 'Login successful!');

        // Immediately try to fetch profile to test the initial token
        try {
          console.log('Login.jsx: Attempting to fetch profile immediately after login...');
          // Pass the newly received accessToken directly to the apiClient call
          const profileResponse = await callApi('/profile', { method: 'GET' }, data.accessToken);
          const profileData = await profileResponse.json();
          console.log('Login.jsx: Profile fetch response after login:', profileData);
          if (!profileResponse.ok) {
            console.error('Login.jsx: Initial profile fetch failed:', profileData.message);
          }
        } catch (profileError) {
          console.error('Login.jsx: Error fetching profile immediately after login:', profileError);
        }

        navigate('/'); // Navigate to home or dashboard after successful login
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map(err => err.msg).join(', '));
        } else {
          setError(data.message || 'An unexpected error occurred during login.');
        }
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
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
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      
    </div>
  );
}

export default Login;
