import api from './api';
import type { ApiResponse, PaginatedResponse, Order } from '../types';

export interface PlaceOrderPayload {
  payment_method: string;
  shipping_name: string;
  shipping_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal: string;
  shipping_country?: string;
  notes?: string;
}

export const orderService = {
  placeOrder: (data: PlaceOrderPayload) =>
    api.post<ApiResponse<{ order_id: number; order_number: string }>>('/user/orders', data).then((r) => r.data),

  myOrders: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Order>>('/user/orders', { params: { page, limit } }).then((r) => r.data),

  getOrderDetail: (id: number) =>
    api.get<ApiResponse<Order>>(`/user/orders/${id}`).then((r) => r.data),
};
