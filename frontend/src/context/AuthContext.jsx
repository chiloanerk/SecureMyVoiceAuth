import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    } else {
      localStorage.removeItem('sessionId');
    }
  }, [sessionId]);

  const login = (newAccessToken, newRefreshToken, newSessionId) => {
    console.log('AuthContext: Logging in...');
    console.log('AuthContext: newAccessToken:', newAccessToken ? '[present]' : '[missing]');
    console.log('AuthContext: newRefreshToken:', newRefreshToken ? '[present]' : '[missing]');
    console.log('AuthContext: newSessionId:', newSessionId ? '[present]' : '[missing]');
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setSessionId(newSessionId);
  };

  const logout = () => {
    console.log('AuthContext: Logging out...');
    setAccessToken(null);
    setRefreshToken(null);
    setSessionId(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, sessionId, login, logout, setAccessToken, setRefreshToken, setSessionId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);