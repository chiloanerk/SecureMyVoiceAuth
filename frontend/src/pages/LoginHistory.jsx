import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../utils/useApi';

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
      <div className="form-container">
        <p>Loading login history...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
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
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>{entry.ipAddress}</td>
                  <td>{entry.deviceInfo}</td>
                  <td>{entry.location}</td>
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
