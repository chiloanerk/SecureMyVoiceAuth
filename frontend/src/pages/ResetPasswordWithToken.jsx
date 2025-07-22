import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useApi from '../utils/useApi';

function ResetPasswordWithToken() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callApi = useApi();

  const [formData, setFormData] = useState({
    newPassword: '',
  });

  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!token) {
      setError('Password reset token is missing.');
      return false;
    }
    if (!formData.newPassword) {
      setError('New password is required.');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
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
      const response = await callApi(`/reset-password-with-token?token=${token}`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password has been reset successfully!');
        setFormData({ newPassword: '' }); // Clear form
        setToken(''); // Clear token
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful reset
        }, 2000); // Redirect after 2 seconds
      } else {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors.map(err => err.msg).join(', '));
        } else {
          setError(data.message || 'An unexpected error occurred during password reset.');
        }
      }
    } catch (err) {
      console.error('Reset Password With Token Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Reset Password</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      
    </div>
  );
}

export default ResetPasswordWithToken;