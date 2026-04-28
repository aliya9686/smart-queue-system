import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../utils/authStorage";
import { getApiErrorMessage } from "../utils/httpError";
import type {
  AuthActionResult,
  AuthContextValue,
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function clearSession(): void {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }

  function persistSession({ token: nextToken, user: nextUser }: AuthResponse): void {
    setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  async function refreshProfile(): Promise<AuthUser> {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }

  async function register(payload: RegisterPayload): Promise<AuthActionResult> {
    try {
      const authData = await registerUser(payload);
      persistSession(authData);
      return { success: true, user: authData.user };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, "Unable to create your account."),
      };
    }
  }

  async function login(payload: LoginPayload): Promise<AuthActionResult> {
    try {
      const authData = await loginUser(payload);
      persistSession(authData);
      return { success: true, user: authData.user };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, "Unable to sign in."),
      };
    }
  }

  function logout() {
    clearSession();
  }

  useEffect(() => {
    function handleUnauthorized(): void {
      clearSession();
      setIsLoading(false);
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    async function bootstrapSession(): Promise<void> {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch (error) {
        clearSession();
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
