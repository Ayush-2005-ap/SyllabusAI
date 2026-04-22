import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use your machine's local IP so it works from both Simulator and physical device
const BASE_URL = 'http://192.168.1.34:5050/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
