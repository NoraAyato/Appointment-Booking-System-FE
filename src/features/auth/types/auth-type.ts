export type UserRole = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}
