import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../utils/useApi';

function Profile() {
  const callApi = useApi();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await callApi('/profile', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.user); // Assuming the API returns { success: true, user: { ... } }
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to fetch profile data.');
        }
      } catch (err) {
        console.error('Profile Fetch Error:', err);
        setError('Network error or unable to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [callApi]);

  if (loading) {
    return (
      <div className="form-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>User Profile</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {profileData ? (
        <div>
          <p><strong>Email:</strong> {profileData.email}</p>
          {profileData.username && <p><strong>Username:</strong> {profileData.username}</p>}
          {/* Add other profile fields as needed */}
          <p><strong>Email Verified:</strong> {profileData.isEmailVerified ? 'Yes' : 'No'}</p>
          <p><strong>Created At:</strong> {new Date(profileData.createdAt).toLocaleDateString()}</p>
          <p><strong>Last Updated:</strong> {new Date(profileData.updatedAt).toLocaleDateString()}</p>
          <Link to="/update-profile" className="btn btn-primary">Update Profile</Link>
        </div>
      ) : (
        <p>No profile data found. Please ensure you are logged in.</p>
      )}
      
    </div>
  );
}

export default Profile;
