import api from './api';
import type { AdminUser } from '../context/AuthContext';

export interface LoginResponse {
  success: boolean;
  token: string;
  admin: AdminUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return res.data;
  },

  async me(): Promise<AdminUser> {
    const res = await api.get<{ success: boolean; admin: AdminUser }>('/auth/me');
    return res.data.admin;
  },
};
