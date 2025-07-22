import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function VerifyEmail() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    verificationToken: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Verify Email Response:', data);
      if (response.ok) {
        alert(data.message || 'Email verified successfully!');
        navigate('/login'); // Redirect to login after successful verification
      } else {
        alert(data.message || JSON.stringify(data));
      }
    } catch (error) {
      console.error('Verify Email Error:', error);
      alert('Error during email verification.');
    }
  };

  return (
    <div>
      <h1>Verify Email (POST)</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
        <input type="text" name="verificationToken" placeholder="Verification Token" value={formData.verificationToken} onChange={handleChange} /><br />
        <button type="submit">Verify Email</button>
      </form>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default VerifyEmail;