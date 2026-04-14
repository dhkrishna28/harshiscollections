import api from './api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export const categoryService = {
  async list(): Promise<Category[]> {
    const res = await api.get<{ success: boolean; total: number; data: Category[] }>('/categories');
    return res.data.data ?? [];
  },
};
