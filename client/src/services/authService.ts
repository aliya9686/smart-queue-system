import api from "../api/axios";
import type { ApiSuccess } from "../types/api";
import type { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from "../types/auth";

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<ApiSuccess<AuthResponse>>("/auth/login", payload);
  return response.data.data;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<ApiSuccess<AuthResponse>>("/auth/register", payload);
  return response.data.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<ApiSuccess<{ user: AuthUser }>>("/auth/me", {
    skipAuthRedirect: true,
  });
  return response.data.data.user;
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}
