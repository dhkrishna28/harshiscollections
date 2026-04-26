import api from './api';
import type { AuthUser } from '../types';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { first_name: string; last_name: string; email: string; password: string; phone?: string; }
export interface MessageResponse { success: boolean; message?: string; }
export interface LoginResponse extends MessageResponse { token: string; user: AuthUser; }

export const authService = {
  login: (data: LoginPayload) =>
    api.post<LoginResponse>('/user/auth/login', data).then((r) => r.data),

  register: (data: RegisterPayload) =>
    api.post<MessageResponse>('/user/auth/register', data).then((r) => r.data),

  verifyEmail: (token: string) =>
    api.get<MessageResponse>(`/user/auth/verify-email/${token}`).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post<MessageResponse>('/user/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, new_password: string) =>
    api.post<MessageResponse>('/user/auth/reset-password', { token, new_password }).then((r) => r.data),
};
