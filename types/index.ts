// types/index.ts

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "GUEST" | "HOST";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "GUEST" | "HOST" | "ADMIN";
  createdAt: string;
}
