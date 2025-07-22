import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Profile() {
  const { accessToken, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        setError('No access token found. Please log in.');
        return;
      }
      try {
        const response = await api('/profile', {
          method: 'GET',
        }, accessToken, logout);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfileData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken, logout]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Profile (GET)</h1>
      <p>Note: This route requires authentication.</p>
      {profileData ? (
        <pre>{JSON.stringify(profileData, null, 2)}</pre>
      ) : (
        <p>No profile data found.</p>
      )}
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Profile;