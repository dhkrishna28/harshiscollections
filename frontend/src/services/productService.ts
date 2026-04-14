import api from './api';
import type { ApiResponse, PaginatedResponse, Product } from '../types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export const productService = {
  list: (filters: ProductFilters = {}) =>
    api.get<PaginatedResponse<Product>>('/user/products', { params: filters }).then((r) => r.data),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Product>>(`/user/products/${slug}`).then((r) => r.data),
};
