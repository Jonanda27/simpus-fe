import axios from 'axios';

// Buat instance axios terpusat
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', // sesuaikan dengan port backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to automatically inject token
api.interceptors.request.use((config) => {
  try {
    // Only access localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsedData = JSON.parse(authStorage);
        const token = parsedData?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
  } catch (error) {
    console.error('Failed to parse auth token', error);
  }
  return config;
});

export default api;
