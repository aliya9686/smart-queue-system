export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type HealthStatus = {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
};
