import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../utils/useApi';

// Helper function to format device info (reused from ActiveSessions.jsx)
const formatDeviceInfo = (deviceInfo) => {
  if (!deviceInfo) return 'Unknown';
  const parts = [];
  if (deviceInfo.browser) parts.push(deviceInfo.browser);
  if (deviceInfo.version) parts.push(deviceInfo.version);
  if (deviceInfo.os) parts.push(deviceInfo.os);
  if (deviceInfo.device && deviceInfo.device !== 'Other') parts.push(deviceInfo.device);
  return parts.length > 0 ? parts.join(' ') : 'Unknown';
};

function LoginHistory() {
  const callApi = useApi();

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoginHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await callApi('/history', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setHistoryData(data.history); // Assuming the API returns { success: true, history: [ ... ] }
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch login history.');
        }
      } catch (err) {
        console.error('Login History Fetch Error:', err);
        setError('Network error or unable to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [callApi]);

  if (loading) {
    return (
      <div className="page-content">
        <p>Loading login history...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Login History</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {historyData && historyData.length > 0 ? (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Device</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.loginTime ? new Date(entry.loginTime).toLocaleString() : 'N/A'}</td>
                  <td>{entry.ipAddress || 'N/A'}</td>
                  <td>{formatDeviceInfo(entry.deviceDetails)}</td>
                  <td>{entry.location || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No login history found.</p>
      )}
      
    </div>
  );
}

export default LoginHistory;