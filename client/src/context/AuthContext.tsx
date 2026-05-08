import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AUTH_UNAUTHORIZED_EVENT } from "../api/axios";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";
import type {
  AuthActionResult,
  AuthContextValue,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";
import { getApiErrorMessage } from "../utils/httpError";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // Prevent duplicate bootstrap calls in React StrictMode.
  const bootstrapped = useRef(false);

  function clearSession(): void {
    setUser(null);
  }

  async function loadCurrentUser(): Promise<AuthUser> {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }

  async function register(payload: RegisterPayload): Promise<AuthActionResult> {
    try {
      const { user: nextUser } = await registerUser(payload);
      setUser(nextUser);
      return { success: true, user: nextUser };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, "Unable to create your account."),
      };
    }
  }

  async function login(payload: LoginPayload): Promise<AuthActionResult> {
    try {
      const { user: nextUser } = await loginUser(payload);
      setUser(nextUser);
      return { success: true, user: nextUser };
    } catch (error) {
      return {
        success: false,
        message: getApiErrorMessage(error, "Unable to sign in."),
      };
    }
  }

  async function logout(): Promise<void> {
    try {
      await logoutUser();
    } finally {
      clearSession();
    }
  }

  useEffect(() => {
    function handleUnauthorized(): void {
      clearSession();
      setIsLoading(false);

      if (location.pathname !== "/login") {
        navigate("/login", {
          replace: true,
          state: { from: location },
        });
      }
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [location, navigate]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    async function bootstrapSession(): Promise<void> {
      try {
        await loadCurrentUser();
      } catch {
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
        isLoading,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout,
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
