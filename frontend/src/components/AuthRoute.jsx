import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRoute = ({ children }) => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthRoute;