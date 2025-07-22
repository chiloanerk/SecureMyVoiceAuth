import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../utils/useApi';

function ResetPassword() {
  const callApi = useApi();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword) {
      setError('Both current and new passwords are required.');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('New password cannot be the same as the current password.');
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
      const response = await callApi('/reset-password', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password changed successfully!');
        setFormData({ currentPassword: '', newPassword: '' }); // Clear form
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map(err => err.msg).join(', '));
        } else {
          setError(data.message || 'An unexpected error occurred during password reset.');
        }
      }
    } catch (err) {
      console.error('Reset Password Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Change Password</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password (min 8 characters)"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
      
    </div>
  );
}

export default ResetPassword;
