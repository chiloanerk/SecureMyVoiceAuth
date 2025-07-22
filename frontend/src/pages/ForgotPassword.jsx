import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Forgot Password Response:', data);
      alert(data.message || JSON.stringify(data));
    } catch (error) {
      console.error('Forgot Password Error:', error);
      alert('Error during forgot password request.');
    }
  };

  return (
    <div>
      <h1>Forgot Password (POST)</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
        <button type="submit">Send Reset Email</button>
      </form>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default ForgotPassword;