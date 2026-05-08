import axios from "axios";

/** Event name dispatched when the server returns 401 */
export const AUTH_UNAUTHORIZED_EVENT = "smartQueue.auth.unauthorized";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.trim() || "/api",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
  // Required so the browser sends the httpOnly `access_token` cookie
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      // Notify in-memory auth state to clear; don't touch the httpOnly cookie.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }
    }

    return Promise.reject(error);
  },
);

export default api;
