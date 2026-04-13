import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Set base URL for Android Emulator or Physical Device
const BASE_URL = 'http://localhost:5000/api'; // Replace with actual backend IP for physical device

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
