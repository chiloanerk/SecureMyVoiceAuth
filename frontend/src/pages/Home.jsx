import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { accessToken } = useAuth();

  return (
    <div>
      <h1>API Routes</h1>
      <ul>
        {!accessToken ? (
          <>
            <li><Link to="/signup">Signup (POST)</Link></li>
            <li><Link to="/login">Login (POST)</Link></li>
          </>
        ) : null}
        <li><Link to="/forgot-password">Forgot Password (POST)</Link></li>
        {accessToken ? (
          <>
            <li><Link to="/verify-email">Verify Email (POST)</Link></li>
            <li><Link to="/resend-verification-email">Resend Verification Email (POST)</Link></li>
            <li><Link to="/reset-password">Reset Password (POST)</Link></li>
            <li><Link to="/logout">Logout (DELETE)</Link></li>
            <li><Link to="/profile">Profile (GET)</Link></li>
            <li><Link to="/update-profile">Update Profile (PUT)</Link></li>
            <li><Link to="/history">Login History (GET)</Link></li>
            <li><Link to="/sessions">Active Sessions (GET)</Link></li>
          </>
        ) : null}
      </ul>
    </div>
  );
}

export default Home;