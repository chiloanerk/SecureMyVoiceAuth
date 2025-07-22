import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function LoginHistory() {
  const { accessToken, logout } = useAuth();
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (!accessToken) {
        setLoading(false);
        setError('No access token found. Please log in.');
        return;
      }
      try {
        const response = await api('/history', {
          method: 'GET',
        }, accessToken, logout);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHistoryData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [accessToken, logout]);

  if (loading) return <div>Loading login history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Login History (GET)</h1>
      <p>Note: This route requires authentication.</p>
      {historyData ? (
        <pre>{JSON.stringify(historyData, null, 2)}</pre>
      ) : (
        <p>No login history found.</p>
      )}
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default LoginHistory;