// services/auth.service.ts
import api from "../lib/axios";
import { LoginPayload, LoginResponse, RegisterPayload, User } from "../types";

export const register = async (data: RegisterPayload): Promise<User> => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};
