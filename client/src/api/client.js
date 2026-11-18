import axios from 'axios';

// The doc states API is at /api/* (no /api/v1 prefix)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT from localStorage
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vibe2fix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401/403 session errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // If token expired or account disabled, clear local token
      if (error.response.status === 401) {
        localStorage.removeItem('vibe2fix_token');
        localStorage.removeItem('vibe2fix_user');
      }
    }
    return Promise.reject(error);
  }
);

export default client;
