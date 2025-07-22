import API_BASE_URL from '../config';

const apiClient = async (
  endpoint,
  options = {},
  setAuthTokens,
  logout,
  initialAccessToken = null // New parameter
) => {
  let accessToken = initialAccessToken || localStorage.getItem('accessToken');
  let refreshToken = localStorage.getItem('refreshToken');
  let sessionId = localStorage.getItem('sessionId');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = accessToken;
    console.log(`apiClient: Sending request to ${endpoint} with accessToken: ${accessToken.substring(0, 10)}...`);
  } else {
    console.log(`apiClient: Sending request to ${endpoint} without accessToken.`);
  }

  const config = {
    ...options,
    headers,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If 401 and not a refresh token request itself, try to refresh
  if (response.status === 401 && endpoint !== '/refresh-token') {
    console.warn('apiClient: Access token expired. Attempting to refresh...');
    if (refreshToken && sessionId) {
      console.log(`apiClient: Attempting refresh with refreshToken: ${refreshToken.substring(0, 10)}... and sessionId: ${sessionId.substring(0, 10)}...`);
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken, sessionId }),
        });

        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok) {
          console.log('apiClient: Token refreshed successfully.', refreshData);
          setAuthTokens(refreshData.accessToken, refreshData.refreshToken, refreshData.sessionId);

          // Update accessToken for the retry
          accessToken = refreshData.accessToken;
          headers['Authorization'] = accessToken;
          config.headers = headers;
          console.log(`apiClient: Retrying original request to ${endpoint} with new accessToken: ${accessToken.substring(0, 10)}...`);
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
          console.error('apiClient: Failed to refresh token:', refreshData);
          logout(); // Force logout if refresh fails
        }
      } catch (refreshError) {
        console.error('apiClient: Error during token refresh:', refreshError);
        logout(); // Force logout on network error during refresh
      }
    } else {
      console.error('apiClient: No refresh token or session ID available. Forcing logout.');
      logout();
    }
  }

  return response;
};

export default apiClient;