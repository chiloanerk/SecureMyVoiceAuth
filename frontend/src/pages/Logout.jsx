import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useApi from '../utils/useApi';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const callApi = useApi();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await callApi('/logout', {
        method: 'DELETE',
      });

      if (response.ok) {
        logout(); // Clear authentication state
        setMessage('Logged out successfully!');
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful logout
        }, 1500); // Redirect after 1.5 seconds
      } else {
        const data = await response.json();
        setError(data.message || 'An unexpected error occurred during logout.');
      }
    } catch (err) {
      console.error('Logout Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Logout</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <p>Are you sure you want to log out?</p>
      <button onClick={handleLogout} className="btn btn-danger" disabled={loading}>
        {loading ? 'Logging Out...' : 'Logout'}
      </button>
      
    </div>
  );
}

export default Logout;
