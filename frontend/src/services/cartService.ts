import api from './api';
import type { ApiResponse, Cart } from '../types';

export const cartService = {
  getCart: () =>
    api.get<ApiResponse<Cart>>('/user/cart').then((r) => r.data),

  addItem: (product_id: number, quantity: number = 1, selected_size?: string | null) =>
    api.post<ApiResponse<null>>('/user/cart/items', { product_id, quantity, selected_size }).then((r) => r.data),

  updateItem: (itemId: number, quantity: number) =>
    api.put<ApiResponse<null>>(`/user/cart/items/${itemId}`, { quantity }).then((r) => r.data),

  removeItem: (itemId: number) =>
    api.delete<ApiResponse<null>>(`/user/cart/items/${itemId}`).then((r) => r.data),

  clearCart: () =>
    api.delete<ApiResponse<null>>('/user/cart').then((r) => r.data),
};
