import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

function ResendVerificationEmail() {
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/resend-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Resend Verification Email Response:', data);
      alert(data.message || JSON.stringify(data));
    } catch (error) {
      console.error('Resend Verification Email Error:', error);
      alert('Error resending verification email.');
    }
  };

  return (
    <div>
      <h1>Resend Verification Email (POST)</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
        <button type="submit">Resend Verification Email</button>
      </form>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default ResendVerificationEmail;