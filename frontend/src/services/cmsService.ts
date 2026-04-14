import api from './api';
import type { ApiResponse, CmsPage, CmsPageKey, Category } from '../types';

export const cmsService = {
  getPage: (key: CmsPageKey) =>
    api.get<ApiResponse<CmsPage>>(`/user/cms/pages/${key}`).then((r) => r.data),

  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/user/cms/categories').then((r) => r.data),

  submitContact: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    api.post<ApiResponse<null>>('/user/cms/contact', data).then((r) => r.data),
};
