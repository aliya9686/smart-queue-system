import axios from "axios";
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredToken,
  getStoredToken,
} from "../utils/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.trim() || "/api",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getStoredToken()) {
      clearStoredToken();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }
    }

    return Promise.reject(error);
  },
);

export default api;
