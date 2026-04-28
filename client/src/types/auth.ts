export type UserRole = "admin" | "customer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export type AuthActionResult =
  | {
      success: true;
      user: AuthUser;
    }
  | {
      success: false;
      message: string;
    };

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (payload: RegisterPayload) => Promise<AuthActionResult>;
  login: (payload: LoginPayload) => Promise<AuthActionResult>;
  logout: () => void;
  refreshProfile: () => Promise<AuthUser>;
}
