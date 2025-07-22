import API_BASE_URL from '../config';

const api = async (endpoint, options = {}, accessToken, logout) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = accessToken;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    console.error('Request failed with 401. Forcing logout.');
    logout();
  }

  return response;
};

export default api;