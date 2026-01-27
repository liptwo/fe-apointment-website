// types/index.ts

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "GUEST" | "HOST";
}

export interface AvailabilityRulePayload {
  ruleType: "WEEKLY" | "DATE_RANGE";
  daysOfWeek: string; // "MON,TUE,WED"
  startHour: number;
  endHour: number;
  specialty: string;
  description: string;
  address: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "GUEST" | "HOST" | "ADMIN";
  is_active?: boolean;
  created_at?: string; // from GET /users
  createdAt?: string; // from register
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface UpdateUserStatusResponse {
    id: string;
    is_active: boolean;
    updated_at: string;
}
