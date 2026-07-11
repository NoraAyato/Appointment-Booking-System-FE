import type { FilterParams } from '@/shared/types/filter-params-type';

export interface PublicTopRatedReviewItem {
  id: string;
  customerName: string;
  customerAvatar: string | null;
  serviceName: string;
  imageUrl: string | null;
  content: string;
  rating: number;
  serviceDate: string;
}

export interface PublicTopRatedReviewModel {
  id: string;
  customerName: string;
  avatarUrl?: string;
  serviceName: string;
  imageUrl?: string;
  content: string;
  rating: number;
  serviceDate: string;
}

export interface PublicServiceReviewRatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface PublicServiceReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: PublicServiceReviewRatingDistribution[];
}

export interface PublicServiceReviewItem {
  id: string;
  customerName: string;
  customerAvatar: string | null;
  imageUrl: string | null;
  content: string;
  rating: number;
  createdAt: string;
  staffName: string;
  serviceDate: string;
}

export interface PublicServiceReviewModel {
  id: string;
  customerName: string;
  avatarUrl?: string;
  imageUrls: string[];
  content: string;
  rating: number;
  createdAt: string;
  staffName: string;
  serviceDate: string;
}

export interface PublicServiceReviewFilterParams extends FilterParams {
  serviceId: string;
}
