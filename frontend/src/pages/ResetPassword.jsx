import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function ResetPassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { accessToken, logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api('/reset-password', {
        method: 'POST',
        body: JSON.stringify(formData),
      }, accessToken, logout);

      const data = await response.json();
      console.log('Reset Password Response:', data);
      alert(data.message || JSON.stringify(data));
    } catch (error) {
      console.error('Reset Password Error:', error);
      alert('Error resetting password.');
    }
  };

  return (
    <div>
      <h1>Reset Password (POST)</h1>
      <p>Note: This route requires authentication.</p>
      <form onSubmit={handleSubmit}>
        <input type="password" name="currentPassword" placeholder="Current Password" value={formData.currentPassword} onChange={handleChange} /><br />
        <input type="password" name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleChange} /><br />
        <button type="submit">Reset Password</button>
      </form>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default ResetPassword;