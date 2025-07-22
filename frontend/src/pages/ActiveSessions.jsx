import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../utils/useApi';

// Helper function to format device info
const formatDeviceInfo = (deviceInfo) => {
  if (!deviceInfo) return 'Unknown';
  const parts = [];
  if (deviceInfo.browser) parts.push(deviceInfo.browser);
  if (deviceInfo.version) parts.push(deviceInfo.version);
  if (deviceInfo.os) parts.push(deviceInfo.os);
  if (deviceInfo.device && deviceInfo.device !== 'Other') parts.push(deviceInfo.device);
  return parts.length > 0 ? parts.join(' ') : 'Unknown';
};

function ActiveSessions() {
  const callApi = useApi();

  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchActiveSessions = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await callApi('/sessions', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setSessionsData(data.activeSessions); // Assuming the API returns { success: true, activeSessions: [ ... ] }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to fetch active sessions.');
      }
    } catch (err) {
      console.error('Active Sessions Fetch Error:', err);
      setError('Network error or unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, [callApi]);

  const handleRevokeSession = async (sessionIdToRevoke) => {
    setMessage('');
    setError('');
    if (window.confirm('Are you sure you want to revoke this session?')) {
      try {
        const response = await callApi('/revoke-token', {
          method: 'DELETE',
          body: JSON.stringify({ sessionId: sessionIdToRevoke }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || 'Session revoked successfully!');
          fetchActiveSessions(); // Refresh the list of sessions
        } else {
          setError(data.message || 'Failed to revoke session.');
        }
      } catch (err) {
        console.error('Revoke Session Error:', err);
        setError('Network error or unable to connect to the server.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <p>Loading active sessions...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Active Sessions</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {sessionsData && sessionsData.length > 0 ? (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Created At</th>
                <th>Last Used</th>
                <th>IP Address</th>
                <th>Device</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessionsData.map((session) => (
                <tr key={session.sessionId}>
                  <td>{session.sessionId.substring(0, 8)}...</td>
                  <td>{new Date(session.createdAt).toLocaleString()}</td>
                  <td>{session.loginTime ? new Date(session.loginTime).toLocaleString() : 'N/A'}</td> {/* Handle null loginTime */}
                  <td>{session.ipAddress || 'N/A'}</td> {/* Handle null ipAddress */}
                  <td>{formatDeviceInfo(session.deviceDetails)}</td>
                  <td>
                    <button
                      onClick={() => handleRevokeSession(session.sessionId)}
                      className="btn btn-danger btn-sm"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No active sessions found.</p>
      )}
      
    </div>
  );
}

export default ActiveSessions;
