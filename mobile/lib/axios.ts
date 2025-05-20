// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = "your-access-token"; // atau ambil dari AsyncStorage/SecureStore
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
