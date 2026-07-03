import type { CurrentUserData, User } from '../types/user-type';

export const toUser = (data: CurrentUserData): User => ({
  id: data.userId,
  fullName: data.userName || `${data.lastName ?? ''} ${data.firstName ?? ''}`.trim(),
  email: data.email,
  role: data.role,
  avatarUrl: data.picture?.trim() ?? '',
  phone: data.phoneNumber ?? '',
  firstName: data.firstName,
  lastName: data.lastName,
  status: data.status,
  gender: data.gender,
  receiveEmail: data.receiveEmail,
});
