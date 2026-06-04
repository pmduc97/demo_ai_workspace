import axios from 'axios';
import { getMessage } from '../constants/messages';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function parseApiError(error, fallbackMessageId = 'COMMON-E-001') {
  const data = error?.response?.data;
  if (data?.messageId) return getMessage(data.messageId, data.message);
  if (data?.message) return data.message;
  return getMessage(fallbackMessageId);
}

export default api;
