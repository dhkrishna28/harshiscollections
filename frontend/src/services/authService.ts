import api from './api';
import type { ApiResponse, AuthUser } from '../types';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { first_name: string; last_name: string; email: string; password: string; phone?: string; }
export interface LoginResponse { token: string; user: AuthUser; }

export const authService = {
  login: (data: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>('/user/auth/login', data).then((r) => r.data),

  register: (data: RegisterPayload) =>
    api.post<ApiResponse<null>>('/user/auth/register', data).then((r) => r.data),

  verifyEmail: (token: string) =>
    api.get<ApiResponse<null>>(`/user/auth/verify-email/${token}`).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/user/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, new_password: string) =>
    api.post<ApiResponse<null>>('/user/auth/reset-password', { token, new_password }).then((r) => r.data),
};
