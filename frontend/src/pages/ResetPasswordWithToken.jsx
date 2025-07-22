import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

function ResetPasswordWithToken() {
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password-with-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Reset Password With Token Response:', data);
      alert(data.message || JSON.stringify(data));
    } catch (error) {
      console.error('Reset Password With Token Error:', error);
      alert('Error resetting password with token.');
    }
  };

  return (
    <div>
      <h1>Reset Password With Token (POST)</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="token" placeholder="Reset Token" value={formData.token} onChange={handleChange} /><br />
        <input type="password" name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleChange} /><br />
        <button type="submit">Reset Password</button>
      </form>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default ResetPasswordWithToken;