export type UserRole = "admin" | "customer";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser extends SafeUser {}

export interface UserRecord extends AuthenticatedUser {
  passwordHash: string;
}
