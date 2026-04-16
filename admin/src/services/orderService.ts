import api from './api';

export type TransactionStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface AdminTransaction {
  id: number;
  order_id: number;
  transaction_id: string;
  gateway: string;
  amount: number;
  currency?: string;
  status: TransactionStatus;
  created_at: string;
  paid_at?: string | null;
  order?: {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    shipping_charge: number;
    discount: number;
    total: number;
    shipping_name?: string;
    shipping_phone?: string;
    shipping_address?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_postal?: string;
    shipping_country?: string;
    user?: { id: number; first_name: string; last_name: string; email: string; phone?: string };
    items?: {
      id: number;
      product_name?: string;
      selected_size?: string | null;
      quantity: number;
      unit_price: number;
      total_price?: number;
      product?: { id: number; name: string; sku?: string };
    }[];
  };
}

export interface TransactionListResponse {
  transactions: AdminTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface AdminOrder {
  id: number;
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  user?: { id: number; first_name: string; last_name: string; email: string };
  items?: OrderItem[];
  transaction?: AdminTransaction;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name?: string;
  selected_size?: string | null;
  quantity: number;
  unit_price: number;
  total_price?: number;
  product?: { id: number; name: string; sku?: string };
}

export interface OrderListResponse {
  orders: AdminOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Backend list shape: { success, total, page, data: rows }
type BackendList<T> = { success: boolean; total: number; page: number; data: T[] };
type BackendSingle<T> = { success: boolean; data: T };

export const orderService = {
  async listTransactions(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<TransactionListResponse> {
    const limit = params?.limit ?? 10;
    const res = await api.get<BackendList<AdminTransaction>>('/transactions', { params });
    const { data, total, page: currentPage } = res.data;
    return {
      transactions: data ?? [],
      pagination: {
        total: total ?? 0,
        page: currentPage ?? 1,
        limit,
        totalPages: Math.max(1, Math.ceil((total ?? 0) / limit)),
      },
    };
  },

  async getTransaction(id: string | number): Promise<AdminTransaction> {
    const res = await api.get<BackendSingle<AdminTransaction>>(`/transactions/${id}`);
    return res.data.data;
  },

  async listOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<OrderListResponse> {
    const limit = params?.limit ?? 10;
    const res = await api.get<BackendList<AdminOrder>>('/orders', { params });
    const { data, total, page: currentPage } = res.data;
    return {
      orders: data ?? [],
      pagination: {
        total: total ?? 0,
        page: currentPage ?? 1,
        limit,
        totalPages: Math.max(1, Math.ceil((total ?? 0) / limit)),
      },
    };
  },

  async getOrder(id: string | number): Promise<AdminOrder> {
    const res = await api.get<BackendSingle<AdminOrder>>(`/orders/${id}`);
    return res.data.data;
  },

  async updateOrderStatus(id: string | number, status: OrderStatus): Promise<AdminOrder> {
    const res = await api.patch<BackendSingle<AdminOrder>>(`/orders/${id}/status`, { status });
    return res.data.data;
  },
};
