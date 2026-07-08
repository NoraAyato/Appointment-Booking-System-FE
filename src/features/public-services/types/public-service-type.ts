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
