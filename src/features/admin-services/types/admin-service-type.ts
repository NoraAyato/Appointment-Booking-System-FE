import type { UploadFile } from 'antd';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminServiceStatus = 'ACTIVE' | 'INACTIVE';

export interface AdminServiceImage {
  picture: string;
  isMainImage: boolean;
}

export interface AdminService {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  status: string;
  categoryName: string;
  serviceImageList: AdminServiceImage[] | null;
}

export interface AdminServiceFilterParams extends FilterParams {
  keyword?: string;
  status?: AdminServiceStatus;
}

export interface PublicCategoryOption {
  id: string;
  name: string;
}

export interface AdminServiceOption {
  id: string;
  name: string;
}

export interface AdminServiceBasePayload {
  description: string;
  durationMinutes: number;
  images?: Blob[];
  name: string;
  price: number;
}

export interface CreateAdminServicePayload extends AdminServiceBasePayload {
  categoryId: string;
}

export interface UpdateAdminServicePayload extends AdminServiceBasePayload {
  categoryName: string;
  status: AdminServiceStatus;
}

export interface AdminServiceFormValues {
  categoryValue: string;
  description: string;
  durationMinutes: number;
  images?: UploadFile[];
  mainImageUid?: string;
  name: string;
  price: number;
  status?: AdminServiceStatus;
}
