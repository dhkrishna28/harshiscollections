import api from './api';

export interface ProductImage {
  id: number;
  image_path: string;
  sort_order: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  category_id: number;
  category?: { id: number; name: string };
  brand?: string;
  price: number;
  compare_at_price?: number | null;
  availability_status: 'in_stock' | 'out_of_stock';
  status: 'draft' | 'published';
  is_active: boolean;
  is_featured: boolean;
  stock_quantity: number;
  images?: ProductImage[];
  created_at: string;
}

export interface ProductListResponse {
  products: AdminProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  sku?: string;
  category_id: number;
  brand?: string;
  material?: string;
  craft_print_type?: string;
  style?: string;
  neckline?: string;
  description?: string;
  short_description?: string;
  specifications?: string;
  wash_care?: string;
  shipping_info?: string;
  ideal_for?: string;
  sizes?: string[];
  price: number;
  compare_at_price?: number | null;
  availability_status?: string;
  status?: string;
  stock_quantity?: number;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

// Backend list shape: { success, total, page, data: rows }
type BackendList<T> = { success: boolean; total: number; page: number; data: T[] };
// Backend single shape: { success, data: item }
type BackendSingle<T> = { success: boolean; data: T };

export const productService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    status?: string;
  }): Promise<ProductListResponse> {
    const limit = params?.limit ?? 10;
    const res = await api.get<BackendList<AdminProduct>>('/products', { params });
    const { data, total, page: currentPage } = res.data;
    return {
      products: data ?? [],
      pagination: {
        total: total ?? 0,
        page: currentPage ?? 1,
        limit,
        totalPages: Math.max(1, Math.ceil((total ?? 0) / limit)),
      },
    };
  },

  async getById(id: number): Promise<AdminProduct> {
    const res = await api.get<BackendSingle<AdminProduct>>(`/products/${id}`);
    return res.data.data;
  },

  async create(data: CreateProductPayload, images?: File[]): Promise<AdminProduct> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (Array.isArray(val)) {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, String(val));
      }
    });
    // Include featured image and any gallery images in the same multipart request
    if (images && images.length > 0) {
      // first file as featured_image
      formData.append('featured_image', images[0]);
      // remaining files as images[]
      images.slice(1).forEach((file) => formData.append('images', file));
    }
    // DEBUG: log files and FormData keys in browser console to help troubleshooting
    try {
      if (typeof window !== 'undefined' && (window as any).console) {
        console.debug('[productService.create] files count:', images ? images.length : 0);
        // enumerate formData keys
        for (const pair of (formData as any).entries()) {
          console.debug('[productService.create] formData entry:', pair[0], pair[1]);
        }
      }
    } catch (e) {
      /* ignore debug errors */
    }
    const res = await api.post<BackendSingle<AdminProduct>>('/products', formData);
    return res.data.data;
  },

  async update(
    id: number,
    data: Partial<CreateProductPayload>,
    images?: File[]
  ): Promise<AdminProduct> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (Array.isArray(val)) {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, String(val));
      }
    });
    // Send featured + gallery images in the same update request when possible
    if (images && images.length > 0) {
      formData.append('featured_image', images[0]);
      images.slice(1).forEach((file) => formData.append('images', file));
    }
    // DEBUG: log files and FormData keys in browser console to help troubleshooting
    try {
      if (typeof window !== 'undefined' && (window as any).console) {
        console.debug('[productService.update] files count:', images ? images.length : 0);
        for (const pair of (formData as any).entries()) {
          console.debug('[productService.update] formData entry:', pair[0], pair[1]);
        }
      }
    } catch (e) {
      /* ignore debug errors */
    }
    const res = await api.put<BackendSingle<AdminProduct>>(`/products/${id}`, formData);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async deleteImage(productId: number, imageId: number): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  },
};
