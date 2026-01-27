// services/user.service.ts
import api from "../lib/axios";
import { User, PaginatedData, UpdateUserStatusResponse } from "../types";

interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: "GUEST" | "HOST" | "ADMIN";
}

export const getUsers = async ({ page, limit, role }: GetUsersParams): Promise<PaginatedData<User>> => {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (role) params.append("role", role);

  const response = await api.get<PaginatedData<User>>(`/users?${params.toString()}`);
  return response.data;
};

export const updateUserStatus = async (id: string, active: boolean): Promise<UpdateUserStatusResponse> => {
  const response = await api.patch<UpdateUserStatusResponse>(`/users/${id}/status?active=${active}`);
  return response.data;
};
