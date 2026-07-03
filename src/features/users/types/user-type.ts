export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  gender?: boolean;
  receiveEmail?: boolean;
}

export interface CurrentUserData {
  userId: string;
  userName: string;
  email: string;
  picture: string | null;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  status: string;
  role: UserRole;
  gender: boolean;
  receiveEmail: boolean;
}
