import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../utils/useApi';

function UpdateProfile() {
  const callApi = useApi();

  const [formData, setFormData] = useState({
    email: '',
    username: '', // Assuming username can also be updated
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Set to true initially to fetch data
  const [submitting, setSubmitting] = useState(false);

  // Fetch current profile data to pre-fill the form
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await callApi('/profile', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            email: data.user.email || '',
            username: data.user.username || '',
          });
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch current profile data.');
        }
      } catch (err) {
        console.error('Error fetching current profile:', err);
        setError('Network error or unable to connect to the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentProfile();
  }, [callApi]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required.');
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

    setSubmitting(true);
    try {
      const response = await callApi('/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Profile updated successfully!');
        // Optionally, refresh profile data after update
        // You might want to re-fetch profile data or update AuthContext if user data is stored there
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map(err => err.msg).join(', '));
        } else {
          setError(data.message || 'An unexpected error occurred during profile update.');
        }
      }
    } catch (err) {
      console.error('Update Profile Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Update Profile</h1>
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
          <label htmlFor="username">Username (Optional):</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      
    </div>
  );
}

export default UpdateProfile;
