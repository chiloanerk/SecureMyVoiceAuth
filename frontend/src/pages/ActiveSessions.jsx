import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function ActiveSessions() {
  const { accessToken, logout } = useAuth();
  const [sessionsData, setSessionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveSessions = async () => {
      if (!accessToken) {
        setLoading(false);
        setError('No access token found. Please log in.');
        return;
      }
      try {
        const response = await api('/sessions', {
          method: 'GET',
        }, accessToken, logout);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSessionsData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSessions();
  }, [accessToken, logout]);

  if (loading) return <div>Loading active sessions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Active Sessions (GET)</h1>
      <p>Note: This route requires authentication.</p>
      {sessionsData ? (
        <pre>{JSON.stringify(sessionsData, null, 2)}</pre>
      ) : (
        <p>No active sessions found.</p>
      )}
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default ActiveSessions;