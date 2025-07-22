import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Logout() {
  const { accessToken, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await api('/logout', {
        method: 'DELETE',
      }, accessToken, logout);

      if (response.ok) {
        logout();
        alert('Logged out successfully!');
      }
      const data = await response.json();
      console.log('Logout Response:', data);
      alert(data.message || JSON.stringify(data));
    } catch (error) {
      console.error('Logout Error:', error);
      alert('Error during logout.');
    }
  };

  return (
    <div>
      <h1>Logout (DELETE)</h1>
      <p>Note: This route requires authentication.</p>
      <button onClick={handleLogout}>Logout</button>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Logout;