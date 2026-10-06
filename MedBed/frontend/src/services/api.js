import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medbed_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medbed_token');
      localStorage.removeItem('medbed_user');
    }
    return Promise.reject(err);
  }
);

export default api;
