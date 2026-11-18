import client from './client';
import { mockAuthApi } from '../mock/mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const realAuthApi = {
  register: (userData) => client.post('/api/auth/register', userData),
  login: (credentials) => client.post('/api/auth/login', credentials),
  getMe: () => client.get('/api/auth/me'),
  forgotPassword: (email) => client.post('/api/auth/forgot-password', { email }),
  resetPassword: (payload) => client.post('/api/auth/reset-password', payload),
};

export const authApi = USE_MOCK ? mockAuthApi : realAuthApi;
