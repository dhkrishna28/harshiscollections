import api from './api';
import type { ApiResponse, User } from '../types';

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export const accountService = {
  getProfile: () =>
    api.get<ApiResponse<User>>('/user/account/profile').then((r) => r.data),

  updateProfile: (data: UpdateProfilePayload) =>
    api.put<ApiResponse<User>>('/user/account/profile', data).then((r) => r.data),

  changePassword: (current_password: string, new_password: string) =>
    api.put<ApiResponse<null>>('/user/account/change-password', { current_password, new_password }).then((r) => r.data),
};
