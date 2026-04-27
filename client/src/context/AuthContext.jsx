import { createContext, useContext, useEffect, useState } from "react";

import api, { attachAuthInterceptors } from "../api/axios";

const AuthContext = createContext(null);
const STORAGE_KEY = "smartQueueAuthToken";

function extractErrorMessage(error) {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.join(" ");
  }

  return error.response?.data?.message || "Something went wrong. Please try again.";
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function clearAuthState() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  function persistAuth({ token: nextToken, user: nextUser }) {
    localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  async function refreshProfile() {
    const response = await api.get("/auth/me");
    setUser(response.data.user);
    return response.data.user;
  }

  async function register(payload) {
    try {
      const response = await api.post("/auth/register", payload);
      persistAuth(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error) };
    }
  }

  async function login(payload) {
    try {
      const response = await api.post("/auth/login", payload);
      persistAuth(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error) };
    }
  }

  function logout() {
    clearAuthState();
  }

  useEffect(() => {
    const detach = attachAuthInterceptors(() => token, clearAuthState);
    return detach;
  }, [token]);

  useEffect(() => {
    async function bootstrapSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch (error) {
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    }

    bootstrapSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(token && user),
        register,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
