import api from './api';
import type { AdminUser } from '../context/AuthContext';

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<{ token: string; admin: AdminUser }>('/auth/login', {
      email,
      password,
    });
    return res.data;
  },

  async me(): Promise<AdminUser> {
    const res = await api.get<{ admin: AdminUser }>('/auth/me');
    return res.data.admin;
  },
};
