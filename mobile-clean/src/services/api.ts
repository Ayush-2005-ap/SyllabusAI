import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use your machine's local IP or localhost for simulator
const BASE_URL = 'http://10.77.145.234:5050/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI processing
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
