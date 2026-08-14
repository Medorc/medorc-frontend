import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, "")}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to inject JWT Auth Token into every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { API_BASE_URL, BACKEND_URL };
export default api;
