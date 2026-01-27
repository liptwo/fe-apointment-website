// services/auth.service.ts
import api from "../lib/axios";
import { RegisterPayload, User } from "../types";

export const register = async (data: RegisterPayload): Promise<User> => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};
