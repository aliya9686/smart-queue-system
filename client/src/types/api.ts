import type { AuthUser } from "./auth";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: string[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}

export interface AdminOverviewResponse {
  message: string;
  queueSummary: {
    activeCounters: number;
    waitingCustomers: number;
    currentWindow: string;
  };
  user: AuthUser;
}
