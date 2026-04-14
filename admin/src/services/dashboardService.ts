import api from './api';

export interface DashboardOverview {
  total_users: number;
  total_products: number;
  total_orders: number;
  pending_orders: number;
  month_revenue: number;
  last_month_revenue: number;
  recent_orders: RecentOrder[];
}

export interface RecentOrder {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  user?: { name: string; email: string };
}

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const res = await api.get<{ success: boolean; data: DashboardOverview }>('/dashboard/overview');
    return res.data.data;
  },
};
