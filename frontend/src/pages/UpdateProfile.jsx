import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function UpdateProfile() {
  
  const { accessToken, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
  });

  // Optional: Fetch current profile data to pre-fill the form
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (!accessToken) {
        console.warn('No access token found. Cannot fetch profile for pre-fill.');
        return;
      }
      try {
        const response = await api('/profile', {
          method: 'GET',
        }, accessToken, logout);

        if (response.ok) {
          const data = await response.json();
          setFormData({ email: data.user.email });
        }
      } catch (error) {
        console.error('Error fetching current profile:', error);
      }
    };
    fetchCurrentProfile();
  }, [accessToken, logout]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api('/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      }, accessToken, logout);
      const data = await response.json();
      console.log('Update Profile Response:', data);
      alert(data.message || JSON.stringify(data));
    } catch (error) {
      console.error('Update Profile Error:', error);
      alert('Error updating profile.');
    }
  };

  return (
    <div>
      <h1>Update Profile (PUT)</h1>
      <p>Note: This route requires authentication.</p>
      <form onSubmit={handleSubmit}>
        
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
        <button type="submit">Update Profile</button>
      </form>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default UpdateProfile;