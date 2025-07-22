import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Login Response:', data);
      if (response.ok) {
        login(data.accessToken);
        alert(data.message || 'Login successful!');
        navigate('/');
      } else {
        alert(data.message || JSON.stringify(data));
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Error during login.');
    }
  };

  return (
    <div>
      <h1>Login (POST)</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} /><br />
        <button type="submit">Login</button>
      </form>
      <br />
      <Link to="/forgot-password">Forgot Password?</Link>
      <br />
      <Link to="/signup">Don't have an account? Signup</Link>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Login;