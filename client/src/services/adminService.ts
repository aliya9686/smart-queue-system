import api from "../api/axios";
import type { AdminOverviewResponse, ApiSuccess } from "../types/api";

export async function getAdminOverview(): Promise<AdminOverviewResponse> {
  const response = await api.get<ApiSuccess<AdminOverviewResponse>>("/auth/admin/overview");
  return response.data.data;
}
