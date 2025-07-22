import { useCallback } from 'react';
import apiClient from './apiClient';
import { useAuth } from '../context/AuthContext';

const useApi = () => {
  const { setAccessToken, setRefreshToken, setSessionId, logout } = useAuth();

  const callApi = useCallback(async (endpoint, options = {}, initialAccessToken = null) => {
    const setAuthTokens = (newAccessToken, newRefreshToken, newSessionId) => {
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setSessionId(newSessionId);
    };

    return apiClient(
      endpoint,
      options,
      setAuthTokens,
      logout,
      initialAccessToken
    );
  }, [setAccessToken, setRefreshToken, setSessionId, logout]);

  return callApi;
};

export default useApi;
