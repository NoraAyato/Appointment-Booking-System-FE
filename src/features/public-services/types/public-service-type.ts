export interface PublicServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  rating: number;
  category: string;
  categoryTagColor: string;
  images: string[] | null;
}

export interface PublicServiceCardModel {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  rating: number;
  description: string;
  accentColor: string;
  imageUrl?: string;
  imageUrls: string[];
  location: string;
}

export interface PublicServiceFilterParams {
  categoryId?: string;
  date?: string;
  keyWord?: string;
  limit: number;
  page: number;
  time?: string;
}

export interface PublicCategoryOption {
  id: string;
  name: string;
}

export interface PublicServiceDetailRouteState {
  date?: string;
  service?: PublicServiceCardModel;
  time?: string;
}

export interface PublicServiceStaffItem {
  id: string;
  staffName: string;
  staffAvatar: string | null;
  rating: number;
  completedServices: number;
  specialties: string[];
}

export interface PublicServiceStaffModel {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  completedServices: number;
  specialties: string[];
}

export interface PublicServiceStaffFilterParams {
  date: string;
  serviceId: string;
  time: string;
}

export interface PublicServiceAvailableTimeSlotItem {
  startTime: string;
  endTime: string;
  availableStaffCount: number;
}

export type PublicServiceAvailableTimeSlotModel = PublicServiceAvailableTimeSlotItem;

export interface PublicServiceAvailableTimeSlotFilterParams {
  date: string;
  serviceId: string;
}
